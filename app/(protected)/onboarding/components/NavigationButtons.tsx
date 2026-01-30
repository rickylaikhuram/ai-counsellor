"use client";

interface NavigationButtonsProps {
  currentStep: number;
  totalSteps: number;
  onBack: () => void;
  // onNext: () => void;
  isSubmitting: boolean;
}

export default function NavigationButtons({
  currentStep,
  totalSteps,
  onBack,
  // onNext,
  isSubmitting,
}: NavigationButtonsProps) {
  return (
    <div className="flex justify-between pt-6 border-t border-gray-200 mb-2">
      <button
        type="button"
        onClick={onBack}
        disabled={currentStep === 1 || isSubmitting}
        className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        Back
      </button>

      {/* {currentStep < totalSteps && (
        <button
          type="button"
          onClick={onNext}
          disabled={isSubmitting}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isSubmitting ? "Saving..." : "Next"}
        </button>
      )} */}
    </div>
  );
}
