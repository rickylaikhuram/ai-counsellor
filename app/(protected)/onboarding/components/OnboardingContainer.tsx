"use client";

import { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { onboardingSchema, type OnboardingFormData } from "../lib/schemas";
import { saveProfile } from "../actions/profile";
import AcademicStep from "./steps/AcademicStep";
import TargetProgramStep from "./steps/TargetProgramStep";
import PreferencesStep from "./steps/PreferencesStep";
import TestPrepStep from "./steps/TestPrepStep";
import StepIndicator from "./ui/StepIndicator";

interface OnboardingContainerProps {
  userId: string;
}

export default function OnboardingContainer({
  userId,
}: OnboardingContainerProps) {
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const methods = useForm<OnboardingFormData>({
    resolver: zodResolver(onboardingSchema),
    mode: "onBlur",
    defaultValues: {
      educationLevel: "",
      degree: "",
      major: "",
      graduationYear: new Date().getFullYear(),
      gpa: 0,
      gpaScale: "4.0",
      targetDegree: "",
      fieldOfStudy: "",
      targetIntake: "",
      preferredCountries: [],
      budgetMin: 0,
      budgetMax: 0,
      fundingPlan: "SELF_FUNDED",
      ieltsStatus: "NOT_STARTED",
      greStatus: "NOT_STARTED",
      sopStatus: "NOT_STARTED",
    },
  });

  const handleNext = async () => {
    let fieldsToValidate: (keyof OnboardingFormData)[] = [];

    switch (currentStep) {
      case 1:
        fieldsToValidate = [
          "educationLevel",
          "degree",
          "major",
          "graduationYear",
          "gpa",
          "gpaScale",
        ];
        break;
      case 2:
        fieldsToValidate = ["targetDegree", "fieldOfStudy", "targetIntake"];
        break;
      case 3:
        fieldsToValidate = [
          "preferredCountries",
          "budgetMin",
          "budgetMax",
          "fundingPlan",
        ];
        break;
      case 4:
        fieldsToValidate = ["ieltsStatus", "greStatus", "sopStatus"];
        break;
    }

    const isValid = await methods.trigger(fieldsToValidate);

    if (isValid) {
      if (currentStep < 4) {
        setCurrentStep((prev) => (prev + 1) as 1 | 2 | 3 | 4);
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => (prev - 1) as 1 | 2 | 3 | 4);
    }
  };

  const onSubmit = async (data: OnboardingFormData) => {
    setIsSubmitting(true);
    try {
      const result = await saveProfile(userId, data);
      if (result.success) {
        router.push("/dashboard");
      } else {
        alert("Failed to save profile. Please try again.");
      }
    } catch (error) {
      console.error(error);
      alert("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const stepProps = {
    onNext: handleNext,
    onBack: handleBack,
    isFirstStep: currentStep === 1,
    isLastStep: currentStep === 4,
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <StepIndicator currentStep={currentStep} totalSteps={4} />

        <div className="bg-white rounded-lg shadow-md p-8 mt-8">
          <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(onSubmit)}>
              {currentStep === 1 && <AcademicStep {...stepProps} />}
              {currentStep === 2 && <TargetProgramStep {...stepProps} />}
              {currentStep === 3 && <PreferencesStep {...stepProps} />}
              {currentStep === 4 && (
                <TestPrepStep {...stepProps} isSubmitting={isSubmitting} />
              )}
            </form>
          </FormProvider>
        </div>
      </div>
    </div>
  );
}
