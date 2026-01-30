import { z } from "zod";

export const gpaScaleEnum = z.enum(["4.0", "10.0", "100"]);
export const fundingPlanEnum = z.enum(["SELF_FUNDED", "SCHOLARSHIP", "LOAN"]);
export const testStatusEnum = z.enum(["NOT_STARTED", "IN_PROGRESS", "COMPLETED"]);

export const academicStepSchema = z.object({
  educationLevel: z.string().min(1, "Education level is required"),
  degree: z.string().min(1, "Degree is required"),
  major: z.string().min(1, "Major is required"),
  graduationYear: z.number().min(2000).max(2030),
  gpa: z.number().min(0),
  gpaScale: gpaScaleEnum,
});

export const targetProgramStepSchema = z.object({
  targetDegree: z.string().min(1, "Target degree is required"),
  fieldOfStudy: z.string().min(1, "Field of study is required"),
  targetIntake: z.string().min(1, "Target intake is required"),
});

export const preferencesStepSchema = z.object({
  preferredCountries: z.array(z.string()).min(1, "Select at least one country"),
  budgetMin: z.number().min(0),
  budgetMax: z.number().min(0),
  fundingPlan: fundingPlanEnum,
}).refine((data) => data.budgetMax >= data.budgetMin, {
  message: "Maximum budget must be greater than minimum",
  path: ["budgetMax"],
});

export const testPrepStepSchema = z.object({
  ieltsStatus: testStatusEnum,
  greStatus: testStatusEnum,
  sopStatus: testStatusEnum,
});

export const onboardingSchema = academicStepSchema
  .merge(targetProgramStepSchema)
  .merge(preferencesStepSchema)
  .merge(testPrepStepSchema);

export type OnboardingFormData = z.infer<typeof onboardingSchema>;