import type { Metadata } from "next";
import type { JSX, ReactNode } from "react";
import "./globals.css";
import { Sidebar } from "@/components/layout/sidebar";
import { CrmProvider } from "@/components/crm-provider";

export const metadata: Metadata = {
  title: "Unicorn CRM",
  description: "Modern coaching CRM dashboard",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1"
};

export default function RootLayout({ children }: { children: ReactNode }): JSX.Element {
  return (
    <html lang="en">
      <body>
        <CrmProvider>
          <div className="flex flex-col md:flex-row min-h-screen bg-[#f5f3ff]">
            <Sidebar />
            {/* pb-20 on mobile leaves room above the bottom tab bar */}
            <main className="flex-1 p-3 pb-24 md:p-8 md:pb-8 min-w-0 overflow-x-hidden">
              <div className="mx-auto max-w-6xl w-full">{children}</div>
            </main>
          </div>
        </CrmProvider>
      </body>
    </html>
  );
}
