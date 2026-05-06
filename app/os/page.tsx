import Link from "next/link";
import { FadeIn, FadeInOnView } from "@/components/motion/FadeIn";

type Issue = {
  number: number;
  state: "open" | "closed";
  title: string;
  author: string;
  age: string;
  labels: { text: string; color: string }[];
  comments: number;
};

type PR = {
  number: number;
  state: "open" | "merged" | "draft";
  title: string;
  author: string;
  age: string;
  labels: { text: string; color: string }[];
  comments: number;
  diff: { added: number; removed: number };
};

const ISSUES: Issue[] = [
  {
    number: 47,
    state: "open",
    title: "Visa support docs are scattered across 4 different Notion pages",
    author: "priya.k",
    age: "2 days",
    labels: [
      { text: "visa", color: "#dbeafe" },
      { text: "docs", color: "#dcfce7" },
    ],
    comments: 8,
  },
  {
    number: 46,
    state: "open",
    title: "Hiring thread on Discord becomes unsearchable after 2 weeks",
    author: "marcus",
    age: "3 days",
    labels: [
      { text: "discord", color: "#e0e7ff" },
      { text: "search", color: "#fef3c7" },
    ],
    comments: 12,
  },
  {
    number: 45,
    state: "open",
    title: "ns.com/profile doesn't let you set a bio or short tagline",
    author: "aisha",
    age: "4 days",
    labels: [
      { text: "profile", color: "#fce7f3" },
      { text: "ux", color: "#fed7aa" },
    ],
    comments: 4,
  },
  {
    number: 44,
    state: "open",
    title: "Onboarding doc references staff members who left 6 months ago",
    author: "jonas",
    age: "5 days",
    labels: [
      { text: "onboarding", color: "#dcfce7" },
      { text: "stale-data", color: "#fee2e2" },
    ],
    comments: 6,
  },
  {
    number: 43,
    state: "open",
    title: "Earned dashboard doesn't show NS Points alongside USD",
    author: "lena",
    age: "1 week",
    labels: [
      { text: "points", color: "#dbeafe" },
      { text: "dashboard", color: "#fef3c7" },
    ],
    comments: 9,
  },
  {
    number: 42,
    state: "open",
    title: "Coworking 1-on-1 rooms have no real-time availability check",
    author: "marcus",
    age: "1 week",
    labels: [{ text: "infra", color: "#bfdbfe" }],
    comments: 15,
  },
  {
    number: 41,
    state: "open",
    title: "Visa run instructions live in a Discord pin that gets buried",
    author: "kofi",
    age: "1 week",
    labels: [
      { text: "visa", color: "#dbeafe" },
      { text: "process", color: "#e9d5ff" },
    ],
    comments: 3,
  },
  {
    number: 40,
    state: "closed",
    title: "Apartment-move requires 5 separate forms across 3 systems",
    author: "naomi",
    age: "2 weeks",
    labels: [
      { text: "ops", color: "#fef3c7" },
      { text: "shipped", color: "#dcfce7" },
    ],
    comments: 18,
  },
  {
    number: 39,
    state: "closed",
    title: "Events page has no .ics calendar export",
    author: "emiko",
    age: "3 weeks",
    labels: [
      { text: "events", color: "#fce7f3" },
      { text: "shipped", color: "#dcfce7" },
    ],
    comments: 7,
  },
  {
    number: 38,
    state: "open",
    title: "Members directory missing photos for half the longtermers",
    author: "devraj",
    age: "3 weeks",
    labels: [{ text: "directory", color: "#e0e7ff" }],
    comments: 5,
  },
];

const PULL_REQUESTS: PR[] = [
  {
    number: 49,
    state: "open",
    title: "Add NS Points + USDC value to the /earned dashboard",
    author: "marcus",
    age: "1 day",
    labels: [{ text: "points", color: "#dbeafe" }],
    comments: 6,
    diff: { added: 240, removed: 18 },
  },
  {
    number: 48,
    state: "draft",
    title: "Real-time room availability via PIR sensors + Cal.com webhook",
    author: "jonas",
    age: "3 days",
    labels: [
      { text: "infra", color: "#bfdbfe" },
      { text: "draft", color: "#e5e7eb" },
    ],
    comments: 4,
    diff: { added: 412, removed: 0 },
  },
  {
    number: 37,
    state: "open",
    title: "Move all visa docs into ns.com/visa as the canonical home",
    author: "priya.k",
    age: "5 days",
    labels: [
      { text: "visa", color: "#dbeafe" },
      { text: "docs", color: "#dcfce7" },
    ],
    comments: 11,
    diff: { added: 1240, removed: 320 },
  },
  {
    number: 36,
    state: "merged",
    title: "Add 'recently joined' filter to /directory",
    author: "aisha",
    age: "1 week",
    labels: [{ text: "directory", color: "#e0e7ff" }],
    comments: 9,
    diff: { added: 86, removed: 12 },
  },
];

const issueCount = {
  open: ISSUES.filter((i) => i.state === "open").length,
  closed: ISSUES.filter((i) => i.state === "closed").length,
};
const prCount = {
  open: PULL_REQUESTS.filter((p) => p.state !== "merged").length,
  merged: PULL_REQUESTS.filter((p) => p.state === "merged").length,
};

export default function OsPage() {
  return (
    <main className="mx-auto max-w-5xl px-5 pb-20 pt-12">
      <FadeIn y={6}>
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-[12px] text-ink-500 transition-colors hover:text-ink-950"
        >
          <span aria-hidden>←</span> back to the city
        </Link>
      </FadeIn>

      {/* Repo header */}
      <FadeIn delay={0.05}>
        <div className="mt-6">
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-500">
            Open Source NS
          </p>
          <div className="mt-1 flex items-baseline gap-1.5 font-mono text-[24px] sm:text-[28px]">
            <span className="text-ink-500">community/</span>
            <span className="text-ink-950">ns.com</span>
          </div>
          <p className="mt-2 max-w-xl text-[14.5px] leading-[1.6] text-ink-600">
            What if ns.com had an issues tab? Here&apos;s the community
            mirror. File issues. Open pull requests. Surface bugs. Suggest
            features. The kind of bottom-up signal that only happens when
            the layer exists.
          </p>
        </div>
      </FadeIn>

      <FadeIn delay={0.1}>
        <div className="mt-5 flex flex-wrap gap-2">
          <Stat label="★ Stars" value="2.4k" />
          <Stat label="⑂ Forks" value="312" />
          <Stat label="◎ Watching" value="847" />
          <Stat label="Contributors" value="63" />
        </div>
      </FadeIn>

      {/* Tabs */}
      <FadeIn delay={0.16}>
        <div className="mt-8 flex flex-wrap items-end gap-1 border-b border-ink-200">
          <Tab active>
            <span>Issues</span>
            <Pill>{issueCount.open}</Pill>
          </Tab>
          <Tab>
            <span>Pull requests</span>
            <Pill>{prCount.open}</Pill>
          </Tab>
          <Tab>
            <span>Discussions</span>
            <Pill>12</Pill>
          </Tab>
          <Tab>
            <span>Wiki</span>
          </Tab>
        </div>
      </FadeIn>

      {/* Filter bar */}
      <FadeIn delay={0.2}>
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-ink-200 bg-paper-tint px-4 py-3">
          <div className="flex flex-wrap items-center gap-3 text-[13px]">
            <span className="inline-flex items-center gap-1.5 font-medium text-ink-950">
              <span className="h-2 w-2 rounded-full bg-emerald-600" />
              {issueCount.open} Open
            </span>
            <span className="inline-flex items-center gap-1.5 text-ink-500">
              <span className="h-2 w-2 rounded-full bg-ink-400" />
              {issueCount.closed} Closed
            </span>
          </div>
          <div className="flex items-center gap-2 text-[12px] text-ink-500">
            <span>Filter:</span>
            <span className="rounded-full bg-paper px-2.5 py-1 font-medium text-ink-700">
              All labels
            </span>
            <span>·</span>
            <span>Sort: Newest</span>
          </div>
        </div>
      </FadeIn>

      {/* Issue list */}
      <FadeIn delay={0.24}>
        <ul className="mt-3 overflow-hidden rounded-2xl border border-ink-200 bg-paper">
          {ISSUES.map((issue, idx) => (
            <li
              key={issue.number}
              className={`grid grid-cols-12 items-start gap-3 px-4 py-3.5 transition-colors hover:bg-paper-tint sm:gap-4 sm:px-5 ${
                idx > 0 ? "border-t border-ink-100" : ""
              }`}
            >
              <div className="col-span-1 pt-0.5">
                <StateIcon state={issue.state} kind="issue" />
              </div>
              <div className="col-span-11 sm:col-span-8">
                <div className="flex flex-wrap items-baseline gap-1.5">
                  <span className="text-[14.5px] font-medium text-ink-950 hover:text-nessie-700 cursor-pointer">
                    {issue.title}
                  </span>
                  {issue.labels.map((l) => (
                    <span
                      key={l.text}
                      className="rounded-full px-2 py-0.5 text-[10.5px] font-medium text-ink-800"
                      style={{ backgroundColor: l.color }}
                    >
                      {l.text}
                    </span>
                  ))}
                </div>
                <div className="mt-1 text-[12px] text-ink-500">
                  #{issue.number} opened {issue.age} ago by{" "}
                  <span className="text-ink-700">@{issue.author}</span>
                </div>
              </div>
              <div className="col-span-12 flex items-center justify-end gap-3 text-[12px] text-ink-500 sm:col-span-3">
                {issue.comments > 0 && (
                  <span className="inline-flex items-center gap-1">
                    <CommentIcon />
                    {issue.comments}
                  </span>
                )}
              </div>
            </li>
          ))}
        </ul>
      </FadeIn>

      {/* CTA */}
      <FadeInOnView>
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-ink-200 bg-paper p-5">
          <div>
            <h3 className="serif text-[20px] leading-tight text-ink-950">
              See an issue with ns.com?
            </h3>
            <p className="mt-1 text-[13.5px] text-ink-600">
              File it. The kind of UX problem the core team can&apos;t see
              from the inside is exactly what citizens see from the outside.
            </p>
          </div>
          <Link
            href="/solve/new"
            className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-4 py-2 text-[13px] font-medium text-paper transition-colors hover:bg-emerald-700"
          >
            New issue
            <span aria-hidden>→</span>
          </Link>
        </div>
      </FadeInOnView>

      {/* Pull requests preview */}
      <FadeInOnView>
        <div className="mt-12">
          <div className="mb-4 flex items-baseline justify-between">
            <h2 className="serif text-[24px] leading-tight text-ink-950">
              Recent pull requests
            </h2>
            <span className="text-[12px] text-ink-500">
              {prCount.open} open · {prCount.merged} merged
            </span>
          </div>
          <ul className="overflow-hidden rounded-2xl border border-ink-200 bg-paper">
            {PULL_REQUESTS.map((pr, idx) => (
              <li
                key={pr.number}
                className={`grid grid-cols-12 items-start gap-3 px-4 py-3.5 transition-colors hover:bg-paper-tint sm:gap-4 sm:px-5 ${
                  idx > 0 ? "border-t border-ink-100" : ""
                }`}
              >
                <div className="col-span-1 pt-0.5">
                  <StateIcon state={pr.state} kind="pr" />
                </div>
                <div className="col-span-11 sm:col-span-8">
                  <div className="flex flex-wrap items-baseline gap-1.5">
                    <span className="text-[14.5px] font-medium text-ink-950 hover:text-nessie-700 cursor-pointer">
                      {pr.title}
                    </span>
                    {pr.labels.map((l) => (
                      <span
                        key={l.text}
                        className="rounded-full px-2 py-0.5 text-[10.5px] font-medium text-ink-800"
                        style={{ backgroundColor: l.color }}
                      >
                        {l.text}
                      </span>
                    ))}
                  </div>
                  <div className="mt-1 text-[12px] text-ink-500">
                    #{pr.number} · {pr.state} · opened {pr.age} ago by{" "}
                    <span className="text-ink-700">@{pr.author}</span> ·{" "}
                    <span className="font-mono text-emerald-700">
                      +{pr.diff.added}
                    </span>{" "}
                    <span className="font-mono text-rose-700">
                      −{pr.diff.removed}
                    </span>
                  </div>
                </div>
                <div className="col-span-12 flex items-center justify-end gap-3 text-[12px] text-ink-500 sm:col-span-3">
                  {pr.comments > 0 && (
                    <span className="inline-flex items-center gap-1">
                      <CommentIcon />
                      {pr.comments}
                    </span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </FadeInOnView>

      {/* What this is */}
      <FadeInOnView>
        <div className="mt-12 grid gap-3 sm:grid-cols-2">
          <Card title="Why an issue tracker for ns.com?">
            <p>
              The core team can&apos;t see every UX problem from inside the
              product. Citizens see them from outside. An issue tracker is
              the cheapest possible way to capture that signal without
              waiting for someone to file a Jira ticket.
            </p>
          </Card>
          <Card title="Where the issues actually go">
            <p>
              For now, every &ldquo;new issue&rdquo; here lands on Townhall
              ({" "}
              <Link href="/solve" className="text-ink-950 underline-offset-4 hover:underline">
                /solve
              </Link>
              ). Same engine. Same problem-to-bounty-to-fix flow. The /os
              view is just a GitHub-style lens over the same data.
            </p>
          </Card>
          <Card title="Status of this view">
            <p>
              The issues and PRs above are illustrative — they show the
              shape of what an &ldquo;open-source NS&rdquo; could look
              like. Real issues will land here once citizens start filing
              them with target = ns.com.
            </p>
          </Card>
          <Card title="How a PR gets merged">
            <p>
              File an issue. Propose a fix. Get it bountied. Ship it.
              Document it on Townhall. The fix becomes the equivalent of a
              merged PR — attributed forever, with the bounty paid out.
            </p>
          </Card>
        </div>
      </FadeInOnView>

      <FadeInOnView>
        <div className="mt-10 rounded-2xl border border-ink-200 bg-paper-tint p-6">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-500">
            Independent project
          </p>
          <p className="mt-2 text-[14px] leading-[1.65] text-ink-700">
            ness.city/os is a community lens on ns.com. We don&apos;t speak
            for the core team. The issues filed here are signal, not
            commitments. The actual ns.com source code lives at{" "}
            <a
              href="https://ns.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-ink-950 underline-offset-4 hover:underline"
            >
              ns.com
            </a>{" "}
            and is owned by NS0 PTE LTD.
          </p>
        </div>
      </FadeInOnView>

      <FadeInOnView>
        <div className="mt-12 flex flex-wrap gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full bg-ink-950 px-5 py-3 text-[14px] font-medium text-paper transition-colors hover:bg-ink-800"
          >
            Back to the city
            <span aria-hidden>→</span>
          </Link>
          <Link
            href="/solve"
            className="inline-flex items-center gap-2 rounded-full border border-ink-200 bg-paper px-5 py-3 text-[14px] font-medium text-ink-950 transition-colors hover:border-ink-950"
          >
            Open Townhall
          </Link>
        </div>
      </FadeInOnView>
    </main>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-ink-200 bg-paper px-3 py-1 text-[12px]">
      <span className="text-ink-500">{label}</span>
      <span className="font-medium text-ink-950">{value}</span>
    </span>
  );
}

function Tab({
  children,
  active,
}: {
  children: React.ReactNode;
  active?: boolean;
}) {
  return (
    <span
      className={`inline-flex cursor-pointer items-center gap-1.5 border-b-2 px-3 py-2.5 text-[13px] transition-colors ${
        active
          ? "border-ink-950 font-medium text-ink-950"
          : "border-transparent text-ink-600 hover:text-ink-950"
      }`}
    >
      {children}
    </span>
  );
}

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex min-w-[20px] items-center justify-center rounded-full bg-ink-100 px-1.5 py-0.5 font-mono text-[10px] tabular-nums text-ink-700">
      {children}
    </span>
  );
}

function StateIcon({
  state,
  kind,
}: {
  state: "open" | "closed" | "merged" | "draft";
  kind: "issue" | "pr";
}) {
  const sizes = "h-4 w-4";
  if (kind === "issue") {
    if (state === "open") {
      return (
        <span
          className={`${sizes} inline-flex items-center justify-center rounded-full bg-emerald-100 text-emerald-700`}
          title="Open issue"
        >
          <span className="block h-1.5 w-1.5 rounded-full bg-emerald-600" />
        </span>
      );
    }
    return (
      <span
        className={`${sizes} inline-flex items-center justify-center rounded-full bg-violet-100 text-violet-700`}
        title="Closed issue"
      >
        <span className="block h-1.5 w-1.5 rounded-full bg-violet-700" />
      </span>
    );
  }
  // PR
  if (state === "merged") {
    return (
      <span
        className={`${sizes} inline-flex items-center justify-center rounded-sm bg-violet-100 text-violet-700`}
        title="Merged"
      >
        <span className="block h-1 w-1 rounded-full bg-violet-700" />
      </span>
    );
  }
  if (state === "draft") {
    return (
      <span
        className={`${sizes} inline-flex items-center justify-center rounded-sm bg-ink-100 text-ink-700`}
        title="Draft"
      >
        <span className="block h-1 w-1 rounded-full bg-ink-500" />
      </span>
    );
  }
  return (
    <span
      className={`${sizes} inline-flex items-center justify-center rounded-sm bg-emerald-100 text-emerald-700`}
      title="Open PR"
    >
      <span className="block h-1 w-1 rounded-full bg-emerald-600" />
    </span>
  );
}

function CommentIcon() {
  return (
    <svg
      viewBox="0 0 14 14"
      fill="none"
      width="11"
      height="11"
      aria-hidden
      className="text-ink-500"
    >
      <path
        d="M2 3.2C2 2.5 2.5 2 3.2 2h7.6c.7 0 1.2.5 1.2 1.2v5.6c0 .7-.5 1.2-1.2 1.2H6L3 12V3.2z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Card({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-ink-200 bg-paper p-5">
      <h3 className="serif text-[18px] leading-tight text-ink-950">{title}</h3>
      <div className="mt-2 text-[13.5px] leading-[1.65] text-ink-700">
        {children}
      </div>
    </div>
  );
}
