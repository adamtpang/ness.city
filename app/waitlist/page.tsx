import type { Metadata } from "next";
import { JoinCard } from "@/components/JoinCard";

export const metadata: Metadata = {
  title: "Waitlist · Ness",
  description:
    "Join the Ness beta waitlist. Open sourcerers, patrons, and solvers welcome.",
};

export default function WaitlistPage() {
  return <JoinCard />;
}
