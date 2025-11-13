"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  PhoneCall,
  Settings,
  BookOpen,
  Layers,
  MessageSquare,
  Network,
  LayoutDashboard,
  Users,
  LogOut,
} from "lucide-react";
import clsx from "clsx";
import { useCallback } from "react";

type NavItem = {
  label: string;
  href: string;
  icon: React.ReactNode;
  role?: "super" | "client" | "both";
  section?: "platform" | "admin";
};

const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard",     href: "/",               icon: <LayoutDashboard className="w-4 h-4" />, role: "both",   section: "platform" },
  { label: "Calls",         href: "/calls",          icon: <PhoneCall className="w-4 h-4" />,       role: "both",   section: "platform" },
  { label: "Numbers",       href: "/numbers",        icon: <Layers className="w-4 h-4" />,          role: "client", section: "platform" },
  { label: "Knowledge Base",href: "/knowledge",      icon: <BookOpen className="w-4 h-4" />,        role: "client", section: "platform" },
  { label: "Integrations",  href: "/integrations",   icon: <Network className="w-4 h-4" />,         role: "both", section: "platform" },
  { label: "Prompts",       href: "/prompts",        icon: <MessageSquare className="w-4 h-4" />,   role: "client", section: "platform" },
  { label: "Clients",       href: "/admin/clients",  icon: <Users className="w-4 h-4" />,           role: "super",  section: "admin" },
  { label: "Settings",      href: "/settings",       icon: <Settings className="w-4 h-4" />,        role: "both",   section: "admin" },
];

const CURRENT_ROLE: "super" | "client" = "super";

export default function Sidebar({
  onLogout,
}: {
  onLogout?: () => void;
}) {
  const pathname = usePathname();

  const visiblePlatform = NAV_ITEMS.filter(
    (i) => i.section === "platform" && (i.role === "both" || i.role === CURRENT_ROLE)
  );
  const visibleAdmin = NAV_ITEMS.filter(
    (i) => i.section === "admin" && (i.role === "both" || i.role === CURRENT_ROLE)
  );

  const handleLogoutClick = useCallback(() => {
    if (onLogout) {
      onLogout();
    }
  }, [onLogout]);

  return (
    <aside className="flex h-full w-64 flex-col bg-sidebarBg border-r border-borderSidebar text-textMain shadow-header">
      {/* Workspace header */}
      <div className="px-4 py-4 border-b border-borderSidebar">
        <div className="text-sm font-semibold text-textMain leading-tight">
          Rolkol Admin
        </div>
        <div className="text-[11px] text-textDim leading-tight">
          {CURRENT_ROLE === "super" ? "Super Admin" : "Client Admin"}
        </div>

        <div className="mt-2 inline-flex items-center rounded-full border border-accentBorder bg-accentBg text-accentText text-[11px] font-medium px-2 py-[2px] leading-none">
          {CURRENT_ROLE === "super" ? "Super" : "Client"}
        </div>
      </div>

      {/* Nav sections */}
      <nav className="flex-1 overflow-y-auto py-4 text-[13px]">
        {/* PLATFORM */}
        <div className="px-4 text-[11px] font-medium text-textMuted uppercase tracking-wide mb-2">
          Platform
        </div>
        <ul className="mb-6 space-y-1">
          {visiblePlatform.map((item) => {
            const active = pathname === item.href;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={clsx(
                    "flex items-center gap-3 px-4 py-2 transition rounded-md border",
                    active
                      ? "bg-white text-textMain shadow-card border-borderCard border-l-4 border-l-sky-500"
                      : "bg-transparent text-textDim border-transparent hover:bg-white hover:text-textMain hover:shadow-sm hover:border-borderCard"
                  )}
                >
                  <div
                    className={clsx(
                      "flex h-8 w-8 items-center justify-center rounded-md border text-[13px] bg-white shrink-0",
                      active
                        ? "border-borderCard text-textMain"
                        : "border-borderSoft text-textDim"
                    )}
                  >
                    {item.icon}
                  </div>
                  <span className="truncate font-medium">
                    {item.label}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>

        {/* ADMIN */}
        <div className="px-4 text-[11px] font-medium text-textMuted uppercase tracking-wide mb-2">
          Admin
        </div>
        <ul className="space-y-1">
          {visibleAdmin.map((item) => {
            const active = pathname === item.href;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={clsx(
                    "flex items-center gap-3 px-4 py-2 transition rounded-md border",
                    active
                      ? "bg-white text-textMain shadow-card border-borderCard border-l-4 border-l-sky-500"
                      : "bg-transparent text-textDim border-transparent hover:bg-white hover:text-textMain hover:shadow-sm hover:border-borderCard"
                  )}
                >
                  <div
                    className={clsx(
                      "flex h-8 w-8 items-center justify-center rounded-md border text-[13px] bg-white shrink-0",
                      active
                        ? "border-borderCard text-textMain"
                        : "border-borderSoft text-textDim"
                    )}
                  >
                    {item.icon}
                  </div>
                  <span className="truncate font-medium">
                    {item.label}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User footer */}
      <div className="border-t border-borderSidebar bg-sidebarBg p-4">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-full bg-white border border-borderCard flex items-center justify-center text-[12px] font-medium text-textMain shadow-card">
            A
          </div>
          <div className="flex flex-col">
            <div className="text-[13px] font-medium text-textMain leading-tight">
              Anish
            </div>
            <div className="text-[11px] text-textDim leading-tight">
              anish@rolkol.com
            </div>
          </div>
        </div>

        {/* logout button */}
        <button
          onClick={handleLogoutClick}
          className="mt-4 w-full flex items-center gap-2 text-[12px] text-textDim hover:text-textMain hover:bg-white hover:shadow-sm border border-transparent hover:border-borderCard rounded-md px-3 py-2 transition"
        >
          <LogOut className="w-4 h-4" />
          <span className="font-medium">Logout</span>
        </button>

        <div className="mt-4 text-[10px] text-textMuted leading-none">
          © {new Date().getFullYear()} Rolkol
        </div>
      </div>
    </aside>
  );
}
