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
  vault: {
    id: "vault",
    name: "Points Vault",
    desc: "NS points calculator + explainer.",
    href: "/points",
  },
  forge: {
    id: "forge",
    name: "The Forge",
    desc: "Open-source mirror. Issues and pull requests.",
    href: "/os",
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
 * Inspired by Late Checkout / latecheckout.studio's illustrated nav.
 *
 * Layout: 800x540 canvas. Sky 0-280, hills/grass 240-430, loch 430-540.
 * Building labels fit cleanly in the grass band (y ~395) above the water.
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
      "aria-label": `${place.name}: ${place.desc}`,
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
        viewBox="0 0 800 540"
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

        {/* Sky / grass background */}
        <rect width="800" height="430" fill="url(#map-sky)" />

        {/* Sun + glow */}
        <circle cx="650" cy="80" r="100" fill="url(#map-sun)" />
        <circle cx="650" cy="80" r="32" fill="#fde68a" />

        {/* Distant clouds */}
        <ellipse cx="120" cy="50" rx="60" ry="6" fill="#ffffff" opacity="0.9" />
        <ellipse cx="180" cy="58" rx="40" ry="4" fill="#ffffff" opacity="0.7" />
        <ellipse cx="500" cy="40" rx="55" ry="5" fill="#ffffff" opacity="0.8" />

        {/* Distant hills */}
        <path
          d="M0 290 Q 120 250 240 270 T 480 260 T 720 255 L 800 260 L 800 330 L 0 330 Z"
          fill="#86efac"
          opacity="0.45"
        />
        <path
          d="M0 315 Q 140 280 280 295 T 560 290 T 800 295 L 800 340 L 0 340 Z"
          fill="#22c55e"
          opacity="0.4"
        />

        {/* Grass band where labels live */}
        <rect x="0" y="370" width="800" height="60" fill="#dcfce7" opacity="0.55" />

        {/* Path that connects the buildings */}
        <path
          d="M40 408 Q 120 396 200 400 T 360 402 T 540 400 T 720 402"
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
          <rect x="92" y="310" width="16" height="40" fill="#0a0a0a" opacity="0.85" />
          {/* "i" sign window */}
          <rect x="72" y="288" width="20" height="14" fill="#0a0a0a" opacity="0.85" />
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
          <rect x="116" y="288" width="14" height="10" fill="#fde68a" opacity="0.95" />
          <path
            d="M60 290 Q 52 305 58 320 Q 50 335 56 348"
            stroke="#16a34a"
            strokeWidth="1.6"
            fill="none"
          />
          <rect x="40" y="235" width="120" height="120" fill="transparent" />
          <PlaceLabel x={100} y={395} active={isActive("welcome")} place={PLACES.welcome} />
        </motion.g>

        {/* ---------- TOWNHALL (Solve) ---------- */}
        <motion.g
          {...handlers("townhall")}
          animate={{ y: isActive("townhall") ? -4 : 0 }}
          transition={{ type: "spring", stiffness: 280, damping: 18 }}
        >
          <rect x="270" y="170" width="40" height="70" fill="#ffffff" stroke="#0a0a0a" strokeWidth="2" />
          <path d="M270 170 L 290 145 L 310 170 Z" fill="#facc15" stroke="#0a0a0a" strokeWidth="2" />
          <path
            d="M283 195 Q 283 210 297 210 Q 297 195 297 195 Z"
            fill="#facc15"
            stroke="#0a0a0a"
            strokeWidth="1.5"
          />
          <path d="M210 240 L 290 200 L 370 240 Z" fill="#fde68a" stroke="#0a0a0a" strokeWidth="2" />
          <rect x="210" y="240" width="160" height="120" fill="#ffffff" stroke="#0a0a0a" strokeWidth="2" />
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
          <rect x="278" y="320" width="24" height="40" fill="#0a0a0a" opacity="0.85" />
          <rect x="212" y="360" width="156" height="6" fill="#a3a3a3" />
          <rect x="200" y="366" width="180" height="8" fill="#737373" />
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
          <rect x="200" y="140" width="180" height="240" fill="transparent" />
          <PlaceLabel x={290} y={405} active={isActive("townhall")} place={PLACES.townhall} wide />
        </motion.g>

        {/* ---------- CITIZENS HALL (rotunda) ---------- */}
        <motion.g
          {...handlers("citizens")}
          animate={{ y: isActive("citizens") ? -3 : 0 }}
          transition={{ type: "spring", stiffness: 280, damping: 18 }}
        >
          <path
            d="M410 290 Q 410 235 470 235 Q 530 235 530 290 Z"
            fill="#86efac"
            stroke="#0a0a0a"
            strokeWidth="2"
          />
          <path
            d="M420 285 Q 420 245 470 245 Q 520 245 520 285 Z"
            fill="#22c55e"
            opacity="0.55"
          />
          <line x1="470" y1="235" x2="470" y2="218" stroke="#0a0a0a" strokeWidth="1.5" />
          <circle cx="470" cy="216" r="3" fill="#facc15" />
          <rect x="410" y="290" width="120" height="70" fill="#ffffff" stroke="#0a0a0a" strokeWidth="2" />
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
          <rect x="460" y="320" width="20" height="40" fill="#0a0a0a" opacity="0.85" />
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
          <rect x="400" y="210" width="140" height="160" fill="transparent" />
          <PlaceLabel x={470} y={395} active={isActive("citizens")} place={PLACES.citizens} wide />
        </motion.g>

        {/* ---------- OBSERVATORY (PageRank) ---------- */}
        <motion.g
          {...handlers("observatory")}
          animate={{ y: isActive("observatory") ? -4 : 0 }}
          transition={{ type: "spring", stiffness: 280, damping: 18 }}
        >
          <rect x="555" y="220" width="40" height="140" fill="#ffffff" stroke="#0a0a0a" strokeWidth="2" />
          {[245, 270, 295, 320, 345].map((y) => (
            <rect
              key={`obs-w-${y}`}
              x="568"
              y={y}
              width="14"
              height="10"
              fill="#fde68a"
              opacity={0.95 - (y - 245) / 200}
            />
          ))}
          <ellipse cx="575" cy="220" rx="30" ry="20" fill="#bfdbfe" stroke="#0a0a0a" strokeWidth="2" />
          <ellipse cx="575" cy="216" rx="22" ry="14" fill="#dbeafe" opacity="0.7" />
          <line x1="580" y1="208" x2="610" y2="190" stroke="#0a0a0a" strokeWidth="3.5" />
          <circle cx="610" cy="190" r="3" fill="#fde68a" />
          <rect x="565" y="335" width="20" height="25" fill="#0a0a0a" opacity="0.85" />
          <rect x="535" y="345" width="80" height="20" fill="#f5f5f5" stroke="#0a0a0a" strokeWidth="1.5" />
          <path
            d="M595 240 Q 602 270 594 295 Q 602 325 594 350"
            stroke="#16a34a"
            strokeWidth="1.5"
            fill="none"
          />
          <rect x="535" y="180" width="80" height="190" fill="transparent" />
          <PlaceLabel x={575} y={395} active={isActive("observatory")} place={PLACES.observatory} wide />
        </motion.g>

        {/* ---------- BOUNTY BUREAU ---------- */}
        <motion.g
          {...handlers("bounties")}
          animate={{ y: isActive("bounties") ? -3 : 0 }}
          transition={{ type: "spring", stiffness: 280, damping: 18 }}
        >
          <path
            d="M650 305 L 690 285 L 730 305 Z"
            fill="#facc15"
            stroke="#0a0a0a"
            strokeWidth="2"
          />
          <rect x="655" y="305" width="70" height="55" fill="#ffffff" stroke="#0a0a0a" strokeWidth="2" />
          <circle cx="690" cy="328" r="9" fill="#16a34a" />
          <text
            x="690"
            y="332"
            textAnchor="middle"
            fontSize="11"
            fontWeight="700"
            fontFamily="ui-monospace, monospace"
            fill="#ffffff"
          >
            $
          </text>
          <rect x="678" y="340" width="14" height="20" fill="#0a0a0a" opacity="0.85" />
          <rect x="645" y="280" width="90" height="90" fill="transparent" />
          <PlaceLabel x={690} y={395} active={isActive("bounties")} place={PLACES.bounties} />
        </motion.g>

        {/* ---------- THE FORGE (Open Source NS) ---------- */}
        <motion.g
          {...handlers("forge")}
          animate={{ y: isActive("forge") ? -3 : 0 }}
          transition={{ type: "spring", stiffness: 280, damping: 18 }}
        >
          {/* Roof triangle, dark */}
          <path
            d="M154 325 L 178 308 L 202 325 Z"
            fill="#0a0a0a"
            opacity="0.9"
            stroke="#0a0a0a"
            strokeWidth="1.5"
          />
          {/* Body */}
          <rect x="158" y="325" width="42" height="45" fill="#ffffff" stroke="#0a0a0a" strokeWidth="1.5" />
          {/* Open archway with fire glow */}
          <path
            d="M170 370 L 170 348 Q 170 342 179 342 Q 188 342 188 348 L 188 370 Z"
            fill="#fde68a"
          />
          <path
            d="M170 370 L 170 348 Q 170 342 179 342 Q 188 342 188 348 L 188 370"
            stroke="#0a0a0a"
            strokeWidth="1.2"
            fill="none"
          />
          {/* Fire flames */}
          <path
            d="M174 366 Q 177 360 179 364 Q 181 359 184 366"
            fill="#f97316"
            opacity="0.9"
          />
          {/* Chimney */}
          <rect x="192" y="312" width="7" height="15" fill="#737373" stroke="#0a0a0a" strokeWidth="1" />
          {/* Smoke puffs */}
          <circle cx="196" cy="307" r="3" fill="#e5e5e5" opacity="0.75" />
          <circle cx="200" cy="301" r="2.4" fill="#e5e5e5" opacity="0.6" />
          {/* Anvil out front */}
          <rect x="160" y="372" width="9" height="2" fill="#525252" />
          <rect x="162" y="370" width="5" height="2" fill="#525252" />
          {/* Hit area */}
          <rect x="148" y="298" width="58" height="80" fill="transparent" />
          <PlaceLabel x={178} y={405} active={isActive("forge")} place={PLACES.forge} />
        </motion.g>

        {/* ---------- POINTS VAULT ---------- */}
        <motion.g
          {...handlers("vault")}
          animate={{ y: isActive("vault") ? -3 : 0 }}
          transition={{ type: "spring", stiffness: 280, damping: 18 }}
        >
          {/* Wide low building with arch */}
          <rect x="745" y="320" width="48" height="40" fill="#ffffff" stroke="#0a0a0a" strokeWidth="2" />
          <path
            d="M745 320 L 769 295 L 793 320 Z"
            fill="#fde68a"
            stroke="#0a0a0a"
            strokeWidth="2"
          />
          {/* Arched door (vault) */}
          <path
            d="M760 360 L 760 340 Q 760 330 769 330 Q 778 330 778 340 L 778 360 Z"
            fill="#0a0a0a"
            opacity="0.85"
          />
          {/* Coin stack motif */}
          <circle cx="755" cy="312" r="2.5" fill="#facc15" stroke="#0a0a0a" strokeWidth="0.8" />
          <circle cx="769" cy="308" r="2.5" fill="#facc15" stroke="#0a0a0a" strokeWidth="0.8" />
          <circle cx="783" cy="312" r="2.5" fill="#facc15" stroke="#0a0a0a" strokeWidth="0.8" />
          <rect x="740" y="295" width="60" height="80" fill="transparent" />
          <PlaceLabel x={769} y={395} active={isActive("vault")} place={PLACES.vault} />
        </motion.g>

        {/* ---------- LOCH ---------- */}
        <rect x="0" y="430" width="800" height="110" fill="url(#map-loch)" />

        {/* Ripples */}
        <path
          d="M40 460 Q 120 455 200 460 T 360 460 T 540 460 T 720 460"
          stroke="#bfdbfe"
          strokeWidth="1.4"
          fill="none"
          opacity="0.45"
        />
        <path
          d="M0 482 Q 80 476 160 482 T 320 482 T 480 482 T 640 482 T 800 482"
          stroke="#bfdbfe"
          strokeWidth="1.1"
          fill="none"
          opacity="0.32"
        />
        <path
          d="M40 510 Q 120 504 200 510 T 360 510 T 540 510 T 720 510"
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
          <g transform="translate(150, 458)">
            <path
              d="M0 16 Q 8 6 16 16 Q 22 10 28 16 Q 32 11 38 14 L 50 22"
              stroke="#172554"
              strokeWidth="3.5"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle cx="48" cy="16" r="1.6" fill="#fde68a" />
            <path
              d="M-4 22 Q 8 18 22 22 T 50 22"
              stroke="#bfdbfe"
              strokeWidth="1.4"
              fill="none"
              opacity="0.6"
            />
          </g>
          <rect x="100" y="445" width="180" height="50" fill="transparent" />
          <PlaceLabel x={195} y={510} active={isActive("loch")} place={PLACES.loch} wide light />
        </motion.g>

        {/* Tiny boat for charm */}
        <g transform="translate(560, 466)">
          <path d="M0 0 L 24 0 L 20 6 L 4 6 Z" fill="#0a0a0a" opacity="0.9" />
          <line x1="12" y1="0" x2="12" y2="-14" stroke="#0a0a0a" strokeWidth="1" />
          <path d="M12 -14 L 22 -2 L 12 -2 Z" fill="#bfdbfe" />
        </g>

        {/* Trees in the grass band */}
        <Tree x={185} y={385} />
        <Tree x={395} y={388} />
        <Tree x={530} y={385} />
        <Tree x={635} y={388} />
        <Tree x={730} y={388} />
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
