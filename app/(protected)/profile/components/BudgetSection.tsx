import { BaseProps } from "../types";

export default function BudgetSection({ profile, errors }: BaseProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Budget</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Minimum Budget */}
        <div>
          <label
            htmlFor="budgetMin"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Minimum Budget (USD/year)
          </label>
          <input
            type="number"
            id="budgetMin"
            name="budgetMin"
            defaultValue={profile.budgetMin || ""}
            placeholder="e.g., 10000"
            min="0"
            step="1000"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {errors.budgetMin && (
            <p className="mt-1 text-sm text-red-600">{errors.budgetMin[0]}</p>
          )}
        </div>

        {/* Maximum Budget */}
        <div>
          <label
            htmlFor="budgetMax"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Maximum Budget (USD/year)
          </label>
          <input
            type="number"
            id="budgetMax"
            name="budgetMax"
            defaultValue={profile.budgetMax || ""}
            placeholder="e.g., 50000"
            min="0"
            step="1000"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {errors.budgetMax && (
            <p className="mt-1 text-sm text-red-600">{errors.budgetMax[0]}</p>
          )}
        </div>

        {/* Funding Plan */}
        <div className="md:col-span-2">
          <label
            htmlFor="fundingPlan"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Funding Plan
          </label>
          <select
            id="fundingPlan"
            name="fundingPlan"
            defaultValue={profile.fundingPlan || ""}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select funding plan</option>
            <option value="SELF_FUNDED">Self-Funded</option>
            <option value="SCHOLARSHIP">Scholarship</option>
            <option value="LOAN">Education Loan</option>
          </select>
          {errors.fundingPlan && (
            <p className="mt-1 text-sm text-red-600">{errors.fundingPlan[0]}</p>
          )}
        </div>
      </div>

      {/* Budget Range Display */}
      {profile.budgetMin !== null && profile.budgetMax !== null && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600">
            Current budget range:{" "}
            <span className="font-semibold text-gray-900">
              ${profile.budgetMin.toLocaleString()} - $
              {profile.budgetMax.toLocaleString()}
            </span>{" "}
            per year
          </p>
        </div>
      )}
    </div>
  );
}
