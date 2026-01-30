"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/libs/prisma";
import { requireOnboarding } from "@/libs/auth";
import { updateProfileSchema } from "./schema";
import { normalizeGpa } from "@/libs/utils";

/**
 * Fetches the current user's profile
 */
export async function getCurrentProfile() {
  const user = await requireOnboarding();

  const profile = await prisma.profile.findUnique({
    where: { userId: user.id },
  });

  return profile;
}

/**
 * Updates the user's profile with validation
 * Partial updates allowed - only provided fields are updated
 */
export async function updateProfile(formData: FormData) {
  try {
    // Ensure user is authenticated and onboarded
    const user = await requireOnboarding();

    // Parse form data
    const rawData: Record<string, any> = {};

    // Academic fields
    if (formData.get("educationLevel"))
      rawData.educationLevel = formData.get("educationLevel") as string;
    if (formData.get("degree"))
      rawData.degree = formData.get("degree") as string;
    if (formData.get("major")) rawData.major = formData.get("major") as string;
    if (formData.get("graduationYear"))
      rawData.graduationYear = parseInt(
        formData.get("graduationYear") as string,
      );
    if (formData.get("gpa"))
      rawData.gpa = parseFloat(formData.get("gpa") as string);
    if (formData.get("gpaScale"))
      rawData.gpaScale = formData.get("gpaScale") as string;

    // Study Goals
    if (formData.get("targetDegree"))
      rawData.targetDegree = formData.get("targetDegree") as string;
    if (formData.get("fieldOfStudy"))
      rawData.fieldOfStudy = formData.get("fieldOfStudy") as string;
    if (formData.get("targetIntake"))
      rawData.targetIntake = formData.get("targetIntake") as string;

    // Preferred Countries (multiple values)
    const countries = formData.getAll("preferredCountries");
    if (countries.length > 0) {
      rawData.preferredCountries = countries as string[];
    }

    // Budget
    if (formData.get("budgetMin"))
      rawData.budgetMin = parseInt(formData.get("budgetMin") as string);
    if (formData.get("budgetMax"))
      rawData.budgetMax = parseInt(formData.get("budgetMax") as string);
    if (formData.get("fundingPlan"))
      rawData.fundingPlan = formData.get("fundingPlan") as string;

    // Readiness
    if (formData.get("ieltsStatus"))
      rawData.ieltsStatus = formData.get("ieltsStatus") as string;
    if (formData.get("greStatus"))
      rawData.greStatus = formData.get("greStatus") as string;
    if (formData.get("sopStatus"))
      rawData.sopStatus = formData.get("sopStatus") as string;

    // Validate with Zod schema
    const validationResult = updateProfileSchema.safeParse(rawData);

    if (!validationResult.success) {
      return {
        success: false,
        errors: validationResult.error.flatten().fieldErrors,
        message: "Validation failed. Please check your inputs.",
      };
    }

    const validatedData = validationResult.data;

    // Prepare update data
    const updateData: any = { ...validatedData };

    // Calculate normalized GPA if GPA or scale changed
    if (validatedData.gpa !== undefined && validatedData.gpaScale) {
      updateData.normalizedGpa = normalizeGpa(
        validatedData.gpa,
        validatedData.gpaScale,
      );
    }

    // Update profile in database
    await prisma.profile.update({
      where: { userId: user.id },
      data: updateData,
    });

    revalidatePath("/profile");
    revalidatePath("/dashboard");

    return {
      success: true,
      message: "Profile updated successfully!",
    };
  } catch (error) {
    console.error("Profile update error:", error);
    return {
      success: false,
      message: "An unexpected error occurred. Please try again.",
    };
  }
}
