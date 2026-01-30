"use client";

import { useState } from "react";
import { UniversityCategory } from "@/app/generated/prisma/enums";
import { lockSession } from "../actions";
import { LockDecisionProps } from "../types/prisma-enums";

export default function LockDecision({
  sessionId,
  shortlisted,
}: LockDecisionProps) {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleLock() {
    setLoading(true);
    setError(null);

    const result = await lockSession(sessionId);

    if (!result.success) {
      setError(result.error || "Failed to lock decision");
      setLoading(false);
    }
    // On success, page revalidates and advances to action plan
  }

  const categoryCount = {
    DREAM: shortlisted.filter((s) => s.category === UniversityCategory.DREAM)
      .length,
    TARGET: shortlisted.filter((s) => s.category === UniversityCategory.TARGET)
      .length,
    SAFE: shortlisted.filter((s) => s.category === UniversityCategory.SAFE)
      .length,
  };

  if (!showConfirmation) {
    return (
      <div className="max-w-3xl mx-auto text-center py-12">
        <div className="mb-6 text-6xl">🔒</div>
        <h1 className="text-3xl font-bold text-gray-900 mb-3">
          Ready to Lock Your Decision?
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Once locked, your university shortlist will be finalized and we'll
          create a personalized action plan to help you apply.
        </p>

        {/* Shortlist Summary */}
        <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl p-8 mb-8">
          <h3 className="font-semibold text-gray-900 mb-4 text-lg">
            Your Shortlist Summary
          </h3>
          <div className="grid grid-cols-3 gap-6">
            <div className="bg-white rounded-lg p-4">
              <div className="text-3xl font-bold text-purple-600">
                {categoryCount.DREAM}
              </div>
              <div className="text-sm text-gray-600 mt-1">Dream Schools</div>
            </div>
            <div className="bg-white rounded-lg p-4">
              <div className="text-3xl font-bold text-blue-600">
                {categoryCount.TARGET}
              </div>
              <div className="text-sm text-gray-600 mt-1">Target Schools</div>
            </div>
            <div className="bg-white rounded-lg p-4">
              <div className="text-3xl font-bold text-green-600">
                {categoryCount.SAFE}
              </div>
              <div className="text-sm text-gray-600 mt-1">Safe Schools</div>
            </div>
          </div>
        </div>

        {/* Universities List */}
        <div className="bg-white rounded-xl border-2 border-gray-200 p-6 mb-8">
          <h4 className="font-semibold text-gray-800 mb-4 text-left">
            Universities in Your Shortlist:
          </h4>
          <div className="space-y-2 text-left">
            {shortlisted.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0"
              >
                <div>
                  <span className="font-medium text-gray-900">
                    {item.university.name}
                  </span>
                  <span className="text-gray-500 text-sm ml-2">
                    ({item.university.country})
                  </span>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    item.category === "DREAM"
                      ? "bg-purple-100 text-purple-700"
                      : item.category === "TARGET"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-green-100 text-green-700"
                  }`}
                >
                  {item.category}
                </span>
              </div>
            ))}
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        <button
          onClick={() => setShowConfirmation(true)}
          className="px-8 py-4 bg-indigo-600 text-white text-lg font-semibold rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Lock Decision & Create Action Plan
        </button>

        <p className="text-sm text-gray-500 mt-4">
          You can still review your shortlist in the session history
        </p>
      </div>
    );
  }

  // Confirmation Modal
  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-xl border-2 border-yellow-300 p-8">
        <div className="text-center mb-6">
          <div className="text-5xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Confirm Your Decision
          </h2>
          <p className="text-gray-600">
            This action will finalize your university shortlist and generate
            your application action plan.
          </p>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-yellow-900 mb-2">
            What happens when you lock:
          </h3>
          <ul className="text-sm text-yellow-800 space-y-1">
            <li>✓ Your shortlist becomes finalized</li>
            <li>✓ A personalized 30-60 day action plan will be created</li>
            <li>✓ Tasks and deadlines will be assigned</li>
            <li>✓ You can track your progress in the dashboard</li>
          </ul>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        <div className="flex gap-4">
          <button
            onClick={() => setShowConfirmation(false)}
            disabled={loading}
            className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50"
          >
            Go Back
          </button>
          <button
            onClick={handleLock}
            disabled={loading}
            className="flex-1 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
          >
            {loading ? "Locking..." : "Confirm & Lock"}
          </button>
        </div>
      </div>
    </div>
  );
}
