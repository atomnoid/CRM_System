"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

interface DialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export function Dialog({ open, onClose, title, children }: DialogProps): React.JSX.Element | null {
  // Lock body scroll when open
  React.useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/50 backdrop-blur-sm transition-all duration-300 p-0 sm:p-4">
      {/* On mobile: sheet slides from bottom. On sm+: centered modal */}
      <div
        className={cn(
          "w-full bg-white shadow-2xl transition-all",
          // Mobile: full-width bottom sheet with rounded top corners
          "rounded-t-3xl sm:rounded-2xl",
          // Desktop: max-width centered modal
          "sm:max-w-md",
          // Max height with scroll
          "max-h-[90dvh] overflow-y-auto"
        )}
      >
        {/* Drag handle indicator for mobile bottom sheet */}
        <div className="flex justify-center pt-3 pb-1 sm:hidden">
          <div className="h-1 w-10 rounded-full bg-slate-200" />
        </div>

        <div className="px-5 pb-5 pt-3 sm:p-6">
          <div className="mb-5 flex items-center justify-between">
            <h3 className="text-lg font-bold tracking-tight text-unicorn-primary">{title}</h3>
            <button
              className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 focus:outline-none"
              onClick={onClose}
              type="button"
              aria-label="Close dialog"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
