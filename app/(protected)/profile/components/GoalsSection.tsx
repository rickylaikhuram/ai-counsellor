
import { COUNTRIES } from "../schema";
import { BaseProps } from "../types";


export default function GoalsSection({ profile, errors }: BaseProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Study Goals</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Target Degree */}
        <div>
          <label
            htmlFor="targetDegree"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Target Degree
          </label>
          <select
            id="targetDegree"
            name="targetDegree"
            defaultValue={profile.targetDegree || ""}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select degree</option>
            <option value="Bachelor's">Bachelor's</option>
            <option value="Master's">Master's</option>
            <option value="PhD">PhD</option>
            <option value="Diploma">Diploma</option>
            <option value="Certificate">Certificate</option>
          </select>
          {errors.targetDegree && (
            <p className="mt-1 text-sm text-red-600">
              {errors.targetDegree[0]}
            </p>
          )}
        </div>

        {/* Field of Study */}
        <div>
          <label
            htmlFor="fieldOfStudy"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Field of Study
          </label>
          <input
            type="text"
            id="fieldOfStudy"
            name="fieldOfStudy"
            defaultValue={profile.fieldOfStudy || ""}
            placeholder="e.g., Computer Science, MBA"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {errors.fieldOfStudy && (
            <p className="mt-1 text-sm text-red-600">
              {errors.fieldOfStudy[0]}
            </p>
          )}
        </div>

        {/* Target Intake */}
        <div>
          <label
            htmlFor="targetIntake"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Target Intake
          </label>
          <select
            id="targetIntake"
            name="targetIntake"
            defaultValue={profile.targetIntake || ""}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select intake</option>
            <option value="Fall 2024">Fall 2024</option>
            <option value="Spring 2025">Spring 2025</option>
            <option value="Fall 2025">Fall 2025</option>
            <option value="Spring 2026">Spring 2026</option>
            <option value="Fall 2026">Fall 2026</option>
            <option value="Spring 2027">Spring 2027</option>
          </select>
          {errors.targetIntake && (
            <p className="mt-1 text-sm text-red-600">
              {errors.targetIntake[0]}
            </p>
          )}
        </div>

        {/* Preferred Countries - Full Width */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Preferred Countries
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 max-h-60 overflow-y-auto border border-gray-300 rounded-lg p-4">
            {COUNTRIES.map((country) => (
              <label
                key={country}
                className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-2 rounded"
              >
                <input
                  type="checkbox"
                  name="preferredCountries"
                  value={country}
                  defaultChecked={profile.preferredCountries?.includes(country)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">{country}</span>
              </label>
            ))}
          </div>
          {errors.preferredCountries && (
            <p className="mt-1 text-sm text-red-600">
              {errors.preferredCountries[0]}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
