import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "What ness.city collects, why it is used, which service providers receive it, and how to request correction or deletion.",
  alternates: { canonical: "/privacy" },
};

const externalClass =
  "font-medium text-ink-950 underline decoration-ink-300 underline-offset-4 hover:decoration-ink-950";

export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-3xl px-5 pb-24 pt-14">
      <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-500">
        Privacy notice · effective 29 August 2026
      </p>
      <h1 className="serif mt-3 text-[48px] leading-[1.02] text-ink-950 sm:text-[60px]">
        Privacy at ness.city.
      </h1>
      <p className="mt-6 text-[17px] leading-[1.7] text-ink-700">
        This notice describes the production ness.city service operated by Adam
        Pang. Ness is an independent project, not a Network School or ns.com
        service. Questions and requests use the paths on the{" "}
        <Link href="/contact" className={externalClass}>
          contact page
        </Link>
        .
      </p>

      <div className="mt-14 space-y-12">
        <PolicySection title="Browsing and analytics">
          <p>
            Vercel hosts ness.city and receives ordinary request information
            such as IP address, user agent, requested URL, timestamps, and
            service logs. Vercel Web Analytics records page views, referrers,
            coarse location, device type, operating system, and browser for
            aggregated traffic reporting. Vercel states that Web Analytics
            uses no analytics cookie and resets its request-derived visitor
            hash after 24 hours.
          </p>
        </PolicySection>

        <PolicySection title="Anonymous member ratings">
          <p>
            Ness Members creates a random device identifier after its client
            requests the rating or leaderboard APIs. The identifier is stored
            in the <code>ness_did</code> cookie for up to 1 year with Secure,
            HttpOnly, and SameSite=Lax protections, then associated in Postgres
            with ratings, referral attribution, and participation counts.
            Public pages expose aggregate ranking information, not the rater
            behind an individual rating.
          </p>
          <p>
            Browser local storage keeps the one-time consent marker, a referral
            code when present, a share-prompt marker, and an offline queue of
            ratings waiting to sync. Clearing site data removes those local
            values and the device cookie, but it does not automatically delete
            records already stored on the server.
          </p>
          <p>
            Member directory records can contain a display name, handle,
            profile image URL, role or bio, location, on-campus status, GitHub
            handle, industry, member type, join information, and skills. The
            current database includes directory information sourced from the
            Network School directory plus profiles people add themselves. The
            roster API is participation-gated; aggregate index rows and
            voluntarily submitted destination plans can be visible to other
            users.
          </p>
        </PolicySection>

        <PolicySection title="Content you choose to submit">
          <p>
            Ness stores information submitted to Townhall, proposals, comments,
            pledges, documentation, gatherings, PageRank rings, destination
            plans, feedback, and the internal waitlist. Depending on the form,
            a submission can include a name or handle, email address, rating,
            message, page path, event details, named connections, payment
            reference, or other free text. Public contribution forms are meant
            for shareable community information, not secrets or private
            personal data.
          </p>
          <p>
            The public Join links open a Google Form and WhatsApp rather than
            submitting data to ness.city. Information entered after following
            those links is handled by Google or WhatsApp under their own terms.
            The separate internal waitlist API, where used, stores email,
            optional note, source label, and submission time in the Ness
            Postgres database.
          </p>
        </PolicySection>

        <PolicySection title="AI features and router images">
          <p>
            Messages sent to Nessie are forwarded with recent conversation
            context and any locally saved name or handle to Anthropic&apos;s API so
            Claude can generate a reply. When a user agrees to publish a
            concrete problem, the resulting problem fields are stored in Ness
            and become public. Experience ratings and follow-up feedback are
            stored directly in the Ness database.
          </p>
          <p>
            Router-label images submitted to the Routers tool are forwarded to
            Anthropic for text extraction. Ness does not write the uploaded
            image or the extracted router credentials to its Postgres schema,
            but Anthropic receives the image as the processor for that request.
            Users should treat default Wi-Fi passwords and router labels as
            sensitive and use the tool only with authorization.
          </p>
        </PolicySection>

        <PolicySection title="Service providers and sharing">
          <p>
            Ness uses Vercel for hosting, delivery, logs, and Web Analytics;
            Supabase-hosted Postgres for application records; and Anthropic for
            the AI features described above. Public profile images may load
            from assets.ns.com, which receives the ordinary image request.
            GitHub hosts the public source and issue tracker. External links
            lead to services with their own privacy practices.
          </p>
          <p>
            Ness does not sell personal data. Production does not currently
            configure the optional Discord webhook integrations present in the
            source. If a new processor or forwarding integration is enabled,
            this notice should be updated before that integration receives new
            submissions.
          </p>
        </PolicySection>

        <PolicySection title="Retention, correction, and deletion">
          <p>
            Ness currently has no automated deletion schedule for server-side
            ratings, directory records, contributions, feedback, or waitlist
            entries. Local browser values remain until they sync, expire, or
            the user clears site data. Hosting and analytics records follow the
            applicable Vercel service settings and retention windows.
          </p>
          <p>
            Correction, removal, and deletion requests are handled manually
            through the contact page because Ness has no self-service account
            deletion flow. A request needs enough detail to locate the record;
            a pseudonymous device rating may be difficult to identify after
            its cookie is cleared. Public contributions can require a separate
            review to preserve the integrity of related community records.
          </p>
        </PolicySection>

        <PolicySection title="Security and changes">
          <p>
            Ness uses HTTPS, a restrictive browser content policy, protected
            cookies, participation gates, write rate limits, and access tokens
            for operator-only member exports and dashboards. No internet
            service can promise perfect security, so sensitive credentials and
            private personal information should not be placed in public forms
            or issue reports.
          </p>
          <p>
            Material changes to collection, sharing, or product behavior will
            be reflected on this page. The effective date above identifies the
            version that describes the current production implementation.
          </p>
        </PolicySection>
      </div>
    </main>
  );
}

function PolicySection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h2 className="serif text-[28px] leading-tight text-ink-950">{title}</h2>
      <div className="mt-3 space-y-4 text-[14.5px] leading-[1.75] text-ink-700">
        {children}
      </div>
    </section>
  );
}
