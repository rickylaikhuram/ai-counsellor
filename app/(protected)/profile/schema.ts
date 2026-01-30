import { z } from "zod";
import { FundingPlan, Status } from "@/app/generated/prisma/enums";

// GPA scales
const gpaScales = ["4.0", "5.0", "10.0", "100"] as const;

// All countries for selection
export const COUNTRIES = [
  "United States",
  "United Kingdom",
  "Canada",
  "Australia",
  "Germany",
  "France",
  "Netherlands",
  "Sweden",
  "Denmark",
  "Norway",
  "Finland",
  "Switzerland",
  "Italy",
  "Spain",
  "Ireland",
  "New Zealand",
  "Singapore",
  "Japan",
  "South Korea",
  "China",
  "Hong Kong",
  "Malaysia",
  "Austria",
  "Belgium",
  "Czech Republic",
  "Poland",
  "Portugal",
  "Greece",
  "Turkey",
  "UAE",
  "India",
  "Other",
] as const;

export const updateProfileSchema = z
  .object({
    // Academic Background
    educationLevel: z.string().optional(),
    degree: z.string().optional(),
    major: z.string().optional(),
    graduationYear: z.number().int().min(1950).max(2050).optional(),
    gpa: z.number().min(0).optional(),
    gpaScale: z.enum(gpaScales).optional(),

    // Study Goals
    targetDegree: z.string().optional(),
    fieldOfStudy: z.string().optional(),
    targetIntake: z.string().optional(),
    preferredCountries: z.array(z.string()).optional(),

    // Budget
    budgetMin: z.number().int().min(0).optional(),
    budgetMax: z.number().int().min(0).optional(),
    fundingPlan: z.nativeEnum(FundingPlan).optional(),

    // Readiness
    ieltsStatus: z.nativeEnum(Status).optional(),
    greStatus: z.nativeEnum(Status).optional(),
    sopStatus: z.nativeEnum(Status).optional(),
  })
  .superRefine((data, ctx) => {
    // Rule: If GPA is updated, GPA scale must be provided
    if (data.gpa !== undefined && !data.gpaScale) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "GPA scale is required when updating GPA",
        path: ["gpaScale"],
      });
    }

    // Rule: If GPA scale is updated, GPA must be provided
    if (data.gpaScale !== undefined && data.gpa === undefined) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "GPA is required when updating GPA scale",
        path: ["gpa"],
      });
    }

    // Rule: Validate GPA against scale
    if (data.gpa !== undefined && data.gpaScale !== undefined) {
      const maxGpa = parseFloat(data.gpaScale);
      if (data.gpa > maxGpa) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `GPA cannot exceed ${maxGpa} on a ${data.gpaScale} scale`,
          path: ["gpa"],
        });
      }
    }

    // Rule: budgetMax must be >= budgetMin
    if (
      data.budgetMin !== undefined &&
      data.budgetMax !== undefined &&
      data.budgetMax < data.budgetMin
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message:
          "Maximum budget must be greater than or equal to minimum budget",
        path: ["budgetMax"],
      });
    }

    // Rule: If budgetMin is provided, budgetMax should also be provided
    if (data.budgetMin !== undefined && data.budgetMax === undefined) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Maximum budget is required when setting minimum budget",
        path: ["budgetMax"],
      });
    }

    // Rule: If budgetMax is provided, budgetMin should also be provided
    if (data.budgetMax !== undefined && data.budgetMin === undefined) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Minimum budget is required when setting maximum budget",
        path: ["budgetMin"],
      });
    }
  });

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
