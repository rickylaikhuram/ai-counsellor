"use client";
import { User } from "@/app/generated/prisma/client";
import { LogOutIcon } from "lucide-react";
import { signOut } from "next-auth/react";

export default function Navbar({ user }: { user: User }) {
  const handleLogout = async () => {
    await signOut({ callbackUrl: "/signin" });
  };

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
      <div className="flex items-center gap-4">
        <h2 className="text-lg font-semibold text-gray-800">
          Welcome back, {user.name.split(" ")[0]}!
        </h2>
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={handleLogout}
          className="text-gray-600 hover:text-gray-900"
          title="Logout"
        >
          <LogOutIcon className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
}
