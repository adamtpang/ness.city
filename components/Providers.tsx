"use client";

import { PrivyProvider } from "@privy-io/react-auth";
import { base } from "viem/chains";

/**
 * Privy auth provider. Identity keystone: email / wallet / Farcaster /
 * Google login, embedded wallets on Base (no seed phrase), three privacy
 * tiers (anonymous, pseudonymous handle, verified real name).
 *
 * Gated on NEXT_PUBLIC_PRIVY_APP_ID. Until that public App ID is set in
 * the env, this renders children plain, so the site works with no auth.
 * Add the App ID (from the Privy dashboard) and sign-in lights up.
 */
const APP_ID = process.env.NEXT_PUBLIC_PRIVY_APP_ID;

export const PRIVY_ENABLED = Boolean(APP_ID);

export function Providers({ children }: { children: React.ReactNode }) {
  if (!APP_ID) return <>{children}</>;
  return (
    <PrivyProvider
      appId={APP_ID}
      config={{
        loginMethods: ["email", "wallet", "farcaster", "google"],
        appearance: {
          theme: "light",
          accentColor: "#2563eb",
        },
        embeddedWallets: {
          ethereum: {
            createOnLogin: "users-without-wallets",
          },
        },
        defaultChain: base,
        supportedChains: [base],
      }}
    >
      {children}
    </PrivyProvider>
  );
}
