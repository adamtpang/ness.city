import { redirect } from "next/navigation";

/** Routermill -> nslink -> routers. Keep this URL alive as a permanent
 *  redirect for any bookmarks Conor or others might have. */
export default function RoutermillRedirect() {
  redirect("/routers");
}
