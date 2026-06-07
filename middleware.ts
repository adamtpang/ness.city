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
 */
export const config = {
  matcher: ["/((?!_next/|favicon.ico|.*\\..*).*)"],
};

export function middleware(req: NextRequest) {
  const host = (req.headers.get("host") ?? "").toLowerCase();
  if (!host.startsWith("routers.")) return NextResponse.next();

  const { pathname } = req.nextUrl;
  if (pathname.startsWith("/api") || pathname === "/routers") {
    return NextResponse.next();
  }
  return NextResponse.rewrite(new URL("/routers", req.url));
}
