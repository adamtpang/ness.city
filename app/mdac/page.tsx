"use client";

import { useEffect, useRef, useState } from "react";

/**
 * /mdac, the Malaysia Digital Arrival Card helper for visa-run regulars.
 *
 * Client-only by design: every value is kept in this browser's localStorage
 * and never sent to any ness.city server. This is identity-grade PII
 * (passport number, DOB), so we deliberately are NOT a place that stores it.
 *
 * V1 is copy-assist: save your details once, open the government form, and
 * tap to copy each field. You solve the CAPTCHA and submit yourself, we never
 * touch the government portal.
 */

const KEY = "ness:mdac:v1";
const MDAC_URL = "https://imigresen-online.imi.gov.my/mdac/main?registerMain";

type Field = { k: string; label: string; hint?: string };
type Group = { title: string; note?: string; fields: Field[] };

// Field set + labels mirror the live MDAC form exactly so values map 1:1.
// "select on form" marks government dropdowns (you pick the option there; the
// saved value is your reminder, and pastes into the searchable ones).
const GROUPS: Group[] = [
  {
    title: "Personal Information",
    note: "Set once. These rarely change.",
    fields: [
      { k: "fullName", label: "Name (as in passport)" },
      { k: "passportNo", label: "Passport No." },
      { k: "dob", label: "Date of Birth", hint: "DD/MM/YYYY" },
      { k: "nationality", label: "Nationality / Citizenship", hint: "select on form" },
      { k: "placeOfBirth", label: "Place of Birth", hint: "select on form" },
      { k: "sex", label: "Sex", hint: "select on form" },
      { k: "passportExpiry", label: "Date of Passport Expiry", hint: "DD/MM/YYYY" },
      { k: "email", label: "Email Address", hint: "use for Email + Confirm Email" },
      { k: "countryCode", label: "Country / Region Code", hint: "select on form, e.g. +1" },
      { k: "mobile", label: "Mobile No." },
    ],
  },
  {
    title: "Traveling Information",
    note: "Trip must be within 3 days of submission. Usually only the dates change.",
    fields: [
      { k: "arrivalDate", label: "Date of Arrival", hint: "DD/MM/YYYY" },
      { k: "departureDate", label: "Date of Departure", hint: "DD/MM/YYYY" },
      { k: "transportNo", label: "Flight / Vessel / Transportation No." },
      { k: "modeOfTravel", label: "Mode of Travel", hint: "select on form" },
      { k: "lastPort", label: "Last Port of Embarkation before Malaysia", hint: "select on form" },
    ],
  },
  {
    title: "Accommodation",
    fields: [
      { k: "accommodation", label: "Accommodation of Stay", hint: "select on form" },
      { k: "address", label: "Address (in Malaysia)", hint: "alphanumeric only" },
      { k: "state", label: "State", hint: "select on form" },
      { k: "postcode", label: "Postcode" },
      { k: "city", label: "City", hint: "select on form" },
    ],
  },
];

export default function MdacPage() {
  const [data, setData] = useState<Record<string, string>>({});
  const [copied, setCopied] = useState<string | null>(null);
  const loaded = useRef(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setData(JSON.parse(raw) as Record<string, string>);
    } catch {
      /* noop */
    }
    loaded.current = true;
  }, []);

  useEffect(() => {
    if (!loaded.current) return;
    try {
      localStorage.setItem(KEY, JSON.stringify(data));
    } catch {
      /* noop */
    }
  }, [data]);

  function set(k: string, v: string) {
    setData((d) => ({ ...d, [k]: v }));
  }

  async function copy(k: string) {
    const v = data[k] ?? "";
    if (!v) return;
    try {
      await navigator.clipboard.writeText(v);
      setCopied(k);
      setTimeout(() => setCopied((c) => (c === k ? null : c)), 1100);
    } catch {
      /* clipboard blocked; user can still select the field */
    }
  }

  function clearAll() {
    if (!window.confirm("Erase your saved MDAC details from this device?")) return;
    setData({});
    try {
      localStorage.removeItem(KEY);
    } catch {
      /* noop */
    }
  }

  const filled = Object.values(data).filter((v) => v && v.trim()).length;

  const field =
    "w-full rounded-lg border border-ink-200 bg-paper px-3 py-2 text-[14px] text-ink-950 placeholder:text-ink-300 focus:border-ink-950 focus:outline-none";

  return (
    <main className="mx-auto max-w-2xl px-5 pb-24 pt-12">
      <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-ink-500">
        Free tool · MDAC
      </p>
      <h1 className="serif mt-2 text-[44px] leading-[1.03] text-ink-950 sm:text-[56px]">
        File your arrival card in seconds.
      </h1>
      <p className="mt-3 max-w-xl text-[15px] leading-[1.6] text-ink-700">
        Save your Malaysia Digital Arrival Card details once. Every visa run,
        open the form and tap to copy each field. No more retyping your passport
        number at the JB checkpoint.
      </p>

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <a
          href={MDAC_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-full bg-[#2563eb] px-5 py-2.5 text-[14px] font-semibold text-white transition-colors hover:bg-[#1d4ed8]"
        >
          Open the MDAC form <span aria-hidden>↗</span>
        </a>
        <span className="font-mono text-[12px] text-ink-500">{filled} fields saved</span>
      </div>

      <div className="mt-5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-[13px] leading-[1.55] text-emerald-800">
        <b>Private by design.</b> Everything here is saved only in this browser,
        on this device. It never leaves your phone and never touches our servers.
        We never auto-submit, you solve the slider puzzle and submit yourself.
      </div>

      {GROUPS.map((g) => (
        <section key={g.title} className="mt-7">
          <div className="flex items-baseline justify-between gap-3">
            <h2 className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-600">
              {g.title}
            </h2>
            {g.note && <span className="text-[11px] text-ink-400">{g.note}</span>}
          </div>
          <div className="mt-3 space-y-2.5">
            {g.fields.map((f) => (
              <div key={f.k}>
                <label className="mb-1 block text-[11px] text-ink-500">{f.label}</label>
                <div className="flex items-center gap-2">
                  <input
                    className={field}
                    value={data[f.k] ?? ""}
                    placeholder={f.hint ?? ""}
                    onChange={(e) => set(f.k, e.target.value)}
                    autoComplete="off"
                    autoCapitalize="off"
                    spellCheck={false}
                  />
                  <button
                    type="button"
                    onClick={() => copy(f.k)}
                    disabled={!data[f.k]}
                    className={`shrink-0 rounded-lg border px-3 py-2 text-[12px] font-medium transition-colors ${
                      copied === f.k
                        ? "border-emerald-300 bg-emerald-50 text-emerald-700"
                        : "border-ink-200 text-ink-700 hover:border-ink-950 disabled:opacity-40"
                    }`}
                  >
                    {copied === f.k ? "Copied" : "Copy"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}

      <div className="mt-10 flex items-center justify-between gap-3 border-t border-ink-200 pt-5">
        <button
          type="button"
          onClick={clearAll}
          className="text-[12px] text-ink-400 underline-offset-2 hover:text-amber-700 hover:underline"
        >
          Erase from this device
        </button>
        <a
          href={MDAC_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-full border border-ink-200 bg-paper px-4 py-2 text-[13px] font-medium text-ink-950 transition-colors hover:border-ink-950"
        >
          Open the MDAC form <span aria-hidden>↗</span>
        </a>
      </div>
    </main>
  );
}
