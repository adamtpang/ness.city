"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { motion } from "framer-motion";

type Place = {
  id: string;
  name: string;
  desc: string;
  href: string;
};

const PLACES: Record<string, Place> = {
  welcome: {
    id: "welcome",
    name: "Welcome Center",
    desc: "How Ness works.",
    href: "/about",
  },
  townhall: {
    id: "townhall",
    name: "Townhall",
    desc: "Surface, fund, ship.",
    href: "/solve",
  },
  citizens: {
    id: "citizens",
    name: "Citizens Hall",
    desc: "Karma + patron leaderboards.",
    href: "/citizens",
  },
  observatory: {
    id: "observatory",
    name: "PageRank Observatory",
    desc: "Map who knows whom.",
    href: "/pagerank",
  },
  bounties: {
    id: "bounties",
    name: "Bounty Bureau",
    desc: "Open bounties, funded fixes.",
    href: "/bounties",
  },
  loch: {
    id: "loch",
    name: "The Loch",
    desc: "Surface a problem here.",
    href: "/solve/new",
  },
};

/**
 * Interactive Ness city map. Each landmark is a clickable destination.
 * Clean line-art over a soft sky/loch gradient. Hover shows a label
 * pill under the building. Click does an SPA navigation. Inspired by
 * Late Checkout / latecheckout.studio's illustrated nav.
 *
 * Mobile: the map still scales (SVG is fluid). For accessibility, every
 * place is reachable from the textual list below the map AND from the
 * regular header nav.
 */
export function NessCityMap({ className = "" }: { className?: string }) {
  const router = useRouter();
  const [hovered, setHovered] = useState<string | null>(null);

  function go(href: string) {
    router.push(href);
  }

  function handlers(id: string) {
    const place = PLACES[id];
    return {
      onMouseEnter: () => setHovered(id),
      onMouseLeave: () => setHovered((h) => (h === id ? null : h)),
      onFocus: () => setHovered(id),
      onBlur: () => setHovered((h) => (h === id ? null : h)),
      onClick: () => go(place.href),
      onKeyDown: (e: React.KeyboardEvent) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          go(place.href);
        }
      },
      role: "link" as const,
      tabIndex: 0,
      "aria-label": `${place.name} — ${place.desc}`,
      style: { cursor: "pointer" as const, outline: "none" },
    };
  }

  function isActive(id: string) {
    return hovered === id;
  }

  return (
    <div
      className={`relative overflow-hidden rounded-3xl border border-ink-200 bg-paper shadow-[0_8px_30px_-12px_rgba(15,40,80,0.18)] ${className}`}
    >
      <svg
        viewBox="0 0 800 500"
        xmlns="http://www.w3.org/2000/svg"
        className="block h-auto w-full"
        role="img"
        aria-label="Ness city map. Click a landmark to enter that part of the platform."
      >
        <defs>
          <linearGradient id="map-sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#fef3c7" stopOpacity="0.95" />
            <stop offset="55%" stopColor="#dbeafe" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#ecfccb" stopOpacity="0.85" />
          </linearGradient>
          <linearGradient id="map-loch" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#1e3a8a" stopOpacity="1" />
          </linearGradient>
          <radialGradient id="map-sun" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#fde68a" />
            <stop offset="55%" stopColor="#facc15" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#facc15" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Sky */}
        <rect width="800" height="380" fill="url(#map-sky)" />

        {/* Sun + glow */}
        <circle cx="650" cy="80" r="100" fill="url(#map-sun)" />
        <circle cx="650" cy="80" r="32" fill="#fde68a" />

        {/* Distant clouds */}
        <ellipse cx="120" cy="50" rx="60" ry="6" fill="#ffffff" opacity="0.9" />
        <ellipse cx="180" cy="58" rx="40" ry="4" fill="#ffffff" opacity="0.7" />
        <ellipse cx="500" cy="40" rx="55" ry="5" fill="#ffffff" opacity="0.8" />

        {/* Distant hills */}
        <path
          d="M0 280 Q 120 240 240 260 T 480 250 T 720 245 L 800 250 L 800 320 L 0 320 Z"
          fill="#86efac"
          opacity="0.45"
        />
        <path
          d="M0 305 Q 140 270 280 285 T 560 280 T 800 285 L 800 330 L 0 330 Z"
          fill="#22c55e"
          opacity="0.4"
        />

        {/* Path that connects the buildings */}
        <path
          d="M40 380 Q 120 360 200 365 T 360 370 T 540 365 T 720 370"
          stroke="#a3a3a3"
          strokeWidth="3"
          strokeDasharray="2 6"
          fill="none"
          opacity="0.5"
        />

        {/* ---------- WELCOME CENTER (About) ---------- */}
        <motion.g
          {...handlers("welcome")}
          animate={{ y: isActive("welcome") ? -3 : 0 }}
          transition={{ type: "spring", stiffness: 280, damping: 18 }}
        >
          {/* roof */}
          <path
            d="M55 270 L 100 240 L 145 270 Z"
            fill="#facc15"
            stroke="#0a0a0a"
            strokeWidth="2"
          />
          {/* body */}
          <rect
            x="60"
            y="270"
            width="80"
            height="80"
            fill="#ffffff"
            stroke="#0a0a0a"
            strokeWidth="2"
          />
          {/* door */}
          <rect
            x="92"
            y="310"
            width="16"
            height="40"
            fill="#0a0a0a"
            opacity="0.85"
          />
          {/* "i" sign window */}
          <rect
            x="72"
            y="288"
            width="20"
            height="14"
            fill="#0a0a0a"
            opacity="0.85"
          />
          <text
            x="82"
            y="299"
            textAnchor="middle"
            fontSize="11"
            fontFamily="ui-serif, Georgia, serif"
            fill="#fde68a"
            fontWeight="700"
          >
            i
          </text>
          {/* small windows */}
          <rect x="116" y="288" width="14" height="10" fill="#fde68a" opacity="0.95" />
          {/* vine */}
          <path
            d="M60 290 Q 52 305 58 320 Q 50 335 56 348"
            stroke="#16a34a"
            strokeWidth="1.6"
            fill="none"
          />
          {/* Hit area */}
          <rect x="40" y="235" width="120" height="120" fill="transparent" />
          {/* Label */}
          <PlaceLabel x={100} y={380} active={isActive("welcome")} place={PLACES.welcome} />
        </motion.g>

        {/* ---------- TOWNHALL (Solve) ---------- */}
        <motion.g
          {...handlers("townhall")}
          animate={{ y: isActive("townhall") ? -4 : 0 }}
          transition={{ type: "spring", stiffness: 280, damping: 18 }}
        >
          {/* Bell tower */}
          <rect
            x="270"
            y="170"
            width="40"
            height="70"
            fill="#ffffff"
            stroke="#0a0a0a"
            strokeWidth="2"
          />
          <path
            d="M270 170 L 290 145 L 310 170 Z"
            fill="#facc15"
            stroke="#0a0a0a"
            strokeWidth="2"
          />
          {/* Bell */}
          <path
            d="M283 195 Q 283 210 297 210 Q 297 195 297 195 Z"
            fill="#facc15"
            stroke="#0a0a0a"
            strokeWidth="1.5"
          />
          {/* Pediment / front roof */}
          <path
            d="M210 240 L 290 200 L 370 240 Z"
            fill="#fde68a"
            stroke="#0a0a0a"
            strokeWidth="2"
          />
          {/* Body */}
          <rect
            x="210"
            y="240"
            width="160"
            height="120"
            fill="#ffffff"
            stroke="#0a0a0a"
            strokeWidth="2"
          />
          {/* Columns */}
          {[225, 255, 285, 315, 345].map((x) => (
            <rect
              key={`col-${x}`}
              x={x - 3}
              y="245"
              width="6"
              height="115"
              fill="#f5f5f5"
              stroke="#0a0a0a"
              strokeWidth="1.5"
            />
          ))}
          {/* Door */}
          <rect
            x="278"
            y="320"
            width="24"
            height="40"
            fill="#0a0a0a"
            opacity="0.85"
          />
          {/* Steps */}
          <rect x="212" y="360" width="156" height="6" fill="#a3a3a3" />
          <rect x="200" y="366" width="180" height="8" fill="#737373" />
          {/* Banner */}
          <rect x="245" y="218" width="90" height="14" fill="#0a0a0a" opacity="0.92" />
          <text
            x="290"
            y="229"
            textAnchor="middle"
            fontSize="9"
            fontFamily="ui-monospace, SFMono-Regular, monospace"
            fill="#fde68a"
            letterSpacing="2"
          >
            TOWNHALL
          </text>
          {/* Vines on far columns */}
          <path
            d="M225 270 Q 218 285 222 300 Q 216 320 224 340"
            stroke="#16a34a"
            strokeWidth="1.5"
            fill="none"
          />
          <path
            d="M345 270 Q 354 285 348 305 Q 356 325 348 340"
            stroke="#16a34a"
            strokeWidth="1.5"
            fill="none"
          />
          {[280, 310, 295, 320].map((y, i) => (
            <ellipse
              key={`tv-${i}`}
              cx={i % 2 === 0 ? 220 : 350}
              cy={y}
              rx="3.5"
              ry="2.2"
              fill="#16a34a"
              transform={`rotate(${i * 25} ${i % 2 === 0 ? 220 : 350} ${y})`}
            />
          ))}
          {/* Hit area */}
          <rect x="200" y="140" width="180" height="230" fill="transparent" />
          {/* Label */}
          <PlaceLabel
            x={290}
            y={398}
            active={isActive("townhall")}
            place={PLACES.townhall}
            wide
          />
        </motion.g>

        {/* ---------- CITIZENS HALL (rotunda) ---------- */}
        <motion.g
          {...handlers("citizens")}
          animate={{ y: isActive("citizens") ? -3 : 0 }}
          transition={{ type: "spring", stiffness: 280, damping: 18 }}
        >
          {/* Dome */}
          <path
            d="M410 290 Q 410 235 470 235 Q 530 235 530 290 Z"
            fill="#86efac"
            stroke="#0a0a0a"
            strokeWidth="2"
          />
          {/* Dome inner highlight */}
          <path
            d="M420 285 Q 420 245 470 245 Q 520 245 520 285 Z"
            fill="#22c55e"
            opacity="0.55"
          />
          {/* Spire on dome */}
          <line
            x1="470"
            y1="235"
            x2="470"
            y2="218"
            stroke="#0a0a0a"
            strokeWidth="1.5"
          />
          <circle cx="470" cy="216" r="3" fill="#facc15" />
          {/* Body */}
          <rect
            x="410"
            y="290"
            width="120"
            height="70"
            fill="#ffffff"
            stroke="#0a0a0a"
            strokeWidth="2"
          />
          {/* Columns suggestion (small) */}
          {[420, 450, 490, 520].map((x) => (
            <rect
              key={`cit-c-${x}`}
              x={x - 2}
              y="295"
              width="4"
              height="65"
              fill="#f5f5f5"
              stroke="#0a0a0a"
              strokeWidth="1"
            />
          ))}
          {/* Door */}
          <rect
            x="460"
            y="320"
            width="20"
            height="40"
            fill="#0a0a0a"
            opacity="0.85"
          />
          {/* Laurel wreath above the door */}
          <path
            d="M455 305 Q 470 295 485 305"
            stroke="#16a34a"
            strokeWidth="1.6"
            fill="none"
          />
          {[460, 470, 480].map((x, i) => (
            <ellipse
              key={`la-${i}`}
              cx={x}
              cy={302}
              rx="3"
              ry="1.6"
              fill="#16a34a"
              transform={`rotate(${i * 20 - 20} ${x} 302)`}
            />
          ))}
          {/* Hit area */}
          <rect x="400" y="210" width="140" height="160" fill="transparent" />
          {/* Label */}
          <PlaceLabel x={470} y={388} active={isActive("citizens")} place={PLACES.citizens} />
        </motion.g>

        {/* ---------- OBSERVATORY (PageRank) ---------- */}
        <motion.g
          {...handlers("observatory")}
          animate={{ y: isActive("observatory") ? -4 : 0 }}
          transition={{ type: "spring", stiffness: 280, damping: 18 }}
        >
          {/* Tall tower */}
          <rect
            x="575"
            y="220"
            width="40"
            height="140"
            fill="#ffffff"
            stroke="#0a0a0a"
            strokeWidth="2"
          />
          {/* Lit windows */}
          {[245, 270, 295, 320, 345].map((y) => (
            <rect
              key={`obs-w-${y}`}
              x="588"
              y={y}
              width="14"
              height="10"
              fill="#fde68a"
              opacity={0.95 - (y - 245) / 200}
            />
          ))}
          {/* Observatory dome on top */}
          <ellipse
            cx="595"
            cy="220"
            rx="30"
            ry="20"
            fill="#bfdbfe"
            stroke="#0a0a0a"
            strokeWidth="2"
          />
          <ellipse
            cx="595"
            cy="216"
            rx="22"
            ry="14"
            fill="#dbeafe"
            opacity="0.7"
          />
          {/* Telescope sticking out */}
          <line
            x1="600"
            y1="208"
            x2="630"
            y2="190"
            stroke="#0a0a0a"
            strokeWidth="3.5"
          />
          <circle cx="630" cy="190" r="3" fill="#fde68a" />
          {/* Door */}
          <rect
            x="585"
            y="335"
            width="20"
            height="25"
            fill="#0a0a0a"
            opacity="0.85"
          />
          {/* Ground floor */}
          <rect
            x="555"
            y="345"
            width="80"
            height="20"
            fill="#f5f5f5"
            stroke="#0a0a0a"
            strokeWidth="1.5"
          />
          {/* Vine */}
          <path
            d="M615 240 Q 622 270 614 295 Q 622 325 614 350"
            stroke="#16a34a"
            strokeWidth="1.5"
            fill="none"
          />
          {[260, 285, 320].map((y, i) => (
            <ellipse
              key={`obv-l-${i}`}
              cx={i % 2 === 0 ? 622 : 614}
              cy={y}
              rx="3.5"
              ry="2"
              fill="#16a34a"
              transform={`rotate(${i * 25} ${i % 2 === 0 ? 622 : 614} ${y})`}
            />
          ))}
          {/* Hit area */}
          <rect x="555" y="180" width="80" height="190" fill="transparent" />
          {/* Label */}
          <PlaceLabel x={595} y={388} active={isActive("observatory")} place={PLACES.observatory} wide />
        </motion.g>

        {/* ---------- BOUNTY BUREAU ---------- */}
        <motion.g
          {...handlers("bounties")}
          animate={{ y: isActive("bounties") ? -3 : 0 }}
          transition={{ type: "spring", stiffness: 280, damping: 18 }}
        >
          {/* Roof */}
          <path
            d="M675 305 L 715 285 L 755 305 Z"
            fill="#facc15"
            stroke="#0a0a0a"
            strokeWidth="2"
          />
          {/* Body */}
          <rect
            x="680"
            y="305"
            width="70"
            height="55"
            fill="#ffffff"
            stroke="#0a0a0a"
            strokeWidth="2"
          />
          {/* "$" sign */}
          <circle cx="715" cy="328" r="9" fill="#16a34a" />
          <text
            x="715"
            y="332"
            textAnchor="middle"
            fontSize="11"
            fontWeight="700"
            fontFamily="ui-monospace, monospace"
            fill="#ffffff"
          >
            $
          </text>
          {/* Door */}
          <rect
            x="703"
            y="340"
            width="14"
            height="20"
            fill="#0a0a0a"
            opacity="0.85"
          />
          {/* Hit area */}
          <rect x="670" y="280" width="90" height="90" fill="transparent" />
          {/* Label */}
          <PlaceLabel x={715} y={388} active={isActive("bounties")} place={PLACES.bounties} />
        </motion.g>

        {/* ---------- LOCH ---------- */}
        <rect x="0" y="380" width="800" height="120" fill="url(#map-loch)" />

        {/* Ripples */}
        <path
          d="M40 410 Q 120 405 200 410 T 360 410 T 540 410 T 720 410"
          stroke="#bfdbfe"
          strokeWidth="1.4"
          fill="none"
          opacity="0.45"
        />
        <path
          d="M0 432 Q 80 426 160 432 T 320 432 T 480 432 T 640 432 T 800 432"
          stroke="#bfdbfe"
          strokeWidth="1.1"
          fill="none"
          opacity="0.32"
        />
        <path
          d="M40 460 Q 120 454 200 460 T 360 460 T 540 460 T 720 460"
          stroke="#bfdbfe"
          strokeWidth="0.9"
          fill="none"
          opacity="0.22"
        />

        {/* ---------- NESSIE in the loch ---------- */}
        <motion.g
          {...handlers("loch")}
          animate={{ y: isActive("loch") ? -2 : 0 }}
          transition={{ type: "spring", stiffness: 280, damping: 18 }}
        >
          <g transform="translate(150, 408)">
            {/* humps + neck + head */}
            <path
              d="M0 16 Q 8 6 16 16 Q 22 10 28 16 Q 32 11 38 14 L 50 22"
              stroke="#172554"
              strokeWidth="3.5"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle cx="48" cy="16" r="1.6" fill="#fde68a" />
            {/* splash */}
            <path
              d="M-4 22 Q 8 18 22 22 T 50 22"
              stroke="#bfdbfe"
              strokeWidth="1.4"
              fill="none"
              opacity="0.6"
            />
          </g>
          {/* hit area for the loch CTA */}
          <rect x="100" y="395" width="180" height="50" fill="transparent" />
          {/* Label */}
          <PlaceLabel x={195} y={462} active={isActive("loch")} place={PLACES.loch} wide light />
        </motion.g>

        {/* Tiny boat for charm */}
        <g transform="translate(560, 416)">
          <path d="M0 0 L 24 0 L 20 6 L 4 6 Z" fill="#0a0a0a" opacity="0.9" />
          <line x1="12" y1="0" x2="12" y2="-14" stroke="#0a0a0a" strokeWidth="1" />
          <path d="M12 -14 L 22 -2 L 12 -2 Z" fill="#bfdbfe" />
        </g>

        {/* Trees between buildings */}
        <Tree x={185} y={355} />
        <Tree x={395} y={358} />
        <Tree x={550} y={355} />
        <Tree x={665} y={358} />
      </svg>
    </div>
  );
}

function PlaceLabel({
  x,
  y,
  active,
  place,
  wide = false,
  light = false,
}: {
  x: number;
  y: number;
  active: boolean;
  place: Place;
  wide?: boolean;
  light?: boolean;
}) {
  const W = wide ? 168 : 132;
  return (
    <motion.g
      initial={false}
      animate={{ opacity: active ? 1 : 0, y: active ? 0 : -3 }}
      transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
      pointerEvents="none"
    >
      <rect
        x={x - W / 2}
        y={y - 12}
        width={W}
        height={32}
        rx={16}
        fill={light ? "#0a0a0a" : "#ffffff"}
        stroke={light ? "#ffffff" : "#0a0a0a"}
        strokeWidth="1.5"
      />
      <text
        x={x}
        y={y + 1}
        textAnchor="middle"
        fontSize="11"
        fontWeight="600"
        fontFamily="ui-sans-serif, system-ui, sans-serif"
        fill={light ? "#ffffff" : "#0a0a0a"}
      >
        {place.name}
      </text>
      <text
        x={x}
        y={y + 14}
        textAnchor="middle"
        fontSize="9"
        fontFamily="ui-sans-serif, system-ui, sans-serif"
        fill={light ? "#dbeafe" : "#737373"}
      >
        {place.desc}
      </text>
    </motion.g>
  );
}

function Tree({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x}, ${y})`}>
      <rect x="-1.5" y="0" width="3" height="14" fill="#92400e" opacity="0.85" />
      <circle cx="0" cy="-2" r="9" fill="#16a34a" opacity="0.85" />
      <circle cx="-5" cy="-6" r="6" fill="#22c55e" opacity="0.85" />
      <circle cx="5" cy="-6" r="6" fill="#22c55e" opacity="0.85" />
    </g>
  );
}
