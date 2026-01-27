import Link from "next/link";
import { User } from "@/app/generated/prisma/client";

export default function Sidebar({ user }: { user: User }) {
  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: "📊" },
    { name: "AI Counsellor", href: "/counsellor", icon: "🤖" },
    { name: "Universities", href: "/universities", icon: "🎓" },
    { name: "Applications", href: "/applications", icon: "📝" },
    { name: "Profile", href: "/profile", icon: "👤" },
  ];

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
      {/* Logo */}
      <div className="h-16 flex items-center px-6 border-b border-gray-200">
        <h1 className="text-xl font-bold text-blue-600">StudyAbroad AI</h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navigation.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className="flex items-center gap-3 px-4 py-3 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <span className="text-xl">{item.icon}</span>
            <span className="font-medium">{item.name}</span>
          </Link>
        ))}
      </nav>

      {/* User Info */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {user.name}
            </p>
            <p className="text-xs text-gray-500 truncate">{user.email}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
