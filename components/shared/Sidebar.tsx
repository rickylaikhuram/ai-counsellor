"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { User } from "@/app/generated/prisma/client";
import {
  LayoutDashboard,
  MessageSquare,
  GraduationCap,
  UserCircle,
  LogOut,
  Folder,
} from "lucide-react";
import { cn } from "@/libs/utils";
import { signOut } from "next-auth/react";

export default function Sidebar({ user }: { user: User }) {
  const pathname = usePathname();

  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "AI Counsellor", href: "/counsellor", icon: MessageSquare },
    { name: "Application", href: "/applications", icon: Folder },
    { name: "My Profile", href: "/profile", icon: UserCircle },
  ];

  return (
    <div className="flex h-full w-64 flex-col border-r border-zinc-200 bg-white shadow-[1px_0_0_0_rgba(0,0,0,0.05)]">
      {/* Brand Logo */}
      <div className="flex h-16 items-center border-b border-zinc-100 px-6">
        <Link
          href="/dashboard"
          className="flex items-center gap-2.5 transition-opacity hover:opacity-80"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600 text-white shadow-md shadow-indigo-100">
            <GraduationCap className="h-5 w-5" />
          </div>
          <span className="text-lg font-bold tracking-tight text-zinc-900">
            StudyPath <span className="text-indigo-600">AI</span>
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1.5 px-4 py-6">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "group flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-200",
                isActive
                  ? "bg-indigo-50 text-indigo-700 shadow-sm"
                  : "text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900",
              )}
            >
              <item.icon
                className={cn(
                  "h-5 w-5 transition-colors",
                  isActive
                    ? "text-indigo-600"
                    : "text-zinc-400 group-hover:text-zinc-600",
                )}
              />
              {item.name}
              {isActive && (
                <div className="ml-auto h-1.5 w-1.5 rounded-full bg-indigo-600" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer / User Profile */}
      <div className="mt-auto border-t border-zinc-100 p-4">
        <div className="mb-2 rounded-xl bg-zinc-50 p-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-sm font-bold text-white ring-2 ring-white">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="truncate text-sm font-bold text-zinc-900">
                {user.name}
              </p>
              <p className="truncate text-xs text-zinc-500">{user.email}</p>
            </div>
          </div>
        </div>

        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-semibold text-zinc-500 transition-colors hover:bg-red-50 hover:text-red-600"
        >
          <LogOut className="h-5 w-5" />
          Sign out
        </button>
      </div>
    </div>
  );
}
