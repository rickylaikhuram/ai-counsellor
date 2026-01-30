"use server";

import prisma  from "@/libs/prisma";
import { onboardingSchema } from "../lib/schemas";
import { normalizeGpa } from "@/libs/utils";
import { revalidatePath } from "next/cache";

export async function saveProfile(userId: string, data: unknown) {
  try {
    const validated = onboardingSchema.parse(data);

    const normalizedGpa = normalizeGpa(validated.gpa, validated.gpaScale);

    const profile = await prisma.profile.upsert({
      where: { userId },
      update: {
        educationLevel: validated.educationLevel,
        degree: validated.degree,
        major: validated.major,
        graduationYear: validated.graduationYear,
        gpa: validated.gpa,
        gpaScale: validated.gpaScale,
        normalizedGpa,
        targetDegree: validated.targetDegree,
        fieldOfStudy: validated.fieldOfStudy,
        targetIntake: validated.targetIntake,
        preferredCountries: validated.preferredCountries,
        budgetMin: validated.budgetMin,
        budgetMax: validated.budgetMax,
        fundingPlan: validated.fundingPlan,
        ieltsStatus: validated.ieltsStatus,
        greStatus: validated.greStatus,
        sopStatus: validated.sopStatus,
        isComplete: true,
        currentStage: "DISCOVERING",
      },
      create: {
        userId,
        educationLevel: validated.educationLevel,
        degree: validated.degree,
        major: validated.major,
        graduationYear: validated.graduationYear,
        gpa: validated.gpa,
        gpaScale: validated.gpaScale,
        normalizedGpa,
        targetDegree: validated.targetDegree,
        fieldOfStudy: validated.fieldOfStudy,
        targetIntake: validated.targetIntake,
        preferredCountries: validated.preferredCountries,
        budgetMin: validated.budgetMin,
        budgetMax: validated.budgetMax,
        fundingPlan: validated.fundingPlan,
        ieltsStatus: validated.ieltsStatus,
        greStatus: validated.greStatus,
        sopStatus: validated.sopStatus,
        isComplete: true,
        currentStage: "DISCOVERING",
      },
    });

    revalidatePath("/dashboard");

    return { success: true, profile };
  } catch (error) {
    console.error("Failed to save profile:", error);
    return { success: false, error: "Failed to save profile" };
  }
}
