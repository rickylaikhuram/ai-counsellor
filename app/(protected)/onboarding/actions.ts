"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/libs/prisma";
import { getCurrentUser } from "@/libs/auth";
import {
  academicStepSchema,
  studyGoalStepSchema,
  budgetStepSchema,
  examsStepSchema,
} from "@/libs/validators/onboarding";

export async function saveAcademicStep(data: unknown) {
  const user = await getCurrentUser();
  if (!user) throw new Error("Unauthorized");

  const validated = academicStepSchema.parse(data);

  // Check if profile exists
  const existingProfile = await prisma.profile.findUnique({
    where: { userId: user.id },
  });

  if (existingProfile) {
    // Update existing profile
    await prisma.profile.update({
      where: { userId: user.id },
      data: validated,
    });
  } else {
    // Create new profile with required fields
    await prisma.profile.create({
      data: {
        userId: user.id,
        ...validated,
        isComplete: false,
      },
    });
  }

  revalidatePath("/onboarding");
  return { success: true };
}

export async function saveStudyGoalStep(data: unknown) {
  const user = await getCurrentUser();
  if (!user) throw new Error("Unauthorized");

  const validated = studyGoalStepSchema.parse(data);

  // Profile MUST exist by this point (created in step 1)
  const existingProfile = await prisma.profile.findUnique({
    where: { userId: user.id },
  });

  if (!existingProfile) {
    throw new Error("Please complete Academic Background first");
  }

  // Update only
  await prisma.profile.update({
    where: { userId: user.id },
    data: validated,
  });

  revalidatePath("/onboarding");
  return { success: true };
}

export async function saveBudgetStep(data: unknown) {
  const user = await getCurrentUser();
  if (!user) throw new Error("Unauthorized");

  const validated = budgetStepSchema.parse(data);

  // Profile MUST exist by this point
  const existingProfile = await prisma.profile.findUnique({
    where: { userId: user.id },
  });

  if (!existingProfile) {
    throw new Error("Please complete previous steps first");
  }

  // Update only
  await prisma.profile.update({
    where: { userId: user.id },
    data: validated,
  });

  revalidatePath("/onboarding");
  return { success: true };
}

export async function completeOnboarding(data: unknown) {
  const user = await getCurrentUser();
  if (!user) throw new Error("Unauthorized");

  const validated = examsStepSchema.parse(data);

  // Profile MUST exist by this point
  const existingProfile = await prisma.profile.findUnique({
    where: { userId: user.id },
  });

  if (!existingProfile) {
    throw new Error("Please complete previous steps first");
  }

  // Mark as complete
  await prisma.profile.update({
    where: { userId: user.id },
    data: {
      ...validated,
      isComplete: true,
    },
  });

  revalidatePath("/onboarding");
  revalidatePath("/dashboard");

  return { success: true };
}
