import type { Metadata } from "next";
import { JoinCard } from "@/components/JoinCard";

export const metadata: Metadata = {
  title: "Join Ness",
  description: "Scan to join Ness. Open sourcerers, patrons, and solvers.",
};

export default function JoinPage() {
  return <JoinCard />;
}
