import * as React from "react";
import { cn } from "@/lib/utils";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  tone?: "paid" | "pending";
}

export function Badge({ className, tone = "pending", ...props }: BadgeProps): React.JSX.Element {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium",
        tone === "paid" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700",
        className
      )}
      {...props}
    />
  );
}
