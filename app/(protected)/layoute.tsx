import { redirect } from "next/navigation";
import { getCurrentUser } from "@/libs/auth";
import { headers } from "next/headers";
import Sidebar from "@/components/Sidebar";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  const headersList = headers();
  const pathname = headersList.get("x-pathname") || "";

  if (!user) {
    redirect("/signin");
  }

  const isComplete = user.profile?.isComplete;
  const isOnOnboarding = pathname.startsWith("/onboarding");

  // Profile incomplete + not on onboarding → force onboarding
  if (!isComplete && !isOnOnboarding) {
    redirect("/onboarding");
  }

  // Profile complete + on onboarding → go to dashboard
  if (isComplete && isOnOnboarding) {
    redirect("/dashboard");
  }

  // Special case: onboarding page doesn't show sidebar
  if (isOnOnboarding) {
    return <>{children}</>;
  }

  // All other protected pages show sidebar
  return (
    <div className="flex h-screen">
      <Sidebar user={user} />
      <main className="flex-1 overflow-y-auto p-8">{children}</main>
    </div>
  );
}
