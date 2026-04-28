export type ProblemStatus = "open" | "investigating" | "in-progress" | "solved";

export type Citizen = {
  id: string;
  handle: string;
  name: string;
  avatar: string;
  karma: number;
  patronage: number;
  solved: number;
  funded: number;
  joined: string;
  bio?: string;
};

export type SolutionProposal = {
  id: string;
  authorId: string;
  summary: string;
  body: string;
  createdAt: string;
  upvotes: number;
};

export type Pledge = {
  patronId: string;
  amount: number;
  pledgedAt: string;
  note?: string;
};

export type Bounty = {
  proposalId: string;
  goal: number;
  pledges: Pledge[];
  state: "collecting" | "funded" | "claimed" | "paid";
  claimedBy?: string;
  paidAt?: string;
};

export type Documentation = {
  authorId: string;
  body: string;
  cost?: number;
  shippedAt: string;
  upvotes: number;
};

export type Problem = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  rootCause: string;
  category: "operations" | "social" | "infra" | "policy" | "wellbeing";
  status: ProblemStatus;
  reporterId: string;
  createdAt: string;
  upvotes: number;
  affected: number;
  proposals: SolutionProposal[];
  bounty?: Bounty;
  documentation?: Documentation;
};
