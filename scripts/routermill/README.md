# Routermill bot

Desktop companion to [`/tools/routermill`](https://ness.city/tools/routermill).

The web app reads router labels and produces a `router_queue.csv`. This bot
takes the CSV, watches the airwaves, and runs the CelcomDigi setup wizard
against each router as it powers on.

Originally built for the Network School coworking buildout in Forest City,
Malaysia. Hand-off target: Aaron (campus AV). Forward-compatible with the
fiber rollout — same routers will be repurposed as mesh extensions.

## What it does

For each row in `router_queue.csv`:

1. **Scans WiFi.** Polls `netsh wlan show networks` until a router's default
   SSID appears.
2. **Connects** to that SSID with the default password.
3. **Runs the wizard** via Playwright at `http://192.168.1.1`:
   - Logs in (`customer` / `celcomdigi123`, or sets up the new-user flow if
     the router was factory-reset).
   - Sets region to Malaysia, walks past Internet Setup.
   - Enables Band Steering. Sets the new SSID and WiFi password (both 2.4G
     and 5G fields).
   - Finishes the wizard.
4. **Waits for reboot** — polls until the new SSID is broadcasting.
5. **Reconnects** to the new SSID with the new password.
6. **Sets the admin password** under Advanced → System Tools → Administration.
7. **Marks the row complete** and looks for the next match.

If a router's target SSID is already on the air, it's marked complete and
skipped.

## Setup (first time only)

Requires Windows (the WiFi layer uses `netsh`).

```bash
# 1. Python 3.10+
python --version

# 2. Install deps
pip install -r requirements.txt
playwright install chromium
```

## Usage

```bash
# 1. Open https://ness.city/tools/routermill on your phone, scan labels,
#    fill in the target SSIDs, download the CSV.
# 2. Drop router_queue.csv into this folder.
# 3. Power on a batch of routers (5-10 at a time is fine).
# 4. Run:
python main.py
```

Then leave the laptop alone — Playwright drives the browser. The bot loops
until you Ctrl+C.

## CSV schema

The CSV the web app emits looks like:

```csv
serial_number,default_ssid,default_pass,target_ssid,new_pass
221... ,B4B@celcomdigi_2.4Ghz,abc123...,NS Room 801,darktalent2024!
```

Legacy column names (`S/N`, `Default SSID`, `Default Pass`, `New SSID`,
`New Pass`) are also accepted.

## Files

- `main.py` — the loop. CSV → scan → connect → wizard → admin → repeat.
- `router_bot.py` — Playwright flows: `run_wizard_flow`, `run_admin_flow`,
  `factory_reset`, `login_to_router`. Saves screenshots + HTML to `debug/`
  on errors.
- `wifi_tools.py` — Windows `netsh` helpers: scan SSIDs, write a WPA2
  profile, connect, verify.
- `reset_router.py` — standalone "factory-reset this one router" entry
  point. Useful when a router is already configured but needs to start over.

## Repurposing for fiber + mesh

When the building moves from CelcomDigi 5G CPE to fiber, these same routers
become wired access points / mesh nodes. The wizard will look different
(WAN setup → bridge mode or AP mode), but the **scan → connect → click →
verify** scaffold in `router_bot.py` is the same. Replace `run_wizard_flow`
with a `run_ap_mode_flow` and reuse everything else.

## Troubleshooting

- **Bot stuck on "Region"**: ensure the latest `router_bot.py` (it has retry
  logic for the Next button on slow firmware).
- **Connection failed**: move the laptop closer to the router, or restart
  the script. The default-SSID broadcast is short-range.
- **AI mis-read a digit**: edit the field directly in the web app before
  downloading the CSV.
- **Need to start over on a router**: `python reset_router.py` will trigger
  a factory restore via the admin UI.

To clear debug artifacts: `rm debug_*.html debug_*.png`.
