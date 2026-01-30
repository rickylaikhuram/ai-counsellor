"use client";

import type { DashboardState } from "../action";
import {
  UserCheck,
  School,
  ListTodo,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { cn } from "@/libs/utils";

type Props = {
  state: DashboardState;
};

type CardVariant = "success" | "warning" | "neutral";

type Card = {
  label: string;
  value: string | number;
  variant: CardVariant;
  icon: React.ReactNode;
};

export function SnapshotCards({ state }: Props) {
  const cards: Card[] = [
    {
      label: "Profile Status",
      value: state.profile.isComplete ? "Complete" : "Incomplete",
      variant: state.profile.isComplete ? "success" : "warning",
      icon: state.profile.isComplete ? (
        <UserCheck className="h-5 w-5" />
      ) : (
        <AlertCircle className="h-5 w-5" />
      ),
    },
    {
      label: "Shortlisted Universities",
      value: state.stats.shortlistedCount,
      variant: "neutral",
      icon: <School className="h-5 w-5" />,
    },
    {
      label: "Pending Tasks",
      value: state.stats.pendingTasksCount,
      variant: state.stats.pendingTasksCount > 0 ? "warning" : "success",
      icon:
        state.stats.pendingTasksCount > 0 ? (
          <ListTodo className="h-5 w-5" />
        ) : (
          <CheckCircle2 className="h-5 w-5" />
        ),
    },
  ];

  const variantStyles = {
    success: {
      container: "border-emerald-100 bg-white",
      iconBox: "bg-emerald-50 text-emerald-600",
      value: "text-zinc-900",
    },
    warning: {
      container: "border-amber-100 bg-white",
      iconBox: "bg-amber-50 text-amber-600",
      value: "text-zinc-900",
    },
    neutral: {
      container: "border-zinc-100 bg-white shadow-sm",
      iconBox: "bg-indigo-50 text-indigo-600",
      value: "text-zinc-900",
    },
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold tracking-tight text-zinc-900">
          Overview
        </h3>
        <div className="h-px flex-1 bg-zinc-100 ml-6 hidden sm:block" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {cards.map((card) => {
          const styles = variantStyles[card.variant];
          return (
            <div
              key={card.label}
              className={cn(
                "group relative overflow-hidden rounded-3xl border-2 p-6 transition-all hover:shadow-xl hover:shadow-zinc-200/50 hover:-translate-y-1",
                styles.container,
              )}
            >
              <div className="flex items-center justify-between mb-4">
                <div
                  className={cn(
                    "flex h-12 w-12 items-center justify-center rounded-2xl transition-transform group-hover:scale-110",
                    styles.iconBox,
                  )}
                >
                  {card.icon}
                </div>
                {card.variant !== "neutral" && (
                  <div
                    className={cn(
                      "h-2 w-2 rounded-full animate-pulse",
                      card.variant === "success"
                        ? "bg-emerald-500"
                        : "bg-amber-500",
                    )}
                  />
                )}
              </div>

              <div className="space-y-1">
                <p className="text-sm font-bold uppercase tracking-wider text-zinc-500">
                  {card.label}
                </p>
                <p
                  className={cn(
                    "text-3xl font-black tracking-tight",
                    styles.value,
                  )}
                >
                  {card.value}
                </p>
              </div>

              {/* Subtle background flair */}
              <div className="absolute -right-4 -bottom-4 h-24 w-24 bg-zinc-50/50 rounded-full blur-2xl group-hover:bg-indigo-50/50 transition-colors" />
            </div>
          );
        })}
      </div>
    </div>
  );
}
