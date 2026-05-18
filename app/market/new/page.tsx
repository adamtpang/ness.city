"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FadeIn } from "@/components/motion/FadeIn";
import { listingKinds, type ListingKind, type ContactKind } from "@/lib/market";

const IDENTITY_KEY = "ness:identity:v1";

const KIND_OPTIONS = listingKinds.filter((k) => k.id !== "all") as {
  id: ListingKind;
  label: string;
}[];

const CONTACT_OPTIONS: { id: ContactKind; label: string }[] = [
  { id: "whatsapp", label: "WhatsApp" },
  { id: "telegram", label: "Telegram" },
  { id: "discord", label: "Discord" },
  { id: "email", label: "Email" },
];

/** Price is meaningless for these kinds. */
const NO_PRICE: ListingKind[] = ["free", "wanted"];

/**
 * Resize an image file to a max edge and JPEG-encode it as a small data
 * URL, entirely client-side. Keeps the upload tiny (no storage infra) and
 * the DB/photo-route light. Returns a data:image/jpeg;base64 string.
 */
async function fileToResizedDataUrl(
  file: File,
  maxEdge = 1000,
  quality = 0.72,
): Promise<string> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, maxEdge / Math.max(bitmap.width, bitmap.height));
  const w = Math.round(bitmap.width * scale);
  const h = Math.round(bitmap.height * scale);
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas unsupported");
  ctx.drawImage(bitmap, 0, 0, w, h);
  return canvas.toDataURL("image/jpeg", quality);
}

export default function NewListingPage() {
  const router = useRouter();
  const [kind, setKind] = useState<ListingKind>("forsale");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [priceUsd, setPriceUsd] = useState("");
  const [photo, setPhoto] = useState<string | null>(null);
  const [photoBusy, setPhotoBusy] = useState(false);
  const [name, setName] = useState("");
  const [handle, setHandle] = useState("");
  const [contactKind, setContactKind] = useState<ContactKind>("whatsapp");
  const [contactValue, setContactValue] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState<{ kind: "ok" | "err"; text: string } | null>(
    null,
  );

  // Restore cached identity (same key PageRank uses).
  useEffect(() => {
    try {
      const raw = localStorage.getItem(IDENTITY_KEY);
      if (raw) {
        const p = JSON.parse(raw) as { name?: string; handle?: string };
        setName(p.name ?? "");
        setHandle(p.handle ?? "");
      }
    } catch {
      /* noop */
    }
  }, []);

  const showPrice = !NO_PRICE.includes(kind);

  async function onPhotoPick(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoBusy(true);
    setMsg(null);
    try {
      const url = await fileToResizedDataUrl(file);
      if (url.length > 580_000) {
        setMsg({ kind: "err", text: "That image is huge even resized. Try a smaller one." });
        setPhoto(null);
      } else {
        setPhoto(url);
      }
    } catch {
      setMsg({ kind: "err", text: "Could not read that image." });
      setPhoto(null);
    } finally {
      setPhotoBusy(false);
    }
  }

  async function submit() {
    if (!title.trim() || !body.trim() || !name.trim() || !handle.trim() || !contactValue.trim()) {
      setMsg({ kind: "err", text: "Fill in title, details, your name, handle, and contact." });
      return;
    }
    setSubmitting(true);
    setMsg(null);
    try {
      const payload: Record<string, unknown> = {
        kind,
        title: title.trim(),
        body: body.trim(),
        sellerHandle: handle.trim().replace(/^@/, "").toLowerCase(),
        sellerDisplayName: name.trim(),
        contactKind,
        contactValue: contactValue.trim(),
      };
      if (showPrice && priceUsd.trim()) {
        const n = Number(priceUsd.replace(/[^\d.]/g, ""));
        if (Number.isFinite(n)) payload.priceUsd = n;
      }
      if (photo) payload.photo = photo;

      const res = await fetch("/api/market", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        error?: string;
      };
      if (!res.ok || !data.ok) throw new Error(data.error ?? `HTTP ${res.status}`);

      try {
        localStorage.setItem(
          IDENTITY_KEY,
          JSON.stringify({
            name: name.trim(),
            handle: handle.trim().replace(/^@/, "").toLowerCase(),
          }),
        );
      } catch {
        /* noop */
      }
      setMsg({ kind: "ok", text: "Listing posted. Taking you to the market..." });
      setTimeout(() => router.push("/market"), 900);
    } catch (e) {
      setMsg({
        kind: "err",
        text: e instanceof Error ? e.message : "Network error",
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="mx-auto max-w-2xl px-5 pb-28 pt-12">
      <FadeIn y={6}>
        <Link
          href="/market"
          className="inline-flex items-center gap-1.5 text-[12px] text-ink-500 transition-colors hover:text-ink-950"
        >
          <span aria-hidden>←</span> back to the market
        </Link>
      </FadeIn>

      <FadeIn delay={0.04}>
        <header className="mt-7">
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-500">
            Post a listing
          </p>
          <h1 className="serif mt-2 text-[40px] leading-[1.05] text-ink-950 sm:text-[52px]">
            Sell, give, or find.
          </h1>
          <p className="mt-3 text-[14.5px] leading-[1.6] text-ink-600">
            Tied to your handle so replies know who you are. Expires in 30
            days. Real names, real prices.
          </p>
        </header>
      </FadeIn>

      <FadeIn delay={0.1}>
        <div className="mt-8 space-y-5 rounded-2xl border border-ink-200 bg-paper p-6 sm:p-7">
          {/* Kind */}
          <Field label="Category">
            <div className="flex flex-wrap gap-2">
              {KIND_OPTIONS.map((k) => (
                <button
                  key={k.id}
                  type="button"
                  onClick={() => setKind(k.id)}
                  className={`rounded-full px-3.5 py-1.5 text-[12.5px] font-medium transition-colors ${
                    kind === k.id
                      ? "bg-ink-950 text-paper"
                      : "border border-ink-200 text-ink-700 hover:border-ink-950"
                  }`}
                >
                  {k.label}
                </button>
              ))}
            </div>
          </Field>

          <Field label="Title">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Hyundai i10, 2018, perfect for JB runs"
              maxLength={140}
              className="w-full rounded-xl border border-ink-200 bg-paper px-4 py-2.5 text-[14px] text-ink-950 placeholder:text-ink-400 focus:border-ink-950 focus:outline-none"
            />
          </Field>

          <Field label="Details">
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="One-owner since new. Just serviced. Selling because I'm leaving the cohort."
              rows={4}
              maxLength={1200}
              className="w-full resize-none rounded-xl border border-ink-200 bg-paper px-4 py-2.5 text-[14px] text-ink-950 placeholder:text-ink-400 focus:border-ink-950 focus:outline-none"
            />
          </Field>

          {showPrice && (
            <Field label="Price in USD (optional)">
              <input
                type="text"
                inputMode="decimal"
                value={priceUsd}
                onChange={(e) => setPriceUsd(e.target.value)}
                placeholder="4800"
                className="w-full rounded-xl border border-ink-200 bg-paper px-4 py-2.5 text-[14px] text-ink-950 placeholder:text-ink-400 focus:border-ink-950 focus:outline-none"
              />
            </Field>
          )}

          <Field label="Photo (optional, recommended)">
            {photo ? (
              <div className="flex items-center gap-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={photo}
                  alt="Listing preview"
                  className="h-20 w-20 rounded-xl border border-ink-200 object-cover"
                />
                <button
                  type="button"
                  onClick={() => setPhoto(null)}
                  className="text-[12px] text-ink-500 underline-offset-2 hover:text-ink-950 hover:underline"
                >
                  Remove photo
                </button>
              </div>
            ) : (
              <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-dashed border-ink-300 px-4 py-3 text-[13px] text-ink-600 transition-colors hover:border-ink-950 hover:text-ink-950">
                {photoBusy ? "Processing..." : "Add a photo"}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={onPhotoPick}
                  disabled={photoBusy}
                />
              </label>
            )}
            <p className="mt-2 text-[11.5px] text-ink-400">
              Resized on your device before upload. One photo. Things with a
              photo sell far faster.
            </p>
          </Field>

          <div className="border-t border-ink-100 pt-5">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-500">
              Your identity
            </p>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className="rounded-xl border border-ink-200 bg-paper px-4 py-2.5 text-[14px] text-ink-950 placeholder:text-ink-400 focus:border-ink-950 focus:outline-none"
              />
              <input
                type="text"
                value={handle}
                onChange={(e) => setHandle(e.target.value.replace(/^@/, ""))}
                placeholder="handle"
                className="rounded-xl border border-ink-200 bg-paper px-4 py-2.5 text-[14px] text-ink-950 placeholder:text-ink-400 focus:border-ink-950 focus:outline-none"
              />
            </div>
          </div>

          <div className="border-t border-ink-100 pt-5">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-500">
              How replies reach you
            </p>
            <div className="mt-3 grid gap-3 sm:grid-cols-[160px_1fr]">
              <select
                value={contactKind}
                onChange={(e) => setContactKind(e.target.value as ContactKind)}
                className="rounded-xl border border-ink-200 bg-paper px-3 py-2.5 text-[14px] text-ink-950 focus:border-ink-950 focus:outline-none"
              >
                {CONTACT_OPTIONS.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.label}
                  </option>
                ))}
              </select>
              <input
                type="text"
                value={contactValue}
                onChange={(e) => setContactValue(e.target.value)}
                placeholder={
                  contactKind === "whatsapp"
                    ? "+60-12-555-0123"
                    : contactKind === "email"
                      ? "you@email.com"
                      : contactKind === "telegram"
                        ? "@yourhandle"
                        : "yourname#0000"
                }
                className="rounded-xl border border-ink-200 bg-paper px-4 py-2.5 text-[14px] text-ink-950 placeholder:text-ink-400 focus:border-ink-950 focus:outline-none"
              />
            </div>
            <p className="mt-2 text-[11.5px] text-ink-400">
              Hidden until a visitor clicks Reply. Never shown in the feed.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 border-t border-ink-100 pt-5">
            <button
              onClick={submit}
              disabled={submitting}
              className="inline-flex items-center gap-2 rounded-full bg-ink-950 px-5 py-2.5 text-[13.5px] font-medium text-paper transition-colors hover:bg-ink-800 disabled:opacity-40"
            >
              {submitting ? "Posting..." : "Post listing"}
              {!submitting && <span aria-hidden>→</span>}
            </button>
            {msg && (
              <span
                className={`text-[12.5px] ${
                  msg.kind === "ok" ? "text-emerald-700" : "text-amber-700"
                }`}
              >
                {msg.text}
              </span>
            )}
          </div>
        </div>
      </FadeIn>
    </main>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-500">
        {label}
      </label>
      <div className="mt-2">{children}</div>
    </div>
  );
}
