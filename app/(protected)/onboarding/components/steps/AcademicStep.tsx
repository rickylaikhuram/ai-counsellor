"use client";

import { useState } from "react";
import {
  AcademicStepData,
  academicStepSchema,
} from "@/libs/validators/onboarding";
import { saveAcademicStep } from "../../actions";
import { toast } from "sonner";

interface AcademicStepProps {
  data: Partial<AcademicStepData>;
  setData: (data: Partial<AcademicStepData>) => void;
  isSubmitting: boolean;
  setIsSubmitting: (value: boolean) => void;
  onNext: () => void;
}

const EDUCATION_LEVELS = [
  "High School",
  "Diploma",
  "Bachelor's Degree",
  "Master's Degree",
  "PhD",
];

export default function AcademicStep({
  data,
  setData,
  isSubmitting,
  setIsSubmitting,
  onNext,
}: AcademicStepProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setIsSubmitting(true);

    try {
      const validated = academicStepSchema.parse(data);
      await saveAcademicStep(validated);
      toast.success("Academic details saved!");
      onNext();
    } catch (error: any) {
      if (error.errors) {
        const formattedErrors: Record<string, string> = {};
        error.errors.forEach((err: any) => {
          formattedErrors[err.path[0]] = err.message;
        });
        setErrors(formattedErrors);
        toast.error("Please fix the errors");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Academic Background
        </h2>
        <p className="text-gray-600">
          Tell us about your current education level and academic performance
        </p>
      </div>

      {/* Education Level */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Current Education Level <span className="text-red-500">*</span>
        </label>
        <select
          value={data.educationLevel || ""}
          onChange={(e) => setData({ ...data, educationLevel: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required
        >
          <option value="">Select education level</option>
          {EDUCATION_LEVELS.map((level) => (
            <option key={level} value={level}>
              {level}
            </option>
          ))}
        </select>
        {errors.educationLevel && (
          <p className="mt-1 text-sm text-red-600">{errors.educationLevel}</p>
        )}
      </div>

      {/* Degree */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Degree/Qualification (Optional)
        </label>
        <input
          type="text"
          placeholder="e.g., B.Tech, B.Sc, MBA"
          value={data.degree || ""}
          onChange={(e) => setData({ ...data, degree: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <p className="mt-1 text-xs text-gray-500">
          The specific degree or qualification you're pursuing/completed
        </p>
      </div>

      {/* Major */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Major/Specialization (Optional)
        </label>
        <input
          type="text"
          placeholder="e.g., Computer Science, Mechanical Engineering"
          value={data.major || ""}
          onChange={(e) => setData({ ...data, major: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Graduation Year */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Graduation Year (Optional)
        </label>
        <input
          type="number"
          placeholder="e.g., 2024"
          min="1990"
          max="2030"
          value={data.graduationYear || ""}
          onChange={(e) =>
            setData({
              ...data,
              graduationYear: parseInt(e.target.value) || undefined,
            })
          }
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* GPA */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          GPA/Percentage (Optional)
        </label>
        <input
          type="number"
          placeholder="e.g., 3.8 (GPA) or 85 (percentage)"
          step="0.01"
          min="0"
          max="10"
          value={data.gpa || ""}
          onChange={(e) =>
            setData({ ...data, gpa: parseFloat(e.target.value) || undefined })
          }
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <p className="mt-1 text-xs text-gray-500">
          Enter GPA (0-4 or 0-10 scale) or percentage (out of 100)
        </p>
        {errors.gpa && (
          <p className="mt-1 text-sm text-red-600">{errors.gpa}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isSubmitting ? "Saving..." : "Save & Continue"}
      </button>
    </form>
  );
}
