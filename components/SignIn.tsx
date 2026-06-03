"use client";

import { usePrivy } from "@privy-io/react-auth";

/**
 * Sign-in / account button. Only mounted when Privy is configured (the
 * Header gates it on the App ID), so usePrivy always has its provider.
 */
export function SignIn() {
  const { ready, authenticated, user, login, logout } = usePrivy();

  if (!ready) {
    return <span className="h-7 w-16 rounded-full bg-ink-100" aria-hidden />;
  }

  if (authenticated) {
    const label =
      user?.email?.address ??
      user?.farcaster?.username ??
      (user?.wallet?.address
        ? `${user.wallet.address.slice(0, 6)}...${user.wallet.address.slice(-4)}`
        : "account");
    return (
      <button
        onClick={() => logout()}
        className="rounded-full border border-ink-200 px-3 py-1.5 text-[12px] font-medium text-ink-700 transition-colors hover:border-ink-950 hover:text-ink-950"
        title="Sign out"
      >
        {label}
      </button>
    );
  }

  return (
    <button
      onClick={() => login()}
      className="rounded-full bg-ink-950 px-3.5 py-1.5 text-[12px] font-medium text-paper transition-colors hover:bg-ink-800"
    >
      Sign in
    </button>
  );
}
