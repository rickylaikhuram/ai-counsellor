"use client";

import { useState } from "react";
import { LockedShortlistProps } from "../types/props";

const categoryColors = {
  DREAM: "bg-purple-100 text-purple-800 border-purple-200",
  TARGET: "bg-blue-100 text-blue-800 border-blue-200",
  SAFE: "bg-green-100 text-green-800 border-green-200",
};

const acceptanceChanceLabels = {
  LOW: "Low",
  MEDIUM: "Medium",
  HIGH: "High",
};

const acceptanceChanceColors = {
  LOW: "text-red-600",
  MEDIUM: "text-yellow-600",
  HIGH: "text-green-600",
};

const applicationStatuses = [
  "Not Applied",
  "In Progress",
  "Submitted",
  "Under Review",
  "Accepted",
  "Rejected",
  "Waitlisted",
];

const statusColors: Record<string, string> = {
  "Not Applied": "bg-gray-100 text-gray-800",
  "In Progress": "bg-blue-100 text-blue-800",
  Submitted: "bg-indigo-100 text-indigo-800",
  "Under Review": "bg-yellow-100 text-yellow-800",
  Accepted: "bg-green-100 text-green-800",
  Rejected: "bg-red-100 text-red-800",
  Waitlisted: "bg-orange-100 text-orange-800",
};

export default function LockedShortlist({
  universities,
}: LockedShortlistProps) {
  // Mock application status with local state
  const [applicationStatus, setApplicationStatus] = useState<
    Record<string, string>
  >(
    universities.reduce(
      (acc, uni) => {
        acc[uni.id] = "Not Applied";
        return acc;
      },
      {} as Record<string, string>,
    ),
  );

  const handleStatusChange = (universityId: string, newStatus: string) => {
    setApplicationStatus((prev) => ({
      ...prev,
      [universityId]: newStatus,
    }));
  };

  if (universities.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
        <p className="text-gray-500">No universities in your shortlist yet.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {universities.map((item) => (
        <div
          key={item.id}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 hover:shadow-md transition-shadow"
        >
          {/* University Name */}
          <h3 className="font-semibold text-lg text-gray-900 mb-2">
            {item.university.name}
          </h3>

          {/* Location */}
          <p className="text-sm text-gray-600 mb-3">
            {item.university.city && `${item.university.city}, `}
            {item.university.country}
          </p>

          {/* Category Badge */}
          <div className="flex items-center gap-2 mb-3">
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                categoryColors[item.category]
              }`}
            >
              {item.category}
            </span>
            <span
              className={`text-xs font-medium ${
                acceptanceChanceColors[item.acceptanceChance]
              }`}
            >
              {acceptanceChanceLabels[item.acceptanceChance]} chance
            </span>
          </div>

          {/* Application Status Selector */}
          <div className="mt-4">
            <label
              htmlFor={`status-${item.id}`}
              className="block text-xs font-medium text-gray-700 mb-1"
            >
              Application Status
            </label>
            <select
              id={`status-${item.id}`}
              value={applicationStatus[item.id]}
              onChange={(e) => handleStatusChange(item.id, e.target.value)}
              className={`w-full px-3 py-2 text-sm rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                statusColors[applicationStatus[item.id]]
              }`}
            >
              {applicationStatuses.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>

          {/* Tuition Info */}
          <div className="mt-3 pt-3 border-t border-gray-100">
            <p className="text-xs text-gray-500">
              Annual Tuition:{" "}
              <span className="font-medium text-gray-700">
                ${item.university.tuition.toLocaleString()}
              </span>
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
