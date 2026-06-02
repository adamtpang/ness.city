import { redirect } from "next/navigation";

/** The forum moved to /townhall. Keep /townhall alive as a redirect. */
export default function SolveRedirect() {
  redirect("/townhall");
}
