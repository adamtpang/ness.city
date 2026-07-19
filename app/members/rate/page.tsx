import { redirect } from "next/navigation";

/** The rate flow now lives as a tab on /members. Keep this path working. */
export default function RateRedirect() {
  redirect("/members");
}
