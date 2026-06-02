import type { JSX } from "react";
import { Card } from "@/components/ui/card";

interface DashboardCardProps {
  title: string;
  value: string;
}

export function DashboardCard({ title, value }: DashboardCardProps): JSX.Element {
  return (
    <Card>
      <p className="text-sm text-slate-600">{title}</p>
      <p className="mt-2 text-2xl font-semibold text-unicorn-primary">{value}</p>
    </Card>
  );
}
