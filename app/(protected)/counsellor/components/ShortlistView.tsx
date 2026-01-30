"use client";

import { useEffect, useState } from "react";
import { UniversityCategory } from "@/app/generated/prisma/enums";
import { generateUniversityShortlist } from "../actions";
import { ShortlistViewProps } from "../types/prisma-enums";

const categoryStyles = {
  DREAM: {
    badge: "bg-purple-100 text-purple-700",
    border: "border-purple-200",
    icon: "🌟",
  },
  TARGET: {
    badge: "bg-blue-100 text-blue-700",
    border: "border-blue-200",
    icon: "🎯",
  },
  SAFE: {
    badge: "bg-green-100 text-green-700",
    border: "border-green-200",
    icon: "✅",
  },
};

const levelColors = {
  LOW: "text-green-600",
  MEDIUM: "text-yellow-600",
  HIGH: "text-red-600",
};

export default function ShortlistView({
  sessionId,
  shortlisted,
  decisionPath,
  profile,
}: ShortlistViewProps) {
  const [status, setStatus] = useState<"generating" | "success" | "error">(
    shortlisted.length > 0 ? "success" : "generating",
  );
  const [error, setError] = useState<string | null>(null);
  const [retrying, setRetrying] = useState(false);

  useEffect(() => {
    // Auto-trigger shortlist generation if not already done
    if (shortlisted.length === 0) {
      generateShortlist();
    }
  }, []);

  async function generateShortlist() {
    setStatus("generating");
    setError(null);

    if (!decisionPath) {
      setError("Decision path not selected");
      setStatus("error");
      return;
    }

    const result = await generateUniversityShortlist(
      sessionId,
      profile.userId,
      decisionPath,
    );

    if (result.success) {
      setStatus("success");
      // Page will revalidate and show shortlist
    } else {
      setStatus("error");
      setError(result.error || "Failed to generate shortlist");
    }
  }

  async function handleRetry() {
    setRetrying(true);
    await generateShortlist();
    setRetrying(false);
  }

  if (status === "generating") {
    return (
      <div className="max-w-3xl mx-auto text-center py-12">
        <div className="mb-6">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-indigo-500 border-t-transparent"></div>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-3">
          Generating Your University Shortlist
        </h2>
        <p className="text-gray-600 mb-6">
          Our AI counsellor is analyzing 44 universities and selecting the best
          matches for your profile and {decisionPath} path...
        </p>

        <div className="bg-blue-50 rounded-lg p-6">
          <h3 className="font-semibold text-gray-800 mb-3">
            What We're Doing:
          </h3>
          <ul className="text-left text-sm text-gray-700 space-y-2">
            <li>
              ✓ Matching your academic profile with university requirements
            </li>
            <li>✓ Considering your budget and financial constraints</li>
            <li>✓ Balancing reach, target, and safety schools</li>
            <li>✓ Analyzing acceptance chances and cost levels</li>
          </ul>
        </div>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="max-w-2xl mx-auto text-center py-12">
        <div className="mb-6 text-6xl">⚠️</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-3">
          Shortlist Generation Failed
        </h2>
        <p className="text-gray-600 mb-6">
          {error ||
            "We encountered an issue generating your university shortlist."}
        </p>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-6">
          <p className="text-sm text-yellow-800">
            Don't worry - your progress is saved. Click retry to generate your
            shortlist again.
          </p>
        </div>

        <button
          onClick={handleRetry}
          disabled={retrying}
          className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
        >
          {retrying ? "Retrying..." : "Retry Generation"}
        </button>
      </div>
    );
  }

  // Success - display shortlist
  const groupedByCategory = {
    DREAM: shortlisted.filter((s) => s.category === UniversityCategory.DREAM),
    TARGET: shortlisted.filter((s) => s.category === UniversityCategory.TARGET),
    SAFE: shortlisted.filter((s) => s.category === UniversityCategory.SAFE),
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-3">
          Your Personalized University Shortlist
        </h1>
        <p className="text-lg text-gray-600">
          {shortlisted.length} universities carefully selected based on your{" "}
          {decisionPath} path
        </p>
      </div>

      {/* Category Sections */}
      <div className="space-y-8">
        {Object.entries(groupedByCategory).map(([category, universities]) => {
          if (universities.length === 0) return null;

          const styles =
            categoryStyles[category as keyof typeof categoryStyles];

          return (
            <div key={category}>
              <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl">{styles.icon}</span>
                <h2 className="text-2xl font-bold text-gray-900">
                  {category} Schools
                </h2>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${styles.badge}`}
                >
                  {universities.length} universities
                </span>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                {universities.map((item) => (
                  <div
                    key={item.id}
                    className={`p-6 bg-white border-2 ${styles.border} rounded-xl hover:shadow-lg transition-shadow`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">
                          {item.university.name}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {item.university.city}, {item.university.country}
                        </p>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${styles.badge}`}
                      >
                        {category}
                      </span>
                    </div>

                    {/* Key Metrics */}
                    <div className="grid grid-cols-3 gap-3 mb-4 text-sm">
                      <div>
                        <span className="text-gray-500 block">Cost Level</span>
                        <span
                          className={`font-semibold ${
                            levelColors[item.costLevel]
                          }`}
                        >
                          {item.costLevel}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-500 block">Acceptance</span>
                        <span
                          className={`font-semibold ${
                            levelColors[item.acceptanceChance]
                          }`}
                        >
                          {item.acceptanceChance}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-500 block">Tuition</span>
                        <span className="font-semibold text-gray-900">
                          ${(item.university.tuition / 1000).toFixed(0)}K
                        </span>
                      </div>
                    </div>

                    {/* Reasoning */}
                    <div className="mb-3">
                      <h4 className="text-xs font-semibold text-gray-700 uppercase mb-1">
                        Why This University
                      </h4>
                      <p className="text-sm text-gray-600">{item.reasoning}</p>
                    </div>

                    {/* Risks */}
                    <div className="pt-3 border-t border-gray-100">
                      <h4 className="text-xs font-semibold text-gray-700 uppercase mb-1">
                        Considerations
                      </h4>
                      <p className="text-sm text-gray-600">{item.risks}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Continue Button */}
      <div className="mt-10 text-center">
        <p className="text-gray-600 mb-4">
          Review your shortlist above. When you're ready, proceed to lock your
          decision and create an action plan.
        </p>
        <div className="text-sm text-gray-500">
          This shortlist will automatically advance to the next step
        </div>
      </div>
    </div>
  );
}
