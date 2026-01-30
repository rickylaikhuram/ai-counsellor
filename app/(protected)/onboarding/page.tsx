import { getCurrentUser } from "@/libs/auth";
import { redirect } from "next/navigation";
import OnboardingContainer from "./components/OnboardingContainer";

export default async function OnboardingPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/signin");
  }

  // If already completed, redirect to dashboard
  if (user.profile?.isComplete) {
    redirect("/dashboard");
  }

  // Pass existing profile data if any (for resuming)
  const existingProfile = user.profile || null;

  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Complete Your Profile
        </h1>
        <p className="text-gray-600">
          Help us understand your background and goals to provide personalized
          guidance
        </p>
      </div>

      <OnboardingContainer userId={user.id} />
    </div>
  );
}
