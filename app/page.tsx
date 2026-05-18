import { redirect } from "next/navigation";

/**
 * Focus mode: the product is the marketplace. ness.city sends you
 * straight to the market. Every other surface still lives at its own URL
 * (the code is all still here), it's just off the front door for now.
 */
export default function Home() {
  redirect("/market");
}
