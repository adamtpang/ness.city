import { NextResponse, type NextRequest } from "next/server";

/**
 * routers.ness.city is the standalone home of the router-provisioning tool
 * (the page lives internally at /nslink). It is the same Next app served on a
 * dedicated subdomain so it can be handed out as one clean, focused link
 * without the rest of ness.city around it.
 *
 * On the routers.* host we rewrite page requests to /nslink, while letting
 * /api routes and static assets pass through untouched so the scanner still
 * works. Every other host is unaffected.
 *
 * The ness.city front door now points straight at the main feature — the
 * member rating index (social pagerank) at /members: a request to the apex
 * (or www) home page redirects there. Everything else — the nslink/routers
 * tool, nessie, /api/*, and every preview deployment — keeps serving, so this
 * is a soft, fully reversible handoff (307, not a hard-cached 308).
 */
export const config = {
  matcher: ["/((?!_next/|favicon.ico|.*\\..*).*)"],
};

export function middleware(req: NextRequest) {
  const host = (req.headers.get("host") ?? "").toLowerCase();

  // The apex IS the member rating app now: ness.city (not ness.city/members).
  // Rewrite (not redirect) so the URL stays ness.city; clone() preserves the
  // ?ref= invite param so referral attribution survives the apex link.
  if (
    (host === "ness.city" || host === "www.ness.city") &&
    req.nextUrl.pathname === "/"
  ) {
    const url = req.nextUrl.clone();
    url.pathname = "/members";
    return NextResponse.rewrite(url);
  }

  if (!host.startsWith("routers.")) return NextResponse.next();

  const { pathname } = req.nextUrl;
  if (pathname.startsWith("/api") || pathname === "/routers") {
    return NextResponse.next();
  }
  return NextResponse.rewrite(new URL("/routers", req.url));
}
