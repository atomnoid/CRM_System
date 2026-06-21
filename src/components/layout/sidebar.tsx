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

  const toggleSidebar = () => setIsOpen(!isOpen);
  const closeSidebar = () => setIsOpen(false);

  return (
    <>
      {/* Mobile Sticky Top Header */}
      <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-border bg-white px-4 md:hidden shrink-0 shadow-sm">
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold tracking-tight text-unicorn-primary">Unicorn CRM</span>
        </div>
        <button
          onClick={toggleSidebar}
          className="rounded-lg p-2 text-slate-600 hover:bg-unicorn-muted hover:text-unicorn-primary focus:outline-none transition-colors"
          aria-label="Toggle menu"
        >
          <Menu className="h-6 w-6" />
        </button>
      </header>

      {/* Mobile Drawer Overlay Backdrop */}
      <div
        className={cn(
          "fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-300 md:hidden",
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        onClick={closeSidebar}
      />

      {/* Mobile Drawer (Slide-out menu) */}
      <div
        className={cn(
          "fixed bottom-0 top-0 left-0 z-50 w-72 bg-white p-5 shadow-2xl transition-transform duration-300 ease-in-out md:hidden flex flex-col",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex items-center justify-between border-b border-border pb-4 mb-4">
          <span className="text-xl font-bold tracking-tight text-unicorn-primary">Unicorn CRM</span>
          <button
            onClick={closeSidebar}
            className="rounded-lg p-2 text-slate-600 hover:bg-unicorn-muted hover:text-unicorn-primary focus:outline-none transition-colors"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <nav className="flex flex-col gap-1.5 flex-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={closeSidebar}
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
      </div>

      {/* Desktop Persistent Sidebar */}
      <aside className="hidden h-screen w-64 shrink-0 border-r border-border bg-white md:sticky md:top-0 md:flex md:flex-col">
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
