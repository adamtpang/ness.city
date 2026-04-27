export type ProblemStatus = "open" | "investigating" | "in-progress" | "solved";

export type Citizen = {
  id: string;
  handle: string;
  name: string;
  avatar: string;
  credit: number;
  solved: number;
  joined: string;
  bio?: string;
};

export type Solution = {
  id: string;
  problemId: string;
  authorId: string;
  summary: string;
  body: string;
  shippedAt?: string;
  createdAt: string;
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
  solutions: Solution[];
};
