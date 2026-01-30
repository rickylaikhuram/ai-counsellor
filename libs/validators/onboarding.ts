import { z } from "zod";

export const academicStepSchema = z.object({
  educationLevel: z.string().min(1, "Education level is required"),
  degree: z.string().optional(),
  major: z.string().optional(),
  graduationYear: z.number().optional(),
  gpa: z.number().min(0).max(10).optional(),
});

export const studyGoalStepSchema = z.object({
  targetDegree: z.string().min(1, "Target degree is required"),
  fieldOfStudy: z.string().min(1, "Field of study is required"),
  targetIntake: z.string().min(1, "Target intake is required"),
  preferredCountries: z.array(z.string()).min(1, "Select at least one country"),
});

export const budgetStepSchema = z
  .object({
    budgetMin: z.number().min(0, "Minimum budget must be positive"),
    budgetMax: z.number().min(0, "Maximum budget must be positive"),
    fundingPlan: z.enum(["SELF_FUNDED", "SCHOLARSHIP", "LOAN"]),
  })
  .refine((data) => data.budgetMax >= data.budgetMin, {
    message: "Maximum budget must be greater than or equal to minimum budget",
    path: ["budgetMax"],
  });

export const examsStepSchema = z.object({
  ieltsStatus: z.enum(["NOT_STARTED", "IN_PROGRESS", "COMPLETED"]),
  greStatus: z.enum(["NOT_STARTED", "IN_PROGRESS", "COMPLETED"]),
  sopStatus: z.enum(["NOT_STARTED", "IN_PROGRESS", "COMPLETED"]),
});

export const completeOnboardingSchema = academicStepSchema
  .merge(studyGoalStepSchema)
  .merge(budgetStepSchema)
  .merge(examsStepSchema);

export type AcademicStepData = z.infer<typeof academicStepSchema>;
export type StudyGoalStepData = z.infer<typeof studyGoalStepSchema>;
export type BudgetStepData = z.infer<typeof budgetStepSchema>;
export type ExamsStepData = z.infer<typeof examsStepSchema>;
export type CompleteOnboardingData = z.infer<typeof completeOnboardingSchema>;
