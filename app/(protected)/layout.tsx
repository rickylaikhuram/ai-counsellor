import { redirect } from "next/navigation";
import { getCurrentUser } from "@/libs/auth";
import Sidebar from "@/components/shared/Sidebar";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  // If not authenticated, redirect to signin
  if (!user) {
    redirect("/signin");
  }

  const isOnboardingComplete = user.profile?.isComplete ?? false;


  return (
    <div className="min-h-screen bg-gray-50">
      {isOnboardingComplete ? (
        // Show full app layout with sidebar/navbar
        <div className="flex h-screen">
          {/* Sidebar */}
          <Sidebar user={user} />

          {/* Main Content */}
          <div className="flex-1 flex flex-col overflow-hidden">
            <main className="flex-1 overflow-y-auto p-6">{children}</main>
          </div>
        </div>
      ) : (
        // Minimal layout for onboarding
        <div className="min-h-screen flex items-center justify-center">
          {children}
        </div>
      )}
    </div>
  );
}
