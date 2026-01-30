"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Profile } from "@/app/generated/prisma/client";
import StepIndicator from "./StepIndicator";
import AcademicStep from "./steps/AcademicStep";
import StudyGoalStep from "./steps/StudyGoalStep";
import BudgetStep from "./steps/BudgetStep";
import ExamsStep from "./steps/ExamsStep";
import NavigationButtons from "./NavigationButtons";
import {
  AcademicStepData,
  StudyGoalStepData,
  BudgetStepData,
  ExamsStepData,
} from "@/libs/validators/onboarding";

interface OnboardingContainerProps {
  existingProfile: Profile | null;
}

export default function OnboardingContainer({
  existingProfile,
}: OnboardingContainerProps) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form data state
  const [academicData, setAcademicData] = useState<Partial<AcademicStepData>>(
    existingProfile
      ? {
          educationLevel: existingProfile.educationLevel,
          degree: existingProfile.degree || undefined,
          major: existingProfile.major || undefined,
          graduationYear: existingProfile.graduationYear || undefined,
          gpa: existingProfile.gpa || undefined,
        }
      : {},
  );

  const [studyGoalData, setStudyGoalData] = useState<
    Partial<StudyGoalStepData>
  >(
    existingProfile
      ? {
          targetDegree: existingProfile.targetDegree || undefined,
          fieldOfStudy: existingProfile.fieldOfStudy || undefined,
          targetIntake: existingProfile.targetIntake || undefined,
          preferredCountries: existingProfile.preferredCountries || [],
        }
      : { preferredCountries: [] },
  );

  const [budgetData, setBudgetData] = useState<Partial<BudgetStepData>>(
    existingProfile
      ? {
          budgetMin: existingProfile.budgetMin || undefined,
          budgetMax: existingProfile.budgetMax || undefined,
          fundingPlan: existingProfile.fundingPlan || undefined,
        }
      : {},
  );

  const [examsData, setExamsData] = useState<ExamsStepData>({
    ieltsStatus: existingProfile?.ieltsStatus || "NOT_STARTED",
    greStatus: existingProfile?.greStatus || "NOT_STARTED",
    sopStatus: existingProfile?.sopStatus || "NOT_STARTED",
  });

  const totalSteps = 4;

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    router.push("/dashboard");
    router.refresh();
  };
  
  return (
    <div className="bg-white rounded-lg shadow-lg p-8">
      {/* Navigation */}
      <NavigationButtons
        currentStep={currentStep}
        totalSteps={totalSteps}
        onBack={handleBack}
        isSubmitting={isSubmitting}
      />

      {/* Step Indicator */}
      <StepIndicator currentStep={currentStep} totalSteps={totalSteps} />

      {/* Step Content */}
      <div className="mt-8 mb-8">
        {currentStep === 1 && (
          <AcademicStep
            data={academicData}
            setData={setAcademicData}
            isSubmitting={isSubmitting}
            setIsSubmitting={setIsSubmitting}
            onNext={handleNext}
          />
        )}
        {currentStep === 2 && (
          <StudyGoalStep
            data={studyGoalData}
            setData={setStudyGoalData}
            isSubmitting={isSubmitting}
            setIsSubmitting={setIsSubmitting}
            onNext={handleNext}
          />
        )}
        {currentStep === 3 && (
          <BudgetStep
            data={budgetData}
            setData={setBudgetData}
            isSubmitting={isSubmitting}
            setIsSubmitting={setIsSubmitting}
            onNext={handleNext}
          />
        )}
        {currentStep === 4 && (
          <ExamsStep
            data={examsData}
            setData={setExamsData}
            isSubmitting={isSubmitting}
            setIsSubmitting={setIsSubmitting}
            onComplete={handleComplete}
          />
        )}
      </div>

    </div>
  );
}
