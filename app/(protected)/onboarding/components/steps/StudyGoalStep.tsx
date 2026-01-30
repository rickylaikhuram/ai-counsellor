"use client";

import { useState } from "react";
import {
  StudyGoalStepData,
  studyGoalStepSchema,
} from "@/libs/validators/onboarding";
import { saveStudyGoalStep } from "../../actions";
import { toast } from "sonner";

interface StudyGoalStepProps {
  data: Partial<StudyGoalStepData>;
  setData: (data: Partial<StudyGoalStepData>) => void;
  isSubmitting: boolean;
  setIsSubmitting: (value: boolean) => void;
  onNext: () => void;
}

const TARGET_DEGREES = ["Bachelor's", "Master's", "MBA", "PhD"];

const FIELDS_OF_STUDY = [
  "Computer Science",
  "Engineering",
  "Business & Management",
  "Medicine & Health Sciences",
  "Natural Sciences",
  "Social Sciences",
  "Arts & Humanities",
  "Law",
  "Architecture",
  "Other",
];

const INTAKES = [
  "Fall 2025",
  "Spring 2026",
  "Fall 2026",
  "Spring 2027",
  "Fall 2027",
];

const COUNTRIES = [
  "USA",
  "UK",
  "Canada",
  "Australia",
  "Germany",
  "Netherlands",
  "Ireland",
  "New Zealand",
  "Singapore",
  "France",
];

export default function StudyGoalStep({
  data,
  setData,
  isSubmitting,
  setIsSubmitting,
  onNext,
}: StudyGoalStepProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleCountryToggle = (country: string) => {
    const currentCountries = data.preferredCountries || [];
    if (currentCountries.includes(country)) {
      setData({
        ...data,
        preferredCountries: currentCountries.filter((c) => c !== country),
      });
    } else {
      setData({
        ...data,
        preferredCountries: [...currentCountries, country],
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setIsSubmitting(true);

    try {
      const validated = studyGoalStepSchema.parse(data);
      await saveStudyGoalStep(validated);
      toast.success("Study goals saved!");
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
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Study Goals</h2>
        <p className="text-gray-600">
          What do you want to study and where do you want to go?
        </p>
      </div>

      {/* Target Degree */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Target Degree <span className="text-red-500">*</span>
        </label>
        <select
          value={data.targetDegree || ""}
          onChange={(e) => setData({ ...data, targetDegree: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required
        >
          <option value="">Select target degree</option>
          {TARGET_DEGREES.map((degree) => (
            <option key={degree} value={degree}>
              {degree}
            </option>
          ))}
        </select>
        {errors.targetDegree && (
          <p className="mt-1 text-sm text-red-600">{errors.targetDegree}</p>
        )}
      </div>

      {/* Field of Study */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Field of Study <span className="text-red-500">*</span>
        </label>
        <select
          value={data.fieldOfStudy || ""}
          onChange={(e) => setData({ ...data, fieldOfStudy: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required
        >
          <option value="">Select field of study</option>
          {FIELDS_OF_STUDY.map((field) => (
            <option key={field} value={field}>
              {field}
            </option>
          ))}
        </select>
        {errors.fieldOfStudy && (
          <p className="mt-1 text-sm text-red-600">{errors.fieldOfStudy}</p>
        )}
      </div>

      {/* Target Intake */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Target Intake <span className="text-red-500">*</span>
        </label>
        <select
          value={data.targetIntake || ""}
          onChange={(e) => setData({ ...data, targetIntake: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required
        >
          <option value="">Select target intake</option>
          {INTAKES.map((intake) => (
            <option key={intake} value={intake}>
              {intake}
            </option>
          ))}
        </select>
        {errors.targetIntake && (
          <p className="mt-1 text-sm text-red-600">{errors.targetIntake}</p>
        )}
      </div>

      {/* Preferred Countries */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Preferred Countries <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {COUNTRIES.map((country) => {
            const isSelected = data.preferredCountries?.includes(country);
            return (
              <button
                key={country}
                type="button"
                onClick={() => handleCountryToggle(country)}
                className={`px-4 py-3 border rounded-lg font-medium transition-colors ${
                  isSelected
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white text-gray-700 border-gray-300 hover:border-blue-500"
                }`}
              >
                {country}
              </button>
            );
          })}
        </div>
        <p className="mt-2 text-xs text-gray-500">
          Selected: {data.preferredCountries?.length || 0} countries
        </p>
        {errors.preferredCountries && (
          <p className="mt-1 text-sm text-red-600">
            {errors.preferredCountries}
          </p>
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
