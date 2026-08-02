import { cookies } from "next/headers";
import { randomUUID } from "node:crypto";
import { parseRaterIdentity, type RaterIdentity } from "./rater";

/**
 * Anonymous identity for the no-login beta. A signed-in Privy user (once that
 * ships) always wins; otherwise every visitor gets a durable, server-set
 * httpOnly device id.
 *
 * This cookie is the anti-gaming anchor: unlike a localStorage id it survives
 * a "clear site data" / cache wipe and only resets on a full cookie clear, so
 * one person can't cheaply spin up a pile of raters. Combined with the vote
 * dampeners already in the model — one vote per pair, Bayesian shrinkage, and
 * the 3-distinct-raters floor to rank — casual ballot-stuffing goes nowhere.
 * Real Google login closes the remaining gap (incognito + VPN) at launch.
 */
const COOKIE = "ness_did";
const ONE_YEAR = 60 * 60 * 24 * 365;

export async function anonIdentity(): Promise<RaterIdentity> {
  const jar = await cookies();
  let id = jar.get(COOKIE)?.value;
  if (!id || id.length < 8) {
    id = randomUUID();
    jar.set(COOKIE, id, {
      httpOnly: true,
      sameSite: "lax",
      secure: true,
      maxAge: ONE_YEAR,
      path: "/",
    });
  }
  return { did: `anon:${id}`, email: null, displayName: null, handle: null };
}

/**
 * The rater identity for a request: a real (Privy) identity from the body if
 * present, else the durable anonymous device identity. Rating always has an
 * identity now — there is no "signed out, can't rate" state in the beta.
 */
export async function resolveIdentity(body: unknown): Promise<RaterIdentity> {
  return parseRaterIdentity(body) ?? (await anonIdentity());
}
