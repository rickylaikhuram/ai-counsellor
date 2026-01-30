export type OnboardingStep = 1 | 2 | 3 | 4;

export interface StepComponentProps {
  onNext: () => void;
  onBack: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
}