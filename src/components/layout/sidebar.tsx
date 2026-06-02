"use client";

import type { JSX } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "Dashboard" },
  { href: "/students", label: "Students" },
  { href: "/teachers", label: "Teachers" }
];

export function Sidebar(): JSX.Element {
  const pathname = usePathname();

  return (
    <aside className="w-full border-r border-border bg-white md:w-64">
      <div className="border-b border-border px-5 py-4">
        <h1 className="text-xl font-semibold text-unicorn-primary">Unicorn CRM</h1>
      </div>
      <nav className="flex gap-2 p-3 md:flex-col">
        {navItems.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "rounded-md px-3 py-2 text-sm font-medium transition-colors",
                active
                  ? "bg-unicorn-muted text-unicorn-primary"
                  : "text-slate-600 hover:bg-unicorn-muted hover:text-unicorn-primary"
              )}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
