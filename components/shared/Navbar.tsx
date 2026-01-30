import { User } from "@/app/generated/prisma/client";
import { LogOutIcon } from "lucide-react";

export default function Navbar({ user }: { user: User }) {
  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
      <div className="flex items-center gap-4">
        <h2 className="text-lg font-semibold text-gray-800">
          Welcome back, {user.name.split(" ")[0]}!
        </h2>
      </div>

      <div className="flex items-center gap-4">
        {/* Add notifications, settings, etc. later */}
        <button className="text-gray-600 hover:text-gray-900"><LogOutIcon className="w-5 h-5" /></button>
      </div>
    </header>
  );
}
