"""
Routermill bot — desktop companion to /tools/routermill on ness.city.

Reads `router_queue.csv` (downloaded from the web app), continuously scans
the airwaves for any router in the queue, and runs the CelcomDigi setup
wizard against each one as it appears.

Run:
    python main.py

Stop with Ctrl+C.
"""

import csv
import time
from playwright.sync_api import sync_playwright

import wifi_tools
import router_bot

QUEUE_FILE = "router_queue.csv"
ROUTER_URL = "http://192.168.1.1"
DEFAULT_LOGIN_USER = "customer"
DEFAULT_LOGIN_PASS = "celcomdigi123"
FALLBACK_NEW_PASS = "darktalent2024!"


def load_queue():
    """Load the queue CSV. Tolerates both the new web-app schema
    (serial_number, default_ssid, ...) and the legacy schema (S/N, ...)."""
    queue = []
    try:
        with open(QUEUE_FILE, "r", encoding="utf-8-sig") as f:
            reader = csv.DictReader(f)
            for raw in reader:
                row = _normalize_row(raw)
                if row:
                    queue.append(row)
    except FileNotFoundError:
        print(f"⚠️  '{QUEUE_FILE}' not found. Drop one in this folder.")
    except Exception as e:
        print(f"❌ Error loading queue: {e}")
    return queue


def _normalize_row(raw):
    """Map either schema into the canonical keys the bot uses."""
    sn = raw.get("serial_number") or raw.get("S/N") or ""
    if not sn:
        return None
    return {
        "S/N": sn,
        "Default SSID": raw.get("default_ssid") or raw.get("Default SSID") or "",
        "Default Pass": raw.get("default_pass") or raw.get("Default Pass") or "",
        "New SSID": raw.get("target_ssid") or raw.get("New SSID") or "",
        "New Pass": raw.get("new_pass") or raw.get("New Pass") or "",
    }


def run_router_mill():
    print("🏭 ROUTERMILL: factory mode activated")
    print("   Scanning for routers in queue... (Ctrl+C to stop)\n")

    completed_sns = set()

    while True:
        queue = load_queue()
        total = len(queue)
        pending = [r for r in queue if r["S/N"] not in completed_sns]

        print(f"📊 PROGRESS: {len(completed_sns)}/{total} configured "
              f"({len(pending)} pending)")

        # Scan once, reuse the result.
        visible_ssids = wifi_tools.get_visible_ssids()

        # 1. Mark anything already broadcasting its target SSID as done.
        for row in list(pending):
            target = row["New SSID"]
            if not target:
                continue
            variants = [target, f"{target} 2.4Ghz", f"{target} 5.0Ghz"]
            if any(v in visible_ssids for v in variants):
                print(f"   ✅ {row['S/N']} already broadcasting target. Marking done.")
                completed_sns.add(row["S/N"])

        pending = [r for r in queue if r["S/N"] not in completed_sns]

        if not pending:
            print("   🎉 Queue fully configured. Watching for new entries (10s)...")
            time.sleep(10)
            continue

        # 2. Find a pending router whose default SSID is currently visible.
        target_found = None
        print(f"📡 Scanning defaults... ({len(visible_ssids)} networks visible)")

        for row in pending:
            base = row["Default SSID"].replace("_2.4Ghz", "").replace("_5Ghz", "")
            for suffix in ("_2.4Ghz", "_5Ghz"):
                ssid = f"{base}{suffix}"
                if ssid in visible_ssids:
                    print(f"   🎯 MATCH! {ssid} → {row['S/N']}")
                    target_found = {**row, "Connect SSID": ssid}
                    break
            if target_found:
                break

        if not target_found:
            if visible_ssids:
                print(f"   ⚠️  No match. Visible: {visible_ssids}")
            time.sleep(3)
            continue

        # 3. Process it.
        _process_router(target_found, completed_sns)

        print("------------------------------------------")
        print("Resuming scan in 5s...")
        time.sleep(5)


def _process_router(row, completed_sns):
    new_pass = row.get("New Pass") or ""
    if not new_pass.strip():
        new_pass = FALLBACK_NEW_PASS
        print(f"   ⚠️  No 'new_pass' in CSV. Using fallback: {new_pass}")

    print("\n==========================================")
    print(f"🛠️   PROCESSING: {row['S/N']}")

    if not wifi_tools.connect_to_wifi(row["Connect SSID"], row["Default Pass"]):
        print("❌ Connection failed. Will retry next pass.")
        return

    config = {
        "router_url": ROUTER_URL,
        "login_user": DEFAULT_LOGIN_USER,
        "login_pass": DEFAULT_LOGIN_PASS,
        "new_ssid": row["New SSID"],
        "new_wifi_pass": new_pass,
        "new_admin_pass": new_pass,
    }

    # Phase 1: factory wizard.
    print("2️⃣   [Phase 1] Running setup wizard...")
    success_p1 = _run_playwright(lambda page: router_bot.run_wizard_flow(page, config))

    if not success_p1:
        print("❌ Phase 1 failed. Skipping this router.")
        return

    # Wait for the router to reboot and start broadcasting the new SSID.
    print("\n🔄 Router rebooting. Waiting for new SSID...")
    new_ssid_24 = f"{row['New SSID']} 2.4Ghz"
    detected = False
    for i in range(15):
        visible = wifi_tools.get_visible_ssids()
        if new_ssid_24 in visible or row["New SSID"] in visible:
            print("   ✨ New SSID detected.")
            detected = True
            break
        print(f"   ⏳ ({i + 1}/15) waiting for {new_ssid_24} or {row['New SSID']}...")
        time.sleep(5)

    if not detected:
        print("   ⚠️  New SSID not seen. Trying to reconnect anyway.")

    # Reconnect to the new SSID, then run admin-password change.
    print(f"3️⃣   [Phase 2] Connecting to new WiFi: {new_ssid_24}...")
    reconnected = False
    for _ in range(3):
        if wifi_tools.connect_to_wifi(new_ssid_24, new_pass):
            reconnected = True
            break
        if wifi_tools.connect_to_wifi(row["New SSID"], new_pass):
            reconnected = True
            break
        print("   Retrying connection...")
        time.sleep(5)

    if not reconnected:
        print("❌ Failed to reconnect after wizard. Admin step skipped.")
        return

    print("4️⃣   [Phase 2] Setting admin password...")
    success_p2 = _run_playwright(lambda page: router_bot.run_admin_flow(page, config))

    if success_p2:
        print(f"✅ {row['S/N']} fully configured.")
        completed_sns.add(row["S/N"])
    else:
        print(f"⚠️  {row['S/N']} partial config (WiFi OK, admin failed).")


def _run_playwright(action):
    try:
        with sync_playwright() as p:
            browser = p.chromium.launch(headless=False)
            context = browser.new_context()
            page = context.new_page()
            result = action(page)
            browser.close()
            return result
    except Exception as e:
        print(f"❌ Playwright error: {e}")
        return False


if __name__ == "__main__":
    run_router_mill()
