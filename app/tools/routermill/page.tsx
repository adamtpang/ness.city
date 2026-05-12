"use client";

import Link from "next/link";
import { useState } from "react";
import { FadeIn } from "@/components/motion/FadeIn";

type ScannedImage = {
  id: string;
  src: string;
  status: "idle" | "analyzing" | "done" | "error";
  data?: {
    serial_number: string;
    default_ssid: string;
    default_pass: string;
    target_ssid?: string;
    new_pass?: string;
  };
};

export default function RoutermillPage() {
  const [images, setImages] = useState<ScannedImage[]>([]);
  const [batchRunning, setBatchRunning] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const readyCount = images.filter((i) => i.status === "done").length;

  function handleFiles(fileList: FileList | null) {
    if (!fileList) return;
    const files = Array.from(fileList);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImages((prev) => [
          ...prev,
          {
            id: Math.random().toString(36).slice(2, 11),
            src: reader.result as string,
            status: "idle",
          },
        ]);
      };
      reader.readAsDataURL(file);
    });
  }

  async function analyzeImage(img: ScannedImage): Promise<ScannedImage> {
    const maxAttempts = 3;
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        const res = await fetch("/api/routermill/scan", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ image: img.src }),
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (data.error) throw new Error(data.error);
        return { ...img, status: "done", data };
      } catch (err) {
        if (attempt === maxAttempts) {
          console.error("scan failed", err);
          return { ...img, status: "error" };
        }
        await new Promise((r) => setTimeout(r, 1000));
      }
    }
    return { ...img, status: "error" };
  }

  async function handleAnalyzeAll() {
    setBatchRunning(true);
    const next = [...images];
    for (let i = 0; i < next.length; i++) {
      if (next[i].status !== "idle") continue;
      next[i] = { ...next[i], status: "analyzing" };
      setImages([...next]);
      const result = await analyzeImage(next[i]);
      next[i] = result;
      setImages([...next]);
    }
    setBatchRunning(false);
  }

  function generateCSV(): string | null {
    const ready = images.filter((i) => i.status === "done" && i.data);
    if (ready.length === 0) return null;
    const headers = [
      "serial_number",
      "default_ssid",
      "default_pass",
      "target_ssid",
      "new_pass",
    ];
    const rows = ready.map((i) => {
      const d = i.data!;
      return [
        d.serial_number,
        d.default_ssid,
        d.default_pass,
        d.target_ssid ?? "",
        d.new_pass ?? "",
      ].join(",");
    });
    return [headers.join(","), ...rows].join("\n");
  }

  function handleDownload() {
    const csv = generateCSV();
    if (!csv) return;
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "router_queue.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  function updateField(id: string, key: string, value: string) {
    setImages((prev) =>
      prev.map((img) =>
        img.id === id && img.data
          ? { ...img, data: { ...img.data, [key]: value } }
          : img,
      ),
    );
  }

  function removeImage(id: string) {
    setImages((prev) => prev.filter((img) => img.id !== id));
  }

  return (
    <main className="mx-auto max-w-3xl px-5 pb-20 pt-10">
      <FadeIn y={6}>
        <Link
          href="/tools"
          className="inline-flex items-center gap-1.5 text-[12px] text-ink-500 transition-colors hover:text-ink-950"
        >
          <span aria-hidden>←</span> back to tools
        </Link>
      </FadeIn>

      <FadeIn delay={0.05}>
        <div className="mt-8">
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-500">
            Free tools · Routermill
          </p>
          <h1 className="serif mt-2 text-[44px] leading-[1.05] text-ink-950 sm:text-[56px]">
            Scan a stack of routers.
          </h1>
          <p className="mt-3 max-w-xl text-[15px] leading-[1.6] text-ink-600">
            Point a phone camera at the label, get serial number, default SSID,
            and default password extracted by Gemini. Build a queue, name each
            target, download a CSV. The desktop bot takes it from there and
            runs the CelcomDigi setup wizard for you.
          </p>
        </div>
      </FadeIn>

      <FadeIn delay={0.1}>
        <div className="mt-8 rounded-2xl border border-ink-200 bg-paper p-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-500">
                Step 1 · Capture
              </p>
              <p className="mt-1 text-[14px] leading-[1.55] text-ink-700">
                On phone, this opens the camera. On desktop, drop or pick files.
              </p>
            </div>
            <span className="rounded-full bg-paper-tint px-3 py-1 font-mono text-[11px] text-ink-600">
              queue: {images.length}
            </span>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
            <label className="relative cursor-pointer rounded-xl border border-ink-200 bg-paper px-4 py-6 text-center text-[14px] font-medium text-ink-950 transition-colors hover:border-ink-950">
              <span>Take photo</span>
              <input
                type="file"
                accept="image/*"
                capture="environment"
                onChange={(e) => {
                  handleFiles(e.target.files);
                  e.target.value = "";
                }}
                className="absolute inset-0 cursor-pointer opacity-0"
              />
            </label>
            <label className="relative cursor-pointer rounded-xl border border-dashed border-ink-300 bg-paper-tint px-4 py-6 text-center text-[14px] font-medium text-ink-700 transition-colors hover:border-ink-950 hover:text-ink-950">
              <span>Upload files</span>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => {
                  handleFiles(e.target.files);
                  e.target.value = "";
                }}
                className="absolute inset-0 cursor-pointer opacity-0"
              />
            </label>
          </div>
        </div>
      </FadeIn>

      <FadeIn delay={0.14}>
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={handleAnalyzeAll}
            disabled={batchRunning || images.length === 0}
            className="inline-flex items-center gap-2 rounded-full bg-ink-950 px-5 py-2.5 text-[13px] font-medium text-paper transition-colors hover:bg-ink-800 disabled:cursor-not-allowed disabled:bg-ink-300"
          >
            {batchRunning ? "Analyzing…" : "Analyze all"}
            {!batchRunning && <span aria-hidden>→</span>}
          </button>
          <button
            type="button"
            onClick={() => setShowPreview(true)}
            disabled={readyCount === 0}
            className="inline-flex items-center gap-2 rounded-full border border-ink-200 bg-paper px-5 py-2.5 text-[13px] font-medium text-ink-950 transition-colors hover:border-ink-950 disabled:cursor-not-allowed disabled:border-ink-100 disabled:text-ink-300"
          >
            Preview CSV
          </button>
          <button
            type="button"
            onClick={handleDownload}
            disabled={readyCount === 0}
            className="inline-flex items-center gap-2 rounded-full border border-ink-200 bg-paper px-5 py-2.5 text-[13px] font-medium text-ink-950 transition-colors hover:border-ink-950 disabled:cursor-not-allowed disabled:border-ink-100 disabled:text-ink-300"
          >
            Download router_queue.csv
          </button>
          {readyCount > 0 && (
            <span className="font-mono text-[11px] text-ink-500">
              {readyCount} ready · {images.length - readyCount} pending
            </span>
          )}
        </div>
      </FadeIn>

      <div className="mt-8 space-y-3">
        {images.length === 0 && (
          <FadeIn delay={0.18}>
            <div className="rounded-2xl border border-dashed border-ink-200 bg-paper-tint p-10 text-center">
              <p className="text-[14px] text-ink-500">
                No labels in the queue yet. Snap one to begin.
              </p>
            </div>
          </FadeIn>
        )}

        {images.map((img, idx) => (
          <FadeIn key={img.id} delay={Math.min(idx * 0.04, 0.3)}>
            <div className="rounded-2xl border border-ink-200 bg-paper p-4">
              <div className="flex gap-4">
                <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg bg-ink-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={img.src}
                    alt="router label"
                    className="h-full w-full object-cover"
                  />
                  {img.status === "analyzing" && (
                    <div className="absolute inset-0 flex items-center justify-center bg-ink-950/60">
                      <span className="h-5 w-5 animate-spin rounded-full border-2 border-paper border-t-transparent" />
                    </div>
                  )}
                  {img.status === "done" && (
                    <span className="absolute right-1 top-1 rounded-full bg-garden-600 px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wide text-paper">
                      ok
                    </span>
                  )}
                  {img.status === "error" && (
                    <span className="absolute right-1 top-1 rounded-full bg-signal-investigating px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wide text-paper">
                      err
                    </span>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  {img.status === "done" && img.data ? (
                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                      <LabeledInput
                        label="S/N"
                        value={img.data.serial_number}
                        onChange={(v) => updateField(img.id, "serial_number", v)}
                        mono
                      />
                      <LabeledInput
                        label="Target SSID"
                        value={img.data.target_ssid ?? ""}
                        onChange={(v) => updateField(img.id, "target_ssid", v)}
                        emphasis
                      />
                      <LabeledInput
                        label="Default SSID"
                        value={img.data.default_ssid}
                        onChange={(v) => updateField(img.id, "default_ssid", v)}
                      />
                      <LabeledInput
                        label="Default Pass"
                        value={img.data.default_pass}
                        onChange={(v) => updateField(img.id, "default_pass", v)}
                        mono
                      />
                      <div className="sm:col-span-2">
                        <LabeledInput
                          label="New password (optional)"
                          value={img.data.new_pass ?? ""}
                          onChange={(v) => updateField(img.id, "new_pass", v)}
                          mono
                        />
                      </div>
                    </div>
                  ) : (
                    <p className="flex h-full items-center text-[13px] text-ink-500">
                      {img.status === "idle" && "Ready to analyze"}
                      {img.status === "analyzing" && "Extracting fields…"}
                      {img.status === "error" &&
                        "Couldn't read this one. Re-shoot the label."}
                    </p>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => removeImage(img.id)}
                  className="self-start rounded-full p-1.5 text-ink-400 transition-colors hover:bg-paper-tint hover:text-ink-950"
                  aria-label="remove"
                >
                  ×
                </button>
              </div>
            </div>
          </FadeIn>
        ))}
      </div>

      <FadeIn delay={0.2}>
        <div className="mt-12 rounded-2xl border border-dashed border-ink-300 bg-paper-tint p-6">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-500">
            Step 2 · The bot
          </p>
          <p className="mt-2 text-[14px] leading-[1.65] text-ink-700">
            Drop the CSV next to <code className="font-mono">main.py</code> in
            the routermill bot folder, then run{" "}
            <code className="font-mono">python main.py</code>. It scans the
            airwaves for any router in the queue, connects, runs the wizard,
            sets the new SSID + admin password, verifies, and moves on.
          </p>
          <p className="mt-3 text-[13px] text-ink-500">
            Bot lives in <code className="font-mono">scripts/routermill/</code>{" "}
            in this repo. Setup steps in its README.
          </p>
        </div>
      </FadeIn>

      {showPreview && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink-950/70 p-4 backdrop-blur-sm"
          onClick={() => setShowPreview(false)}
        >
          <div
            className="flex max-h-[85vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-ink-200 bg-paper shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-ink-200 bg-paper-tint px-5 py-3">
              <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-500">
                CSV preview · {readyCount} rows
              </p>
              <button
                type="button"
                onClick={() => setShowPreview(false)}
                className="rounded-full p-1.5 text-ink-500 transition-colors hover:bg-paper hover:text-ink-950"
                aria-label="close"
              >
                ×
              </button>
            </div>
            <div className="flex-1 overflow-auto">
              <table className="w-full text-left text-[12px]">
                <thead className="sticky top-0 bg-paper-tint font-mono uppercase tracking-[0.12em] text-ink-500">
                  <tr>
                    <th className="px-4 py-3">S/N</th>
                    <th className="px-4 py-3">Default SSID</th>
                    <th className="px-4 py-3">Default Pass</th>
                    <th className="px-4 py-3">Target SSID</th>
                    <th className="px-4 py-3">New Pass</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ink-100">
                  {images
                    .filter((i) => i.status === "done" && i.data)
                    .map((i) => (
                      <tr key={i.id}>
                        <td className="px-4 py-2.5 font-mono text-ink-700">
                          {i.data?.serial_number}
                        </td>
                        <td className="px-4 py-2.5 text-ink-700">
                          {i.data?.default_ssid}
                        </td>
                        <td className="px-4 py-2.5 font-mono text-ink-700">
                          {i.data?.default_pass}
                        </td>
                        <td className="px-4 py-2.5 font-medium text-ink-950">
                          {i.data?.target_ssid || "·"}
                        </td>
                        <td className="px-4 py-2.5 font-mono text-garden-700">
                          {i.data?.new_pass || "·"}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
            <div className="flex justify-end gap-2 border-t border-ink-200 bg-paper-tint px-5 py-3">
              <button
                type="button"
                onClick={() => setShowPreview(false)}
                className="inline-flex items-center gap-2 rounded-full border border-ink-200 bg-paper px-4 py-2 text-[13px] font-medium text-ink-950 transition-colors hover:border-ink-950"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  handleDownload();
                  setShowPreview(false);
                }}
                className="inline-flex items-center gap-2 rounded-full bg-ink-950 px-4 py-2 text-[13px] font-medium text-paper transition-colors hover:bg-ink-800"
              >
                Download CSV →
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

function LabeledInput({
  label,
  value,
  onChange,
  mono,
  emphasis,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  mono?: boolean;
  emphasis?: boolean;
}) {
  return (
    <label className="block">
      <span className="block font-mono text-[10px] uppercase tracking-[0.18em] text-ink-500">
        {label}
      </span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`mt-1 w-full rounded-lg border bg-paper px-3 py-1.5 text-[13px] focus:outline-none ${
          mono ? "font-mono" : ""
        } ${
          emphasis
            ? "border-nessie-500/60 font-medium text-ink-950 focus:border-nessie-700"
            : "border-ink-200 text-ink-700 focus:border-ink-950"
        }`}
      />
    </label>
  );
}
