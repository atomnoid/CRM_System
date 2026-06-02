import type { Metadata } from "next";
import type { JSX, ReactNode } from "react";
import "./globals.css";
import { Sidebar } from "@/components/layout/sidebar";
import { CrmProvider } from "@/components/crm-provider";

export const metadata: Metadata = {
  title: "Unicorn CRM",
  description: "Modern coaching CRM dashboard"
};

export default function RootLayout({ children }: { children: ReactNode }): JSX.Element {
  return (
    <html lang="en">
      <body>
        <CrmProvider>
          <div className="flex min-h-screen bg-[#f5f3ff]">
            <Sidebar />
            <main className="flex-1 p-4 md:p-8">
              <div className="mx-auto max-w-6xl">{children}</div>
            </main>
          </div>
        </CrmProvider>
      </body>
    </html>
  );
}
