import { redirect } from "next/navigation";

/** The router tool lives at /routers now. Keep /nslink as a permanent
 *  redirect for any older links (it was briefly nslink, then routers). */
export default function NslinkRedirect() {
  redirect("/routers");
}
