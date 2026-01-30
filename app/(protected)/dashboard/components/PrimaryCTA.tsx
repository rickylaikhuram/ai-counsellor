// app/dashboard/components/PrimaryCTA.tsx
import { getDashboardState, startCounsellingSession } from "../action";
import Link from "next/link";
import {
  ArrowRight,
  Sparkles,
  Rocket,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/libs/utils";

type CTAConfig = {
  title: string;
  description: string;
  href?: string;
  action?: () => Promise<void>;
  variant: "primary" | "success" | "warning";
};

function getCTAConfig(
  state: Awaited<ReturnType<typeof getDashboardState>>,
): CTAConfig {
  if (!state.profile.isComplete) {
    return {
      title: "Complete Your Profile",
      description: "Finish setting up your profile to unlock AI counselling",
      href: "/onboarding",
      variant: "warning",
    };
  }

  if (state.latestSession === null) {
    return {
      title: "Start AI Counselling",
      description:
        "Begin your personalized study-abroad journey with AI guidance",
      action: startCounsellingSession,
      variant: "primary",
    };
  }

  if (!state.latestSession.isLocked) {
    return {
      title: "Continue Counselling",
      description:
        "Resume your AI counselling session to finalize your shortlist",
      href: "/counsellor",
      variant: "primary",
    };
  }

  return {
    title: "View Action Plan",
    description: "Your shortlist is ready. Review applications and next steps",
    href: "/applications",
    variant: "success",
  };
}

export async function PrimaryCTA() {
  const state = await getDashboardState();
  const cta = getCTAConfig(state);

  const variantStyles = {
    primary: "bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-200",
    success:
      "bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-200",
    warning: "bg-amber-500 hover:bg-amber-600 text-white shadow-amber-200",
  };

  const iconMap = {
    primary: <Sparkles className="h-6 w-6" />,
    success: <CheckCircle2 className="h-6 w-6" />,
    warning: <AlertCircle className="h-6 w-6" />,
  };

  const borderStyles = {
    primary: "border-indigo-100 bg-indigo-50/30",
    success: "border-emerald-100 bg-emerald-50/30",
    warning: "border-amber-100 bg-amber-50/30",
  };

  const content = (
    <div
      className={cn(
        "relative overflow-hidden rounded-[2rem] border-2 p-8 sm:p-10 transition-all",
        borderStyles[cta.variant],
      )}
    >
      {/* Abstract Background Shape */}
      <div className="absolute -right-12 -top-12 h-64 w-64 rounded-full bg-white/50 blur-3xl" />

      <div className="relative z-10 flex flex-col items-start gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-3">
          <div
            className={cn(
              "flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-sm transition-transform hover:scale-110",
              cta.variant === "primary"
                ? "text-indigo-600"
                : cta.variant === "success"
                  ? "text-emerald-600"
                  : "text-amber-600",
            )}
          >
            {iconMap[cta.variant]}
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight text-zinc-900 sm:text-4xl">
            {cta.title}
          </h2>
          <p className="max-w-xl text-lg font-medium leading-relaxed text-zinc-600">
            {cta.description}
          </p>
        </div>

        {cta.action ? (
          <form action={cta.action} className="w-full lg:w-auto">
            <button
              type="submit"
              className={cn(
                "group flex w-full items-center justify-center gap-2 px-8 py-5 rounded-2xl font-bold text-lg shadow-xl transition-all active:scale-[0.98] lg:w-auto",
                variantStyles[cta.variant],
              )}
            >
              {cta.title}
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </button>
          </form>
        ) : (
          <Link
            href={cta.href!}
            className={cn(
              "group flex w-full items-center justify-center gap-2 px-8 py-5 rounded-2xl font-bold text-lg shadow-xl transition-all active:scale-[0.98] lg:w-auto",
              variantStyles[cta.variant],
            )}
          >
            {cta.title}
            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Link>
        )}
      </div>
    </div>
  );

  return <div className="bg-white rounded-[2rem] p-1 shadow-sm">{content}</div>;
}
