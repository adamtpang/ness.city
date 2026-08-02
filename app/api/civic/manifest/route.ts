import { NextResponse } from "next/server";
import { NESS_MANIFEST } from "@/lib/civic/protocol";

export const runtime = "nodejs";

/**
 * The node manifest. Served at /.well-known/civic.json (see next.config.mjs)
 * so any other node, or a registry like interneta.world, can discover what
 * this node is and what it exposes without prior arrangement.
 */
export async function GET() {
  return NextResponse.json(NESS_MANIFEST, {
    headers: {
      "Cache-Control": "public, max-age=300",
      "Access-Control-Allow-Origin": "*",
    },
  });
}
