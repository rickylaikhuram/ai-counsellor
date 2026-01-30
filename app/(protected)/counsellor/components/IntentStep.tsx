"use client";

import { useState } from "react";
import { Intent } from "@/app/generated/prisma/enums";
import { saveIntent } from "../actions";

interface IntentStepProps {
  sessionId: string;
}

const intentOptions = [
  {
    value: Intent.EXPLORING,
    label: "Exploring Options",
    description: "I'm just starting to explore study abroad possibilities",
    icon: "🔍",
  },
  {
    value: Intent.SHORTLISTING,
    label: "Shortlisting Universities",
    description: "I have an idea and want to narrow down my university choices",
    icon: "📋",
  },
  {
    value: Intent.READY,
    label: "Ready to Apply",
    description: "I know where I want to apply and need an action plan",
    icon: "🚀",
  },
];

export default function IntentStep({ sessionId }: IntentStepProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSelect(intent: Intent) {
    setLoading(true);
    setError(null);

    const result = await saveIntent(sessionId, intent);

    if (!result.success) {
      setError(result.error || "Failed to save selection");
      setLoading(false);
    }
    // On success, page will revalidate and show next stage
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-3">
          Let's Find Your Perfect University
        </h1>
        <p className="text-lg text-gray-600">
          First, tell us where you are in your study abroad journey
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      <div className="space-y-4">
        {intentOptions.map((option) => (
          <button
            key={option.value}
            onClick={() => handleSelect(option.value)}
            disabled={loading}
            className="w-full p-6 bg-white border-2 border-gray-200 rounded-xl hover:border-indigo-500 hover:shadow-lg transition-all duration-200 text-left disabled:opacity-50 disabled:cursor-not-allowed group"
          >
            <div className="flex items-start gap-4">
              <div className="text-4xl">{option.icon}</div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-900 mb-1 group-hover:text-indigo-600">
                  {option.label}
                </h3>
                <p className="text-gray-600">{option.description}</p>
              </div>
              <div className="text-gray-400 group-hover:text-indigo-600">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </div>
          </button>
        ))}
      </div>

      {loading && (
        <div className="mt-6 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-indigo-500 border-t-transparent"></div>
          <p className="mt-2 text-gray-600">Saving your selection...</p>
        </div>
      )}
    </div>
  );
}
