"use client";

import { useState } from "react";
import { updateProfile } from "../actions";
import AcademicSection from "./AcademicSection";
import GoalsSection from "./GoalsSection";
import BudgetSection from "./BudgetSection";
import ReadinessSection from "./ReadinessSection";
import SaveBar from "./SaveBar";
import { ProfileFormProps } from "../types";


export default function ProfileForm({ profile }: ProfileFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState<{
    show: boolean;
    message: string;
    type: "success" | "error";
  }>({ show: false, message: "", type: "success" });
  const [errors, setErrors] = useState<Record<string, string[]>>({});

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    const formData = new FormData(e.currentTarget);
    const result = await updateProfile(formData);

    if (result.success) {
      setToast({
        show: true,
        message: result.message || "Profile updated successfully!",
        type: "success",
      });
      // Auto-hide success toast after 3 seconds
      setTimeout(() => {
        setToast((prev) => ({ ...prev, show: false }));
      }, 3000);
    } else {
      if (result.errors) {
        setErrors(result.errors);
      }
      setToast({
        show: true,
        message: result.message || "Failed to update profile",
        type: "error",
      });
    }

    setIsSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Toast Notification */}
      {toast.show && (
        <div
          className={`fixed top-4 right-4 z-50 px-6 py-4 rounded-lg shadow-lg ${
            toast.type === "success"
              ? "bg-green-600 text-white"
              : "bg-red-600 text-white"
          }`}
        >
          <div className="flex items-center gap-3">
            {toast.type === "success" ? (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            )}
            <span className="font-medium">{toast.message}</span>
          </div>
        </div>
      )}

      {/* Academic Section */}
      <AcademicSection profile={profile} errors={errors} />

      {/* Goals Section */}
      <GoalsSection profile={profile} errors={errors} />

      {/* Budget Section */}
      <BudgetSection profile={profile} errors={errors} />

      {/* Readiness Section */}
      <ReadinessSection profile={profile} errors={errors} />

      {/* Save Bar */}
      <SaveBar isSubmitting={isSubmitting} />
    </form>
  );
}
