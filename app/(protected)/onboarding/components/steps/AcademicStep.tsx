"use client";

import { useFormContext } from "react-hook-form";
import { OnboardingFormData } from "../../lib/schemas";
import { StepComponentProps } from "../../types/onboarding";

export default function AcademicStep({
  onNext,
  onBack,
  isFirstStep,
}: StepComponentProps) {
  const {
    register,
    formState: { errors },
  } = useFormContext<OnboardingFormData>();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">
          Academic Background
        </h2>
        <p className="text-gray-600 mt-2">Tell us about your education</p>
      </div>

      <div className="space-y-4">
        <div>
          <label
            htmlFor="educationLevel"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Education Level
          </label>
          <select
            id="educationLevel"
            {...register("educationLevel")}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select education level</option>
            <option value="High School">High School</option>
            <option value="Bachelor's">Bachelor's</option>
            <option value="Master's">Master's</option>
            <option value="PhD">PhD</option>
          </select>
          {errors.educationLevel && (
            <p className="text-red-600 text-sm mt-1">
              {errors.educationLevel.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="degree"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Degree
          </label>
          <input
            id="degree"
            type="text"
            {...register("degree")}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="e.g., B.Tech, B.Sc, MBA"
          />
          {errors.degree && (
            <p className="text-red-600 text-sm mt-1">{errors.degree.message}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="major"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Major / Specialization
          </label>
          <input
            id="major"
            type="text"
            {...register("major")}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="e.g., Computer Science, Mechanical Engineering"
          />
          {errors.major && (
            <p className="text-red-600 text-sm mt-1">{errors.major.message}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="graduationYear"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Graduation Year
          </label>
          <input
            id="graduationYear"
            type="number"
            {...register("graduationYear", { valueAsNumber: true })}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="2024"
          />
          {errors.graduationYear && (
            <p className="text-red-600 text-sm mt-1">
              {errors.graduationYear.message}
            </p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="gpa"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              GPA
            </label>
            <input
              id="gpa"
              type="number"
              step="0.01"
              {...register("gpa", { valueAsNumber: true })}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="3.5"
            />
            {errors.gpa && (
              <p className="text-red-600 text-sm mt-1">{errors.gpa.message}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="gpaScale"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              GPA Scale
            </label>
            <select
              id="gpaScale"
              {...register("gpaScale")}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="4.0">4.0</option>
              <option value="5.0">5.0</option>
              <option value="10.0">10.0</option>
              <option value="100">100</option>
            </select>
            {errors.gpaScale && (
              <p className="text-red-600 text-sm mt-1">
                {errors.gpaScale.message}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-between pt-6">
        <button
          type="button"
          onClick={onBack}
          disabled={isFirstStep}
          className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
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
