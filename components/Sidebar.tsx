// components/Sidebar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar({ user }: { user: { name: string } }) {
  const pathname = usePathname();

  const navItems = [
    { href: "/dashboard", label: "Dashboard", icon: "🏠" },
    { href: "/ai-counsellor", label: "AI Counsellor", icon: "🤖" },
    { href: "/universities", label: "Universities", icon: "🎓" },
    { href: "/shortlist", label: "My Shortlist", icon: "⭐" },
    { href: "/applications", label: "Applications", icon: "📝" },
    { href: "/tasks", label: "Tasks", icon: "✅" },
    { href: "/profile", label: "Profile", icon: "👤" },
  ];

  return (
    <aside className="w-64 bg-gray-900 text-white p-6">
      <h2 className="text-2xl font-bold mb-8">AI Counsellor</h2>

      <nav>
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 p-3 rounded-lg mb-2 ${
              pathname === item.href ? "bg-blue-600" : "hover:bg-gray-800"
            }`}
          >
            <span>{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>

      <div className="mt-auto pt-6 border-t border-gray-700">
        <p className="text-sm text-gray-400">{user.name}</p>
        <button className="text-sm text-red-400 mt-2">Logout</button>
      </div>
    </aside>
  );
}
