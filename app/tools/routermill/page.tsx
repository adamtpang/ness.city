import { redirect } from "next/navigation";

/** Routermill was renamed to nslink in v0.29. Keep this URL alive as a
 *  permanent redirect for any bookmarks Conor or others might have. */
export default function RoutermillRedirect() {
  redirect("/nslink");
}
