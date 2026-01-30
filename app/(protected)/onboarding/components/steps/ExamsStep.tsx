"use client";

import { useState } from "react";
import { ExamsStepData, examsStepSchema } from "@/libs/validators/onboarding";
import { completeOnboarding } from "../../actions";
import { toast } from "sonner";

interface ExamsStepProps {
  data: ExamsStepData;
  setData: (data: ExamsStepData) => void;
  isSubmitting: boolean;
  setIsSubmitting: (value: boolean) => void;
  onComplete: () => void;
}

const EXAM_STATUSES = [
  { value: "NOT_STARTED", label: "Not Started", color: "gray" },
  { value: "IN_PROGRESS", label: "In Progress", color: "yellow" },
  { value: "COMPLETED", label: "Completed", color: "green" },
];

export default function ExamsStep({
  data,
  setData,
  isSubmitting,
  setIsSubmitting,
  onComplete,
}: ExamsStepProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setIsSubmitting(true);

    try {
      const validated = examsStepSchema.parse(data);
      await completeOnboarding(validated);
      toast.success("🎉 Profile completed! Redirecting to dashboard...");
      setTimeout(() => {
        onComplete();
      }, 1500);
    } catch (error: any) {
      if (error.errors) {
        const formattedErrors: Record<string, string> = {};
        error.errors.forEach((err: any) => {
          formattedErrors[err.path[0]] = err.message;
        });
        setErrors(formattedErrors);
        toast.error("Please fix the errors");
      }
      setIsSubmitting(false);
    }
  };

  const renderStatusSelector = (
    label: string,
    field: keyof ExamsStepData,
    description: string,
  ) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <p className="text-xs text-gray-600 mb-3">{description}</p>
      <div className="grid grid-cols-3 gap-3">
        {EXAM_STATUSES.map((status) => {
          const isSelected = data[field] === status.value;
          return (
            <button
              key={status.value}
              type="button"
              onClick={() => setData({ ...data, [field]: status.value })}
              className={`px-4 py-3 border rounded-lg font-medium transition-colors ${
                isSelected
                  ? status.color === "green"
                    ? "bg-green-600 text-white border-green-600"
                    : status.color === "yellow"
                      ? "bg-yellow-500 text-white border-yellow-500"
                      : "bg-gray-600 text-white border-gray-600"
                  : "bg-white text-gray-700 border-gray-300 hover:border-blue-500"
              }`}
            >
              {status.label}
            </button>
          );
        })}
      </div>
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Exams & Readiness
        </h2>
        <p className="text-gray-600">
          Let us know your progress on required tests and application materials
        </p>
      </div>

      {/* IELTS/TOEFL Status */}
      {renderStatusSelector(
        "English Proficiency Test (IELTS/TOEFL)",
        "ieltsStatus",
        "Required for most international universities",
      )}

      {/* GRE/GMAT Status */}
      {renderStatusSelector(
        "Standardized Test (GRE/GMAT)",
        "greStatus",
        "Required for many graduate programs",
      )}

      {/* SOP Status */}
      {renderStatusSelector(
        "Statement of Purpose (SOP)",
        "sopStatus",
        "Essential document explaining your goals and motivation",
      )}
      {/* Info Box */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <p className="text-sm font-medium text-green-900 mb-1">
          🎯 Don't worry if you haven't started yet!
        </p>
        <p className="text-xs text-green-700">
          Our AI counsellor will help you create a personalized plan and guide
          you through each step of the preparation process.
        </p>
      </div>
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
      >
        {isSubmitting ? (
          <>
            <svg
              className="animate-spin h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Completing Profile...
          </>
        ) : (
          <>✨ Complete Onboarding</>
        )}
      </button>
    </form>
  );
}
