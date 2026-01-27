import { redirect } from "next/navigation";
import { getCurrentUser } from "@/libs/auth";
import Sidebar from "@/components/shared/Sidebar";
import Navbar from "@/components/shared/Navbar";

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

  // If authenticated but onboarding not complete, redirect to onboarding
  // EXCEPT if already on onboarding page
  const isOnboardingComplete = user.profile?.isComplete ?? false;

  // We need to check pathname, but we can't use usePathname in Server Component
  // So we'll handle this differently - let onboarding page be accessible always
  // and only gate other pages

  return (
    <div className="min-h-screen bg-gray-50">
      {isOnboardingComplete ? (
        // Show full app layout with sidebar/navbar
        <div className="flex h-screen">
          {/* Sidebar */}
          <Sidebar user={user} />

          {/* Main Content */}
          <div className="flex-1 flex flex-col overflow-hidden">
            <Navbar user={user} />
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
