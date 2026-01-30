"use client";

import { useFormContext, Controller } from "react-hook-form";
import { OnboardingFormData } from "../../lib/schemas";
import { StepComponentProps } from "../../types/onboarding";

const COUNTRIES = [
  "USA", "UK", "Canada", "Australia", "Germany", 
  "Netherlands", "France", "Singapore", "Ireland", "New Zealand"
];

export default function PreferencesStep({ onNext, onBack }: StepComponentProps) {
  const { register, control, formState: { errors } } = useFormContext<OnboardingFormData>();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Preferences</h2>
        <p className="text-gray-600 mt-2">Where would you like to study?</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Preferred Countries
          </label>
          <Controller
            name="preferredCountries"
            control={control}
            render={({ field }) => (
              <div className="grid grid-cols-2 gap-2">
                {COUNTRIES.map((country) => (
                  <label key={country} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      value={country}
                      checked={field.value.includes(country)}
                      onChange={(e) => {
                        const newValue = e.target.checked
                          ? [...field.value, country]
                          : field.value.filter((c) => c !== country);
                        field.onChange(newValue);
                      }}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">{country}</span>
                  </label>
                ))}
              </div>
            )}
          />
          {errors.preferredCountries && (
            <p className="text-red-600 text-sm mt-1">{errors.preferredCountries.message}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="budgetMin" className="block text-sm font-medium text-gray-700 mb-1">
              Min Budget (USD/year)
            </label>
            <input
              id="budgetMin"
              type="number"
              {...register("budgetMin", { valueAsNumber: true })}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="10000"
            />
            {errors.budgetMin && (
              <p className="text-red-600 text-sm mt-1">{errors.budgetMin.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="budgetMax" className="block text-sm font-medium text-gray-700 mb-1">
              Max Budget (USD/year)
            </label>
            <input
              id="budgetMax"
              type="number"
              {...register("budgetMax", { valueAsNumber: true })}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="50000"
            />
            {errors.budgetMax && (
              <p className="text-red-600 text-sm mt-1">{errors.budgetMax.message}</p>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="fundingPlan" className="block text-sm font-medium text-gray-700 mb-1">
            Funding Plan
          </label>
          <select
            id="fundingPlan"
            {...register("fundingPlan")}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="SELF_FUNDED">Self Funded</option>
            <option value="SCHOLARSHIP">Scholarship</option>
            <option value="LOAN">Education Loan</option>
          </select>
          {errors.fundingPlan && (
            <p className="text-red-600 text-sm mt-1">{errors.fundingPlan.message}</p>
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