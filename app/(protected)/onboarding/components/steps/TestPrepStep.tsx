"use client";

import { useFormContext } from "react-hook-form";
import { OnboardingFormData } from "../../lib/schemas";
import { StepComponentProps } from "../../types/onboarding";

interface TestPrepStepProps extends StepComponentProps {
  isSubmitting: boolean;
}

export default function TestPrepStep({
  onBack,
  isSubmitting,
}: TestPrepStepProps) {
  const {
    register,
    formState: { errors },
  } = useFormContext<OnboardingFormData>();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Test Preparation</h2>
        <p className="text-gray-600 mt-2">What's your test prep status?</p>
      </div>

      <div className="space-y-4">
        <div>
          <label
            htmlFor="ieltsStatus"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            IELTS Status
          </label>
          <select
            id="ieltsStatus"
            {...register("ieltsStatus")}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="NOT_STARTED">Not Started</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="COMPLETED">Completed</option>
          </select>
          {errors.ieltsStatus && (
            <p className="text-red-600 text-sm mt-1">
              {errors.ieltsStatus.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="greStatus"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            GRE Status
          </label>
          <select
            id="greStatus"
            {...register("greStatus")}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="NOT_STARTED">Not Started</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="COMPLETED">Completed</option>
          </select>
          {errors.greStatus && (
            <p className="text-red-600 text-sm mt-1">
              {errors.greStatus.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="sopStatus"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            SOP Status
          </label>
          <select
            id="sopStatus"
            {...register("sopStatus")}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="NOT_STARTED">Not Started</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="COMPLETED">Completed</option>
          </select>
          {errors.sopStatus && (
            <p className="text-red-600 text-sm mt-1">
              {errors.sopStatus.message}
            </p>
          )}
        </div>
      </div>

      <div className="flex justify-between pt-6">
        <button
          type="button"
          onClick={onBack}
          disabled={isSubmitting}
          className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50"
        >
          Back
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Submitting..." : "Complete Onboarding"}
        </button>
      </div>
    </div>
  );
}
