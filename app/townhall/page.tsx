import { redirect } from "next/navigation";

/** The engine is the home page now. /townhall (the list) redirects there.
 *  Problem detail pages still live at /townhall/[slug]. */
export default function TownhallRedirect() {
  redirect("/");
}
