import type { JSX } from "react";
import { Card } from "@/components/ui/card";
import { GraduationCap, UserCheck, AlertCircle, Coins, CreditCard } from "lucide-react";
import { cn } from "@/lib/utils";

export type DashboardCardTone = "total" | "paid" | "pending" | "revenue" | "pending-revenue";

interface DashboardCardProps {
  title: string;
  value: string;
  tone?: DashboardCardTone;
}

const toneConfig = {
  total: {
    icon: GraduationCap,
    bgColor: "bg-indigo-50",
    iconColor: "text-indigo-600 border-indigo-100",
    borderColor: "hover:border-indigo-200"
  },
  paid: {
    icon: UserCheck,
    bgColor: "bg-emerald-50",
    iconColor: "text-emerald-600 border-emerald-100",
    borderColor: "hover:border-emerald-200"
  },
  pending: {
    icon: AlertCircle,
    bgColor: "bg-amber-50",
    iconColor: "text-amber-600 border-amber-100",
    borderColor: "hover:border-amber-200"
  },
  revenue: {
    icon: Coins,
    bgColor: "bg-purple-50",
    iconColor: "text-purple-600 border-purple-100",
    borderColor: "hover:border-purple-200"
  },
  "pending-revenue": {
    icon: CreditCard,
    bgColor: "bg-rose-50",
    iconColor: "text-rose-600 border-rose-100",
    borderColor: "hover:border-rose-200"
  }
};

export function DashboardCard({ title, value, tone = "total" }: DashboardCardProps): JSX.Element {
  const config = toneConfig[tone];
  const Icon = config.icon;

  return (
    <Card className={cn("transition-all duration-300 hover:-translate-y-1 hover:shadow-md border border-border/80 flex items-center justify-between gap-4 p-5", config.borderColor)}>
      <div className="space-y-1">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{title}</p>
        <p className="text-2xl font-bold tracking-tight text-unicorn-primary">{value}</p>
      </div>
      <div className={cn("flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border", config.bgColor, config.iconColor)}>
        <Icon className="h-6 w-6" />
      </div>
    </Card>
  );
}
