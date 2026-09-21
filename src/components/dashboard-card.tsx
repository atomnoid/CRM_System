import type { JSX } from "react";
import { motion } from "framer-motion";
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
    bgColor: "bg-indigo-50/80 text-indigo-600 border-indigo-100",
    gradient: "hover:bg-gradient-to-br hover:from-white hover:to-indigo-50/30",
    borderColor: "hover:border-indigo-300"
  },
  paid: {
    icon: UserCheck,
    bgColor: "bg-emerald-50/80 text-emerald-600 border-emerald-100",
    gradient: "hover:bg-gradient-to-br hover:from-white hover:to-emerald-50/30",
    borderColor: "hover:border-emerald-300"
  },
  pending: {
    icon: AlertCircle,
    bgColor: "bg-amber-50/80 text-amber-600 border-amber-100",
    gradient: "hover:bg-gradient-to-br hover:from-white hover:to-amber-50/30",
    borderColor: "hover:border-amber-300"
  },
  revenue: {
    icon: Coins,
    bgColor: "bg-purple-50/80 text-purple-600 border-purple-100",
    gradient: "hover:bg-gradient-to-br hover:from-white hover:to-purple-50/30",
    borderColor: "hover:border-purple-300"
  },
  "pending-revenue": {
    icon: CreditCard,
    bgColor: "bg-rose-50/80 text-rose-600 border-rose-100",
    gradient: "hover:bg-gradient-to-br hover:from-white hover:to-rose-50/30",
    borderColor: "hover:border-rose-300"
  }
};

export function DashboardCard({ title, value, tone = "total" }: DashboardCardProps): JSX.Element {
  const config = toneConfig[tone];
  const Icon = config.icon;

  return (
    <motion.div whileHover={{ y: -4, scale: 1.01 }} whileTap={{ scale: 0.98 }} transition={{ duration: 0.2 }}>
      <Card className={cn(
        "transition-all duration-300 hover:shadow-lg border border-border/80 flex items-center justify-between gap-4 p-5 cursor-pointer backdrop-blur-sm",
        config.borderColor,
        config.gradient
      )}>
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{title}</p>
          <p className="text-2xl font-bold tracking-tight text-unicorn-primary">{value}</p>
        </div>
        <div className={cn("flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border shadow-sm transition-transform hover:scale-110", config.bgColor)}>
          <Icon className="h-6 w-6" />
        </div>
      </Card>
    </motion.div>
  );
}

