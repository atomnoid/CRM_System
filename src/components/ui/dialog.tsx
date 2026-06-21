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
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 transition-all duration-300">
      <div className="w-full max-w-md rounded-2xl border border-border bg-white p-6 shadow-2xl transition-all transform scale-100">
        <div className="mb-5 flex items-center justify-between">
          <h3 className="text-lg font-bold tracking-tight text-unicorn-primary">{title}</h3>
          <button
            className={cn(
              "rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-unicorn-muted hover:text-unicorn-primary focus:outline-none"
            )}
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
  );
}
