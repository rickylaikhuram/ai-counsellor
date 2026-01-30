"use client";

import { useState } from "react";
import { DecisionPath, Level, Role } from "@/app/generated/prisma/enums";
import { saveDecisionPath } from "../actions";

interface DecisionPathStepProps {
  sessionId: string;
  messages: Array<{ role: Role; content: string }>;
  riskLevel: Level | null;
}

const pathOptions = [
  {
    value: DecisionPath.LOW_COST,
    label: "Cost-Conscious Path",
    description:
      "Prioritize affordability and scholarships. Focus on universities with lower tuition and high scholarship availability.",
    icon: "💰",
    color: "green",
    features: [
      "Lower tuition fees",
      "High scholarship probability",
      "Part-time work opportunities",
      "Cost-effective living locations",
    ],
  },
  {
    value: DecisionPath.BALANCED,
    label: "Balanced Path",
    description:
      "Balance cost, reputation, and acceptance chances. A well-rounded approach considering multiple factors.",
    icon: "⚖️",
    color: "blue",
    features: [
      "Mix of prestigious and affordable options",
      "Reasonable acceptance rates",
      "Good ROI potential",
      "Flexible funding options",
    ],
  },
  {
    value: DecisionPath.HIGH_RISK,
    label: "Prestige-Focused Path",
    description:
      "Target top-tier universities for maximum career impact, even if acceptance rates are lower.",
    icon: "🎯",
    color: "purple",
    features: [
      "Top-ranked institutions",
      "Strong alumni networks",
      "Premium career prospects",
      "Competitive admission standards",
    ],
  },
];

const colorClasses = {
  green: {
    border: "border-green-500",
    bg: "bg-green-50",
    text: "text-green-600",
    hover: "hover:border-green-600",
  },
  blue: {
    border: "border-blue-500",
    bg: "bg-blue-50",
    text: "text-blue-600",
    hover: "hover:border-blue-600",
  },
  purple: {
    border: "border-purple-500",
    bg: "bg-purple-50",
    text: "text-purple-600",
    hover: "hover:border-purple-600",
  },
};

export default function DecisionPathStep({
  sessionId,
  messages,
  riskLevel,
}: DecisionPathStepProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Find the AI analysis message
  const analysisMessage = messages.filter((m) => m.role === "ASSISTANT").pop();

  async function handleSelect(path: DecisionPath) {
    setLoading(true);
    setError(null);

    const result = await saveDecisionPath(sessionId, path);

    if (!result.success) {
      setError(result.error || "Failed to save decision path");
      setLoading(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-3">
          Choose Your Decision Path
        </h1>
        <p className="text-lg text-gray-600">
          Based on your profile analysis, select the strategy that aligns with
          your goals
        </p>
      </div>

      {/* Show AI Analysis Summary */}
      {analysisMessage && (
        <div className="mb-8 p-6 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl border border-indigo-100">
          <div className="flex items-start gap-3">
            <div className="text-2xl">🤖</div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 mb-2">
                AI Analysis - Your Risk Profile: {riskLevel}
              </h3>
              <p className="text-gray-700 whitespace-pre-wrap">
                {analysisMessage.content}
              </p>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      <div className="grid md:grid-cols-3 gap-6">
        {pathOptions.map((option) => (
          <button
            key={option.value}
            onClick={() => handleSelect(option.value)}
            disabled={loading}
            className={`p-6 bg-white border-2 ${
              colorClasses[option.color as keyof typeof colorClasses].border
            } rounded-xl ${
              colorClasses[option.color as keyof typeof colorClasses].hover
            } hover:shadow-lg transition-all duration-200 text-left disabled:opacity-50 disabled:cursor-not-allowed group`}
          >
            <div className="text-4xl mb-3">{option.icon}</div>
            <h3
              className={`text-xl font-semibold mb-2 ${
                colorClasses[option.color as keyof typeof colorClasses].text
              }`}
            >
              {option.label}
            </h3>
            <p className="text-gray-600 text-sm mb-4">{option.description}</p>

            <div className="space-y-2">
              {option.features.map((feature, idx) => (
                <div key={idx} className="flex items-start gap-2 text-sm">
                  <svg
                    className={`w-5 h-5 mt-0.5 ${
                      colorClasses[option.color as keyof typeof colorClasses]
                        .text
                    }`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-gray-700">{feature}</span>
                </div>
              ))}
            </div>

            <div
              className={`mt-4 pt-4 border-t ${
                colorClasses[option.color as keyof typeof colorClasses].border
              } opacity-50`}
            >
              <span className="text-xs font-medium text-gray-500 uppercase">
                Select this path →
              </span>
            </div>
          </button>
        ))}
      </div>

      {loading && (
        <div className="mt-8 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-indigo-500 border-t-transparent"></div>
          <p className="mt-2 text-gray-600">Saving your path selection...</p>
        </div>
      )}
    </div>
  );
}
