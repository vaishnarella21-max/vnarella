"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, History, LogOut } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const NAV = [
  { href: "/dashboard",         label: "This week", icon: LayoutDashboard },
  { href: "/dashboard/history", label: "History",   icon: History },
];

export default function DashboardNav({ businessName }: { businessName: string }) {
  const pathname = usePathname();
  const router   = useRouter();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <nav
      className="sticky top-0 z-50 backdrop-blur-md border-b"
      style={{
        background: "rgba(250,250,247,0.92)",
        borderColor: "#E7E5E4",
      }}
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/dashboard" className="text-lg font-bold gradient-text heading-serif">
            CreativeLoop
          </Link>

          <div className="hidden sm:flex items-center gap-1">
            {NAV.map(({ href, label, icon: Icon }) => {
              const active =
                pathname === href ||
                (href !== "/dashboard" && pathname.startsWith(href));
              return (
                <Link
                  key={href}
                  href={href}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                  style={{
                    background: active ? "#FFF7ED" : "transparent",
                    color: active ? "#C2410C" : "#78716C",
                  }}
                >
                  <Icon size={15} />
                  {label}
                </Link>
              );
            })}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span
            className="hidden sm:block text-sm truncate max-w-[160px]"
            style={{ color: "#A8A29E" }}
          >
            {businessName}
          </span>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 text-sm p-2 rounded-lg transition-colors"
            style={{ color: "#A8A29E" }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.color = "#DC2626";
              (e.currentTarget as HTMLButtonElement).style.background = "#FFF1F0";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.color = "#A8A29E";
              (e.currentTarget as HTMLButtonElement).style.background = "transparent";
            }}
            title="Sign out"
          >
            <LogOut size={15} />
            <span className="hidden sm:inline">Sign out</span>
          </button>
        </div>
      </div>
    </nav>
  );
}
