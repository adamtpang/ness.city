"use client";

import { PrivyProvider } from "@privy-io/react-auth";

/**
 * Privy auth provider, configured for the lowest-friction identity the
 * rating loop needs: one-tap Google, with email as the only fallback. No
 * wallet / Farcaster / embedded-wallet steps — signing in IS the whole
 * onboarding, and the Google name + photo become the rater's card.
 *
 * Gated on NEXT_PUBLIC_PRIVY_APP_ID. Until that public App ID is set in
 * the env, this renders children plain, so the site works with no auth.
 * Add the App ID (from the Privy dashboard, Google login enabled) and
 * sign-in lights up.
 */
// AUTH OFF for the anonymous beta. Flip AUTH_ENABLED back to true (and set
// NEXT_PUBLIC_PRIVY_APP_ID) to turn Google/email login back on everywhere.
const AUTH_ENABLED = false;
const APP_ID = process.env.NEXT_PUBLIC_PRIVY_APP_ID;

export const PRIVY_ENABLED = AUTH_ENABLED && Boolean(APP_ID);

export function Providers({ children }: { children: React.ReactNode }) {
  if (!PRIVY_ENABLED || !APP_ID) return <>{children}</>;
  return (
    <PrivyProvider
      appId={APP_ID}
      config={{
        loginMethods: ["google", "email"],
        appearance: {
          theme: "light",
          accentColor: "#1c1a17",
        },
      }}
    >
      {children}
    </PrivyProvider>
  );
}
