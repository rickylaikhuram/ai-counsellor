// app/dashboard/_actions/dashboard.actions.ts
"use server";

import { redirect } from "next/navigation";
import { requireOnboarding } from "@/libs/auth";
import prisma from "@/libs/prisma";

export type DashboardState = {
  user: {
    id: string;
    email: string;
  };
  profile: {
    isComplete: boolean;
    currentStage:
      | "BUILDING_PROFILE"
      | "DISCOVERING"
      | "FINALIZING"
      | "PREPARING";
  };
  latestSession: {
    id: string;
    stage:
      | "INTENT_CONFIRMED"
      | "PROFILE_ANALYZED"
      | "DECISION_FRAMED"
      | "SHORTLISTED"
      | "LOCKED"
      | "ACTION_PLAN_CREATED";
    isLocked: boolean;
    createdAt: Date;
  } | null;
  stats: {
    shortlistedCount: number;
    pendingTasksCount: number;
  };
};

export async function getDashboardState(): Promise<DashboardState> {
  const user = await requireOnboarding();

  if (!user.profile) {
    throw new Error("User profile not found");
  }
  // Fetch latest counselling session
  const latestSession = await prisma.counsellingSession.findFirst({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      stage: true,
      isLocked: true,
      createdAt: true,
    },
  });

  // Fetch tasks count
  const pendingTasksCount = await prisma.task.count({
    where: {
      userId: user.id,
      status: { in: ["TODO", "IN_PROGRESS"] },
    },
  });

  // Count shortlisted universities (derive from locked sessions)
  // Assuming shortlist is finalized when session is locked
  const shortlistedCount = latestSession?.isLocked
    ? await prisma.counsellingSession.count({
        where: {
          userId: user.id,
          isLocked: true,
        },
      })
    : 0;

  return {
    user: {
      id: user.id,
      email: user.email,
    },
    profile: {
      isComplete: user.profile.isComplete,
      currentStage: user.profile.currentStage,
    },
    latestSession,
    stats: {
      shortlistedCount,
      pendingTasksCount,
    },
  };
}

export async function startCounsellingSession() {
  const user = await requireOnboarding();

  // Create new counselling session
  const session = await prisma.counsellingSession.create({
    data: {
      userId: user.id,
      stage: "INTENT_CONFIRMED",
      isLocked: false,
    },
  });

  redirect("/counsellor");
}
