"use client";

import { useFormContext } from "react-hook-form";
import { OnboardingFormData } from "../../lib/schemas";
import { StepComponentProps } from "../../types/onboarding";

export default function TargetProgramStep({ onNext, onBack }: StepComponentProps) {
  const { register, formState: { errors } } = useFormContext<OnboardingFormData>();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Target Program</h2>
        <p className="text-gray-600 mt-2">What are you looking to study?</p>
      </div>

      <div className="space-y-4">
        <div>
          <label htmlFor="targetDegree" className="block text-sm font-medium text-gray-700 mb-1">
            Target Degree
          </label>
          <select
            id="targetDegree"
            {...register("targetDegree")}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select target degree</option>
            <option value="Bachelor's">Bachelor's</option>
            <option value="Master's">Master's</option>
            <option value="PhD">PhD</option>
          </select>
          {errors.targetDegree && (
            <p className="text-red-600 text-sm mt-1">{errors.targetDegree.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="fieldOfStudy" className="block text-sm font-medium text-gray-700 mb-1">
            Field of Study
          </label>
          <input
            id="fieldOfStudy"
            type="text"
            {...register("fieldOfStudy")}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="e.g., Computer Science, Business Analytics"
          />
          {errors.fieldOfStudy && (
            <p className="text-red-600 text-sm mt-1">{errors.fieldOfStudy.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="targetIntake" className="block text-sm font-medium text-gray-700 mb-1">
            Target Intake
          </label>
          <select
            id="targetIntake"
            {...register("targetIntake")}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select intake</option>
            <option value="Fall 2025">Fall 2025</option>
            <option value="Spring 2026">Spring 2026</option>
            <option value="Fall 2026">Fall 2026</option>
            <option value="Spring 2027">Spring 2027</option>
          </select>
          {errors.targetIntake && (
            <p className="text-red-600 text-sm mt-1">{errors.targetIntake.message}</p>
          )}
        </div>
      </div>

      <div className="flex justify-between pt-6">
        <button
          type="button"
          onClick={onBack}
          className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
        >
          Back
        </button>
        <button
          type="button"
          onClick={onNext}
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Next
        </button>
      </div>
    </div>
  );
}