"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/libs/prisma";
import {
  Intent,
  DecisionPath,
  SessionStage,
  Level,
  UniversityCategory,
  Priority,
  TaskStatus,
} from "@/app/generated/prisma/client";
import {
  analyzeProfile,
  generateShortlist,
  generateActionPlan,
} from "./helpers/gemini";

/**
 * STAGE 1: Save user's intent and advance to profile analysis
 */
export async function saveIntent(sessionId: string, intent: Intent) {
  try {
    await prisma.counsellingSession.update({
      where: { id: sessionId },
      data: { intent },
    });

    // Save as chat message for context
    await prisma.chatMessage.create({
      data: {
        sessionId,
        role: "USER",
        content: `Selected intent: ${intent}`,
      },
    });

    revalidatePath("/counsellor");
    return { success: true };
  } catch (error) {
    console.error("Failed to save intent:", error);
    return { success: false, error: "Failed to save your selection" };
  }
}

/**
 * STAGE 2: Trigger AI profile analysis
 * This runs automatically after intent is saved
 */
export async function triggerProfileAnalysis(
  sessionId: string,
  userId: string,
) {
  try {
    // Fetch complete profile data
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { profile: true },
    });

    if (!user?.profile?.isComplete) {
      return {
        success: false,
        error: "Profile incomplete - please finish onboarding",
      };
    }

    // Call Gemini for profile analysis
    const analysisResult = await analyzeProfile(user.profile);

    // Save AI response as chat message
    await prisma.chatMessage.create({
      data: {
        sessionId,
        role: "ASSISTANT",
        content: analysisResult.reasoning,
      },
    });

    // Update session with risk level
    await prisma.counsellingSession.update({
      where: { id: sessionId },
      data: {
        riskLevel: analysisResult.riskLevel,
        stage: SessionStage.PROFILE_ANALYZED,
      },
    });

    revalidatePath("/counsellor");
    return { success: true, analysis: analysisResult };
  } catch (error) {
    console.error("Profile analysis failed:", error);

    // Fallback to mock analysis on error
    const mockAnalysis = {
      riskLevel: Level.MEDIUM,
      reasoning:
        "Profile analysis encountered an issue. Based on your profile data, you have a moderate risk profile. We recommend a balanced approach to university selection.",
      suitableRegions: ["USA", "UK", "Canada"],
    };

    // Save fallback as chat message
    await prisma.chatMessage.create({
      data: {
        sessionId,
        role: "ASSISTANT",
        content: `[Fallback Analysis] ${mockAnalysis.reasoning}`,
      },
    });

    // Still advance the stage
    await prisma.counsellingSession.update({
      where: { id: sessionId },
      data: {
        riskLevel: mockAnalysis.riskLevel,
        stage: SessionStage.PROFILE_ANALYZED,
      },
    });

    revalidatePath("/counsellor");
    return { success: true, analysis: mockAnalysis, fallback: true };
  }
}

/**
 * STAGE 3: Save decision path and advance to shortlisting
 */
export async function saveDecisionPath(sessionId: string, path: DecisionPath) {
  try {
    await prisma.counsellingSession.update({
      where: { id: sessionId },
      data: {
        decisionPath: path,
        stage: SessionStage.DECISION_FRAMED,
      },
    });

    // Save as chat message
    await prisma.chatMessage.create({
      data: {
        sessionId,
        role: "USER",
        content: `Selected decision path: ${path}`,
      },
    });

    revalidatePath("/counsellor");
    return { success: true };
  } catch (error) {
    console.error("Failed to save decision path:", error);
    return { success: false, error: "Failed to save decision path" };
  }
}

/**
 * STAGE 4: Generate university shortlist using AI
 */
export async function generateUniversityShortlist(
  sessionId: string,
  userId: string,
  decisionPath: DecisionPath,
) {
  try {
    // Fetch user profile
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { profile: true },
    });

    if (!user?.profile) {
      return { success: false, error: "Profile not found" };
    }

    // Get existing universities from database
    const allUniversities = await prisma.university.findMany({
      take: 44, // Use all 44 dummy universities
    });

    if (allUniversities.length === 0) {
      return {
        success: false,
        error: "No universities available in database",
      };
    }

    // Call Gemini to generate shortlist from available universities
    const shortlistResult = await generateShortlist(
      user.profile,
      decisionPath,
      allUniversities,
    );

    // Save AI reasoning as chat message
    await prisma.chatMessage.create({
      data: {
        sessionId,
        role: "ASSISTANT",
        content: `Generated shortlist based on your ${decisionPath} path:\n\n${shortlistResult.reasoning}`,
      },
    });

    // Persist shortlisted universities
    const shortlistPromises = shortlistResult.universities.map((uni) =>
      prisma.shortlistedUniversity.create({
        data: {
          counsellingSessionId: sessionId,
          universityId: uni.universityId,
          category: uni.category,
          reasoning: uni.reasoning,
          risks: uni.risks,
          costLevel: uni.costLevel,
          acceptanceChance: uni.acceptanceChance,
        },
      }),
    );

    await Promise.all(shortlistPromises);

    // Advance stage
    await prisma.counsellingSession.update({
      where: { id: sessionId },
      data: { stage: SessionStage.SHORTLISTED },
    });

    revalidatePath("/counsellor");
    return { success: true };
  } catch (error) {
    console.error("Shortlist generation failed:", error);

    // Fallback: Create mock shortlist from random universities
    try {
      const universities = await prisma.university.findMany({
        take: 8,
      });

      if (universities.length === 0) {
        throw new Error("No universities available for fallback");
      }

      // Create mock shortlist with balanced categories
      const categories: UniversityCategory[] = [
        UniversityCategory.DREAM,
        UniversityCategory.DREAM,
        UniversityCategory.TARGET,
        UniversityCategory.TARGET,
        UniversityCategory.TARGET,
        UniversityCategory.SAFE,
        UniversityCategory.SAFE,
        UniversityCategory.SAFE,
      ];

      const shortlistPromises = universities.slice(0, 8).map((uni, idx) =>
        prisma.shortlistedUniversity.create({
          data: {
            counsellingSessionId: sessionId,
            universityId: uni.id,
            category: categories[idx] || UniversityCategory.TARGET,
            reasoning: `${uni.name} selected based on your profile and ${decisionPath} path.`,
            risks: "Moderate competition expected.",
            costLevel: Level.MEDIUM,
            acceptanceChance: Level.MEDIUM,
          },
        }),
      );

      await Promise.all(shortlistPromises);

      // Save fallback message
      await prisma.chatMessage.create({
        data: {
          sessionId,
          role: "ASSISTANT",
          content:
            "[Fallback Mode] Generated university shortlist based on your profile. Due to a temporary issue, some recommendations may be generalized.",
        },
      });

      // Still advance stage
      await prisma.counsellingSession.update({
        where: { id: sessionId },
        data: { stage: SessionStage.SHORTLISTED },
      });

      revalidatePath("/counsellor");
      return { success: true, fallback: true };
    } catch (fallbackError) {
      console.error("Fallback shortlist failed:", fallbackError);
      return {
        success: false,
        error: "Failed to generate shortlist. Please try again.",
      };
    }
  }
}

/**
 * STAGE 5: Lock the session decision
 */
export async function lockSession(sessionId: string) {
  try {
    await prisma.counsellingSession.update({
      where: { id: sessionId },
      data: {
        isLocked: true,
        stage: SessionStage.LOCKED,
      },
    });

    // Lock all shortlisted universities
    await prisma.shortlistedUniversity.updateMany({
      where: { counsellingSessionId: sessionId },
      data: {
        isLocked: true,
        lockedAt: new Date(),
      },
    });

    await prisma.chatMessage.create({
      data: {
        sessionId,
        role: "USER",
        content: "Locked university selection for action planning.",
      },
    });

    revalidatePath("/counsellor");
    return { success: true };
  } catch (error) {
    console.error("Failed to lock session:", error);
    return { success: false, error: "Failed to lock decision" };
  }
}

/**
 * STAGE 6: Generate action plan with tasks
 */
export async function generateTasks(sessionId: string, userId: string) {
  try {
    // Fetch session with shortlisted universities
    const session = await prisma.counsellingSession.findUnique({
      where: { id: sessionId },
      include: {
        shortlisted: {
          include: {
            university: true,
          },
        },
      },
    });

    if (!session) {
      return { success: false, error: "Session not found" };
    }

    // Call Gemini for task generation
    const taskResult = await generateActionPlan(session.shortlisted);

    // Save reasoning as chat message
    await prisma.chatMessage.create({
      data: {
        sessionId,
        role: "ASSISTANT",
        content: `Generated 30-60 day action plan:\n\n${taskResult.reasoning}`,
      },
    });

    // Persist tasks
    const taskPromises = taskResult.tasks.map((task) =>
      prisma.task.create({
        data: {
          userId,
          counsellingSessionId: sessionId,
          universityId: task.universityId,
          title: task.title,
          description: task.description,
          priority: task.priority,
          dueDate: task.dueDate,
          status: TaskStatus.TODO,
        },
      }),
    );

    await Promise.all(taskPromises);

    // Final stage advancement
    await prisma.counsellingSession.update({
      where: { id: sessionId },
      data: { stage: SessionStage.ACTION_PLAN_CREATED },
    });

    revalidatePath("/counsellor");
    return { success: true };
  } catch (error) {
    console.error("Task generation failed:", error);

    // Fallback: Generate basic milestone tasks
    try {
      const today = new Date();
      const fallbackTasks = [
        {
          title: "Prepare Application Documents",
          description:
            "Gather transcripts, recommendation letters, and personal statement drafts.",
          priority: Priority.HIGH,
          dueDate: new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000), // 7 days
        },
        {
          title: "Research Scholarship Opportunities",
          description:
            "Identify and list available scholarships for your target universities.",
          priority: Priority.HIGH,
          dueDate: new Date(today.getTime() + 14 * 24 * 60 * 60 * 1000), // 14 days
        },
        {
          title: "Complete Standardized Tests",
          description: "Finish IELTS/GRE/GMAT if not already completed.",
          priority: Priority.MEDIUM,
          dueDate: new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000), // 30 days
        },
        {
          title: "Submit Applications",
          description:
            "Submit completed applications to all shortlisted universities.",
          priority: Priority.HIGH,
          dueDate: new Date(today.getTime() + 45 * 24 * 60 * 60 * 1000), // 45 days
        },
        {
          title: "Follow Up on Applications",
          description:
            "Track application status and respond to university communications.",
          priority: Priority.MEDIUM,
          dueDate: new Date(today.getTime() + 60 * 24 * 60 * 60 * 1000), // 60 days
        },
      ];

      const taskPromises = fallbackTasks.map((task) =>
        prisma.task.create({
          data: {
            userId,
            counsellingSessionId: sessionId,
            ...task,
            status: TaskStatus.TODO,
          },
        }),
      );

      await Promise.all(taskPromises);

      await prisma.chatMessage.create({
        data: {
          sessionId,
          role: "ASSISTANT",
          content:
            "[Fallback Mode] Created a basic action plan with key milestones. You can customize these tasks as needed.",
        },
      });

      await prisma.counsellingSession.update({
        where: { id: sessionId },
        data: { stage: SessionStage.ACTION_PLAN_CREATED },
      });

      revalidatePath("/counsellor");
      return { success: true, fallback: true };
    } catch (fallbackError) {
      console.error("Fallback task generation failed:", fallbackError);
      return {
        success: false,
        error: "Failed to generate action plan. Please try again.",
      };
    }
  }
}

/**
 * Create a new counselling session (with confirmation)
 */
export async function createNewSession(userId: string) {
  try {
    const newSession = await prisma.counsellingSession.create({
      data: {
        userId,
        stage: SessionStage.INTENT_CONFIRMED,
      },
    });

    revalidatePath("/counsellor");
    return { success: true, sessionId: newSession.id };
  } catch (error) {
    console.error("Failed to create new session:", error);
    return { success: false, error: "Failed to start new session" };
  }
}

/**
 * Retry action for failed AI calls
 */
export async function retryAIAction(
  action: "profile" | "shortlist" | "tasks",
  sessionId: string,
  userId: string,
  ...args: any[]
) {
  switch (action) {
    case "profile":
      return triggerProfileAnalysis(sessionId, userId);
    case "shortlist":
      return generateUniversityShortlist(
        sessionId,
        userId,
        args[0] as DecisionPath,
      );
    case "tasks":
      return generateTasks(sessionId, userId);
    default:
      return { success: false, error: "Unknown action" };
  }
}
