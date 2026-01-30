"use client";

import { useState } from "react";
import { BudgetStepData, budgetStepSchema } from "@/libs/validators/onboarding";
import { saveBudgetStep } from "../../actions";
import { toast } from "sonner";

interface BudgetStepProps {
  data: Partial<BudgetStepData>;
  setData: (data: Partial<BudgetStepData>) => void;
  isSubmitting: boolean;
  setIsSubmitting: (value: boolean) => void;
  onNext: () => void;
}

const FUNDING_PLANS = [
  {
    value: "SELF_FUNDED",
    label: "Self-Funded",
    description: "Paying from personal/family savings",
    icon: "💰",
  },
  {
    value: "SCHOLARSHIP",
    label: "Scholarship-Dependent",
    description: "Need scholarship to afford education",
    icon: "🎓",
  },
  {
    value: "LOAN",
    label: "Loan-Dependent",
    description: "Planning to take education loan",
    icon: "🏦",
  },
];

export default function BudgetStep({
  data,
  setData,
  isSubmitting,
  setIsSubmitting,
  onNext,
}: BudgetStepProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setIsSubmitting(true);

    try {
      const validated = budgetStepSchema.parse(data);
      await saveBudgetStep(validated);
      toast.success("Budget details saved!");
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
          Budget Planning
        </h2>
        <p className="text-gray-600">
          Help us understand your financial capacity for studying abroad
        </p>
      </div>

      {/* Budget Range */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm font-medium text-blue-900 mb-2">
          💡 Budget is in INR (Indian Rupees) per year
        </p>
        <p className="text-xs text-blue-700">
          This includes tuition fees, living expenses, and other costs
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Minimum Budget */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Minimum Budget (₹/year) <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            placeholder="e.g., 500000"
            min="0"
            step="10000"
            value={data.budgetMin || ""}
            onChange={(e) =>
              setData({
                ...data,
                budgetMin: parseInt(e.target.value) || undefined,
              })
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
          {errors.budgetMin && (
            <p className="mt-1 text-sm text-red-600">{errors.budgetMin}</p>
          )}
        </div>

        {/* Maximum Budget */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Maximum Budget (₹/year) <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            placeholder="e.g., 2000000"
            min="0"
            step="10000"
            value={data.budgetMax || ""}
            onChange={(e) =>
              setData({
                ...data,
                budgetMax: parseInt(e.target.value) || undefined,
              })
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
          {errors.budgetMax && (
            <p className="mt-1 text-sm text-red-600">{errors.budgetMax}</p>
          )}
        </div>
      </div>

      {/* Display Budget Range */}
      {data.budgetMin && data.budgetMax && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <p className="text-sm font-medium text-gray-700">
            Your Budget Range:
          </p>
          <p className="text-2xl font-bold text-gray-900 mt-1">
            ₹{data.budgetMin.toLocaleString("en-IN")} - ₹
            {data.budgetMax.toLocaleString("en-IN")}
          </p>
          <p className="text-xs text-gray-500 mt-1">per year</p>
        </div>
      )}

      {/* Funding Plan */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          How do you plan to fund your education?{" "}
          <span className="text-red-500">*</span>
        </label>
        <div className="space-y-3">
          {FUNDING_PLANS.map((plan) => {
            const isSelected = data.fundingPlan === plan.value;
            return (
              <button
                key={plan.value}
                type="button"
                onClick={() =>
                  setData({ ...data, fundingPlan: plan.value as any })
                }
                className={`w-full text-left px-4 py-4 border rounded-lg transition-colors ${
                  isSelected
                    ? "bg-blue-50 border-blue-500 ring-2 ring-blue-500"
                    : "bg-white border-gray-300 hover:border-blue-300"
                }`}
              >
                <div className="flex items-start gap-3">
                  <span className="text-2xl">{plan.icon}</span>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{plan.label}</p>
                    <p className="text-sm text-gray-600 mt-1">
                      {plan.description}
                    </p>
                  </div>
                  {isSelected && (
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm">✓</span>
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
        {errors.fundingPlan && (
          <p className="mt-1 text-sm text-red-600">{errors.fundingPlan}</p>
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
