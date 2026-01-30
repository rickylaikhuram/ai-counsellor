import { BaseProps } from "../types";

export default function AcademicSection({
  profile,
  errors,
}: BaseProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">
        Academic Background
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Education Level */}
        <div>
          <label
            htmlFor="educationLevel"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Education Level
          </label>
          <select
            id="educationLevel"
            name="educationLevel"
            defaultValue={profile.educationLevel || ""}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select level</option>
            <option value="High School">High School</option>
            <option value="Diploma Degree">Diploma Degree</option>
            <option value="Bachelor's">Bachelor's</option>
            <option value="Master's">Master's</option>
            <option value="PhD">PhD</option>
          </select>
          {errors.educationLevel && (
            <p className="mt-1 text-sm text-red-600">
              {errors.educationLevel[0]}
            </p>
          )}
        </div>

        {/* Degree */}
        <div>
          <label
            htmlFor="degree"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Current/Most Recent Degree
          </label>
          <input
            type="text"
            id="degree"
            name="degree"
            defaultValue={profile.degree || ""}
            placeholder="e.g., B.Tech, B.Sc, B.Com"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {errors.degree && (
            <p className="mt-1 text-sm text-red-600">{errors.degree[0]}</p>
          )}
        </div>

        {/* Major */}
        <div>
          <label
            htmlFor="major"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Major/Field of Study
          </label>
          <input
            type="text"
            id="major"
            name="major"
            defaultValue={profile.major || ""}
            placeholder="e.g., Computer Science, Business"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {errors.major && (
            <p className="mt-1 text-sm text-red-600">{errors.major[0]}</p>
          )}
        </div>

        {/* Graduation Year */}
        <div>
          <label
            htmlFor="graduationYear"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Graduation Year
          </label>
          <input
            type="number"
            id="graduationYear"
            name="graduationYear"
            defaultValue={profile.graduationYear || ""}
            placeholder="e.g., 2024"
            min="1950"
            max="2050"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {errors.graduationYear && (
            <p className="mt-1 text-sm text-red-600">
              {errors.graduationYear[0]}
            </p>
          )}
        </div>

        {/* GPA */}
        <div>
          <label
            htmlFor="gpa"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            GPA
          </label>
          <input
            type="number"
            id="gpa"
            name="gpa"
            step="0.01"
            defaultValue={profile.gpa || ""}
            placeholder="e.g., 3.5"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {errors.gpa && (
            <p className="mt-1 text-sm text-red-600">{errors.gpa[0]}</p>
          )}
        </div>

        {/* GPA Scale */}
        <div>
          <label
            htmlFor="gpaScale"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            GPA Scale
          </label>
          <select
            id="gpaScale"
            name="gpaScale"
            defaultValue={profile.gpaScale || ""}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select scale</option>
            <option value="4.0">4.0</option>
            <option value="5.0">5.0</option>
            <option value="10.0">10.0</option>
            <option value="100">100</option>
          </select>
          {errors.gpaScale && (
            <p className="mt-1 text-sm text-red-600">{errors.gpaScale[0]}</p>
          )}
        </div>
      </div>

      {/* Normalized GPA Display (Read-only) */}
      {profile.normalizedGpa !== null && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600">
            Normalized GPA (0-100 scale):{" "}
            <span className="font-semibold text-gray-900">
              {profile.normalizedGpa.toFixed(2)}
            </span>
          </p>
        </div>
      )}
    </div>
  );
}
