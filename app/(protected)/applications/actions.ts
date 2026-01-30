"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/libs/prisma";
import { TaskStatus } from "@/app/generated/prisma/enums";

/**
 * Fetches the latest locked counselling session for a user
 * along with shortlisted universities and tasks
 */
export async function getLockedSession(userId: string) {
  const session = await prisma.counsellingSession.findFirst({
    where: {
      userId,
      isLocked: true,
      stage: "ACTION_PLAN_CREATED",
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      shortlisted: {
        include: {
          university: true,
        },
        orderBy: {
          category: "asc", // DREAM -> TARGET -> SAFE
        },
      },
      tasks: {
        include: {
          university: true,
        },
        orderBy: [
          { status: "asc" }, // TODO first
          { priority: "desc" }, // HIGH priority first
          { dueDate: "asc" }, // Earliest due date first
        ],
      },
    },
  });

  if (!session) {
    return null;
  }

  return {
    session,
    universities: session.shortlisted,
    tasks: session.tasks,
  };
}

/**
 * Updates a task's status
 * Only allows forward progression: TODO -> IN_PROGRESS -> COMPLETED
 */
export async function updateTaskStatus(taskId: string, newStatus: TaskStatus) {
  try {
    // Fetch current task
    const task = await prisma.task.findUnique({
      where: { id: taskId },
    });

    if (!task) {
      return { success: false, error: "Task not found" };
    }

    // Validate progression
    const statusOrder = ["TODO", "IN_PROGRESS", "COMPLETED"];
    const currentIndex = statusOrder.indexOf(task.status);
    const newIndex = statusOrder.indexOf(newStatus);

    if (newIndex < currentIndex) {
      return {
        success: false,
        error: "Cannot move task backwards in status",
      };
    }

    // Update task
    await prisma.task.update({
      where: { id: taskId },
      data: { status: newStatus },
    });

    revalidatePath("/applications");

    return { success: true };
  } catch (error) {
    console.error("Error updating task:", error);
    return { success: false, error: "Failed to update task" };
  }
}

/**
 * Updates application status for a shortlisted university
 * This is a mock implementation - stores status in-memory or could be extended to DB
 */
export async function updateApplicationStatus(
  shortlistedUniversityId: string,
  status: string,
) {
  // For now, this is a placeholder
  // In a real implementation, you might add an `applicationStatus` field to ShortlistedUniversity
  // For this module, we'll handle this client-side with local state

  revalidatePath("/applications");
  return { success: true, status };
}
