import { BaseProps } from "../types";

export default function ReadinessSection({
  profile,
  errors,
}: BaseProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">
        Test & Document Readiness
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* IELTS Status */}
        <div>
          <label
            htmlFor="ieltsStatus"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            IELTS Status
          </label>
          <select
            id="ieltsStatus"
            name="ieltsStatus"
            defaultValue={profile.ieltsStatus || ""}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select status</option>
            <option value="NOT_STARTED">Not Started</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="COMPLETED">Completed</option>
          </select>
          {errors.ieltsStatus && (
            <p className="mt-1 text-sm text-red-600">{errors.ieltsStatus[0]}</p>
          )}
        </div>

        {/* GRE Status */}
        <div>
          <label
            htmlFor="greStatus"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            GRE Status
          </label>
          <select
            id="greStatus"
            name="greStatus"
            defaultValue={profile.greStatus || ""}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select status</option>
            <option value="NOT_STARTED">Not Started</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="COMPLETED">Completed</option>
          </select>
          {errors.greStatus && (
            <p className="mt-1 text-sm text-red-600">{errors.greStatus[0]}</p>
          )}
        </div>

        {/* SOP Status */}
        <div>
          <label
            htmlFor="sopStatus"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            SOP Status
          </label>
          <select
            id="sopStatus"
            name="sopStatus"
            defaultValue={profile.sopStatus || ""}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select status</option>
            <option value="NOT_STARTED">Not Started</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="COMPLETED">Completed</option>
          </select>
          {errors.sopStatus && (
            <p className="mt-1 text-sm text-red-600">{errors.sopStatus[0]}</p>
          )}
        </div>
      </div>

      {/* Readiness Summary */}
      <div className="mt-4 p-4 bg-gray-50 rounded-lg">
        <p className="text-sm text-gray-600 mb-2 font-medium">
          Current Readiness:
        </p>
        <div className="flex gap-4 text-sm">
          <span className="text-gray-700">
            IELTS:{" "}
            <span
              className={`font-semibold ${
                profile.ieltsStatus === "COMPLETED"
                  ? "text-green-600"
                  : profile.ieltsStatus === "IN_PROGRESS"
                    ? "text-yellow-600"
                    : "text-gray-500"
              }`}
            >
              {profile.ieltsStatus?.replace("_", " ") || "Not Set"}
            </span>
          </span>
          <span className="text-gray-700">
            GRE:{" "}
            <span
              className={`font-semibold ${
                profile.greStatus === "COMPLETED"
                  ? "text-green-600"
                  : profile.greStatus === "IN_PROGRESS"
                    ? "text-yellow-600"
                    : "text-gray-500"
              }`}
            >
              {profile.greStatus?.replace("_", " ") || "Not Set"}
            </span>
          </span>
          <span className="text-gray-700">
            SOP:{" "}
            <span
              className={`font-semibold ${
                profile.sopStatus === "COMPLETED"
                  ? "text-green-600"
                  : profile.sopStatus === "IN_PROGRESS"
                    ? "text-yellow-600"
                    : "text-gray-500"
              }`}
            >
              {profile.sopStatus?.replace("_", " ") || "Not Set"}
            </span>
          </span>
        </div>
      </div>
    </div>
  );
}
