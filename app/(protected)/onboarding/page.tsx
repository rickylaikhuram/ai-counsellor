import { getCurrentUser } from "@/libs/auth";
import { redirect } from "next/navigation";

export default async function OnboardingPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/signin");
  }

  // If already completed, redirect to dashboard
  if (user.profile?.isComplete) {
    redirect("/dashboard");
  }

  return (
    <div className="w-full max-w-2xl">
      <h1 className="text-3xl font-bold mb-8">Complete Your Profile</h1>
      {/* Onboarding form will go here */}
    </div>
  );
}
