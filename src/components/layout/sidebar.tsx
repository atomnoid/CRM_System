"use client";

import { useState } from "react";
import type { JSX } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Menu, X, LayoutDashboard, GraduationCap, Users } from "lucide-react";

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/students", label: "Students", icon: GraduationCap },
  { href: "/teachers", label: "Teachers", icon: Users }
];

export function Sidebar(): JSX.Element {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const closeSidebar = () => setIsOpen(false);

  return (
    <>
      {/* ─── Mobile Top Header ─── */}
      <header className="sticky top-0 z-40 flex h-14 w-full items-center justify-between border-b border-slate-200 bg-white/95 backdrop-blur-md px-4 md:hidden shadow-sm">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-600 text-white text-xs font-bold select-none">U</div>
          <span className="text-base font-bold tracking-tight text-indigo-700">Unicorn CRM</span>
        </div>
        <button
          onClick={() => setIsOpen(true)}
          className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 focus:outline-none transition-colors"
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </button>
      </header>

      {/* ─── Mobile Drawer Backdrop ─── */}
      <div
        className={cn(
          "fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm transition-opacity duration-300 md:hidden",
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        onClick={closeSidebar}
      />

      {/* ─── Mobile Side Drawer ─── */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-72 bg-white shadow-2xl transition-transform duration-300 ease-in-out md:hidden flex flex-col",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <span className="text-xl font-bold tracking-tight text-indigo-700">Unicorn CRM</span>
          <button
            onClick={closeSidebar}
            className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 focus:outline-none transition-colors"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <nav className="flex flex-col gap-1 p-3 flex-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={closeSidebar}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-4 py-3.5 text-sm font-semibold transition-all duration-200",
                  active
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
                    : "text-slate-600 hover:bg-indigo-50 hover:text-indigo-700"
                )}
              >
                <Icon className="h-5 w-5 shrink-0" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* ─── Mobile Bottom Tab Bar ─── */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-[0_-2px_16px_rgba(0,0,0,0.08)]">
        <div className="flex">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-1 flex-col items-center justify-center gap-0.5 py-3 text-[10px] font-bold uppercase tracking-wide transition-colors duration-200",
                  active ? "text-indigo-600" : "text-slate-400"
                )}
              >
                <span className={cn(
                  "flex items-center justify-center rounded-xl w-10 h-6 transition-all duration-200",
                  active ? "bg-indigo-50" : ""
                )}>
                  <Icon className={cn("h-[18px] w-[18px]", active ? "text-indigo-600" : "text-slate-400")} />
                </span>
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* ─── Desktop Persistent Sidebar ─── */}
      <aside className="hidden md:flex md:flex-col md:sticky md:top-0 h-screen w-64 shrink-0 border-r border-border bg-white">
        <div className="flex h-16 items-center border-b border-border px-6">
          <h1 className="text-xl font-bold tracking-tight text-unicorn-primary">Unicorn CRM</h1>
        </div>
        <nav className="flex flex-col gap-1.5 p-4 flex-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all duration-200",
                  active
                    ? "bg-unicorn-primary text-white shadow-md shadow-unicorn-primary/10"
                    : "text-slate-600 hover:bg-unicorn-muted hover:text-unicorn-primary"
                )}
              >
                <Icon className="h-5 w-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
