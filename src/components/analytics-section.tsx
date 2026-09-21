"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts";
import {
  Calendar,
  TrendingUp,
  UserPlus,
  IndianRupee,
  PieChart as PieChartIcon,
  Filter,
  ArrowUpRight,
  Sparkles,
  RotateCcw,
  XCircle
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { useCrm } from "@/components/crm-provider";
import type { Student } from "@/types";

type DateRangePreset = "all" | "30d" | "7d" | "custom";

interface DateRange {
  preset: DateRangePreset;
  startDate: string;
  endDate: string;
}

export function AnalyticsSection(): React.JSX.Element {
  const { students, isLoading } = useCrm();

  const formatDateToLocalKey = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const todayStr = React.useMemo(() => formatDateToLocalKey(new Date()), []);
  const thirtyDaysAgoStr = React.useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() - 30);
    return formatDateToLocalKey(d);
  }, []);
  const sevenDaysAgoStr = React.useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() - 7);
    return formatDateToLocalKey(d);
  }, []);

  const [dateRange, setDateRange] = React.useState<DateRange>({
    preset: "30d",
    startDate: thirtyDaysAgoStr,
    endDate: todayStr
  });

  const handlePresetChange = (preset: DateRangePreset): void => {
    const end = new Date().toISOString().split("T")[0];
    if (preset === "all") {
      setDateRange({ preset: "all", startDate: "2024-01-01", endDate: end });
    } else if (preset === "7d") {
      setDateRange({ preset: "7d", startDate: sevenDaysAgoStr, endDate: end });
    } else if (preset === "30d") {
      setDateRange({ preset: "30d", startDate: thirtyDaysAgoStr, endDate: end });
    } else {
      setDateRange((prev) => ({ ...prev, preset: "custom" }));
    }
  };

  const handleClearFilters = (): void => {
    setDateRange({
      preset: "30d",
      startDate: thirtyDaysAgoStr,
      endDate: todayStr
    });
  };

  // Process chart & analytics data accurately by exact student creation date
  const filteredData = React.useMemo(() => {
    // 1. Overall Totals
    let totalCollected = 0;
    let totalPending = 0;
    let paidStudentsCount = 0;
    let pendingStudentsCount = 0;

    students.forEach((student: Student) => {
      if (student.feePaid) {
        totalCollected += student.monthlyFee;
        paidStudentsCount += 1;
      } else {
        totalPending += student.monthlyFee;
        pendingStudentsCount += 1;
      }
    });

    const totalStudentsCount = students.length;
    const collectionRate =
      totalCollected + totalPending > 0
        ? Math.round((totalCollected / (totalCollected + totalPending)) * 100)
        : 0;

    // 2. Timeline Series for Charts based on Selected Date Range
    const isAllTime = dateRange.preset === "all";
    // Parse dates as local midnight to avoid UTC offset issues
    const [sy, sm, sd] = dateRange.startDate.split("-").map(Number);
    const [ey, em, ed] = dateRange.endDate.split("-").map(Number);
    const startLocal = new Date(sy, sm - 1, sd, 0, 0, 0);
    const endLocal = new Date(ey, em - 1, ed, 23, 59, 59);
    const startMs = startLocal.getTime();
    const endMs = endLocal.getTime();

    const daysMap: Record<
      string,
      { key: string; label: string; revenueCollected: number; revenuePending: number; newStudents: number }
    > = {};

    // Build map using LOCAL calendar dates so keys match student local dates
    const curr = new Date(startLocal);
    let guard = 0;
    while (curr.getTime() <= endLocal.getTime() && guard < 366) {
      const dateStr = formatDateToLocalKey(curr);
      const label = curr.toLocaleDateString("en-US", { month: "short", day: "numeric" });
      daysMap[dateStr] = {
        key: dateStr,
        label,
        revenueCollected: 0,
        revenuePending: 0,
        newStudents: 0
      };
      curr.setDate(curr.getDate() + 1);
      guard++;
    }

    let newStudentsInWindow = 0;

    students.forEach((student: Student) => {
      // Convert stored timestamps to LOCAL calendar date strings
      const studentCreatedDateStr = student.createdAt
        ? formatDateToLocalKey(new Date(student.createdAt))
        : todayStr;

      // For "paid" status date:
      // - If paidAt was injected this session (just toggled) → use that exact date
      // - If loaded from DB with no paidAt → use createdAt as the best known date
      // This prevents ALL historical paid fees from piling onto today's date
      const studentPaidDateStr = (student.paidAt && student.feePaid)
        ? formatDateToLocalKey(new Date(student.paidAt))
        : studentCreatedDateStr;  // Always fall back to creation date, never to todayStr

      // Count new students enrolled in window
      const [cY, cM, cD] = studentCreatedDateStr.split("-").map(Number);
      const createdLocalMs = new Date(cY, cM - 1, cD, 12, 0, 0).getTime();
      const inCreatedRange = isAllTime || (createdLocalMs >= startMs && createdLocalMs <= endMs);
      if (inCreatedRange) {
        newStudentsInWindow += 1;
      }

      // Map new student enrollment to their creation date in chart (enrollment chart - don't touch)
      if (daysMap[studentCreatedDateStr]) {
        daysMap[studentCreatedDateStr].newStudents += 1;
      }

      // Map revenue: paid students show on their exact paid date, pending on creation date
      // Only count revenue if the target date is within the active chart window
      if (student.feePaid) {
        if (daysMap[studentPaidDateStr]) {
          daysMap[studentPaidDateStr].revenueCollected += student.monthlyFee;
        }
        // If paid date is outside chart window, don't force it onto today - skip it
      } else {
        if (daysMap[studentCreatedDateStr]) {
          daysMap[studentCreatedDateStr].revenuePending += student.monthlyFee;
        }
      }
    });

    const chartSeries = Object.keys(daysMap)
      .sort()
      .map((k) => daysMap[k]);

    return {
      chartSeries,
      totalNewStudents: isAllTime ? totalStudentsCount : newStudentsInWindow,
      totalCollected,
      totalPending,
      collectionRate,
      paidStudentsCount,
      pendingStudentsCount,
      totalStudentsCount
    };
  }, [students, dateRange, todayStr]);




  if (isLoading) {
    return (
      <Card className="p-8 text-center text-slate-400">
        <div className="flex items-center justify-center gap-2">
          <Sparkles className="h-5 w-5 animate-spin text-indigo-500" />
          <span>Loading analytics engine...</span>
        </div>
      </Card>
    );
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="space-y-6"
    >
      {/* Header & Date Filtering Toolbar */}
      <div className="flex flex-col gap-3 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-4 sm:p-6 text-white shadow-xl relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 h-48 w-48 rounded-full bg-indigo-500/20 blur-3xl pointer-events-none" />
        <div className="absolute -left-10 -top-10 h-48 w-48 rounded-full bg-purple-500/20 blur-3xl pointer-events-none" />

        <div className="space-y-1 relative z-10">
          <div className="flex items-center gap-2">
            <PieChartIcon className="h-4 w-4 text-indigo-400" />
            <h2 className="text-base sm:text-xl font-bold tracking-tight">Performance Analytics</h2>
            <span className="rounded-full bg-indigo-500/20 px-2 py-0.5 text-[10px] sm:text-xs font-semibold text-indigo-300 border border-indigo-500/30 flex items-center gap-1">
              <Sparkles className="h-2.5 w-2.5 text-indigo-300" /> Live
            </span>
          </div>
          <p className="text-[11px] sm:text-xs text-slate-400 hidden sm:block">
            Real-time insight into institute revenue, new student growth, and collection performance.
          </p>
        </div>

        {/* Date Controls — horizontally scrollable on mobile */}
        <div className="flex items-center gap-2 relative z-10 overflow-x-auto pb-0.5 scrollbar-none -mx-1 px-1">
          <div className="inline-flex shrink-0 rounded-xl bg-slate-800/80 p-1 border border-slate-700/60 backdrop-blur-md">
            {(["7d", "30d", "all", "custom"] as const).map((preset) => (
              <button
                key={preset}
                onClick={() => handlePresetChange(preset)}
                className={`px-2.5 py-1.5 text-[11px] sm:text-xs font-semibold rounded-lg transition-all whitespace-nowrap flex items-center gap-1 ${
                  dateRange.preset === preset
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                    : "text-slate-300 hover:text-white hover:bg-slate-700/50"
                }`}
              >
                {preset === "custom" && <Filter className="h-2.5 w-2.5" />}
                {preset === "7d" ? "7D" : preset === "30d" ? "30D" : preset === "all" ? "All" : "Custom"}
              </button>
            ))}
          </div>

          {/* Clear Filter */}
          <button
            onClick={handleClearFilters}
            title="Reset to default filters"
            className="shrink-0 flex items-center gap-1 px-2.5 py-1.5 text-[11px] sm:text-xs font-semibold rounded-xl bg-slate-800/80 hover:bg-rose-500/20 text-rose-300 border border-slate-700/60 transition-all"
          >
            <RotateCcw className="h-3 w-3 text-rose-400" />
            <span className="hidden sm:inline">Clear</span>
          </button>
        </div>

        {/* Custom date range picker — stacks below on mobile */}
        <AnimatePresence>
          {dateRange.preset === "custom" && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="flex flex-wrap items-center gap-2 bg-slate-800/80 p-2.5 rounded-xl border border-slate-700/60 text-xs relative z-10 mt-1"
            >
              <Calendar className="h-3.5 w-3.5 text-slate-400 shrink-0" />
              <input
                type="date"
                value={dateRange.startDate}
                onChange={(e) => setDateRange((prev) => ({ ...prev, startDate: e.target.value }))}
                className="flex-1 min-w-0 bg-slate-900 text-white rounded-lg px-2.5 py-1.5 border border-slate-700 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
              <span className="text-slate-400">→</span>
              <input
                type="date"
                value={dateRange.endDate}
                onChange={(e) => setDateRange((prev) => ({ ...prev, endDate: e.target.value }))}
                className="flex-1 min-w-0 bg-slate-900 text-white rounded-lg px-2.5 py-1.5 border border-slate-700 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>


      {/* KPI Cards — 2-col on mobile, 4-col on desktop */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        <Card className="p-5 border border-emerald-100 bg-gradient-to-br from-emerald-50/50 via-white to-emerald-50/20 hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wider text-emerald-700">Period Collected</p>
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
              <IndianRupee className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-2xl font-bold text-slate-900">
              Rs {filteredData.totalCollected.toLocaleString()}
            </p>
            <p className="text-xs text-emerald-600 font-medium mt-1 flex items-center gap-1">
              <ArrowUpRight className="h-3.5 w-3.5" /> Received fees in date range
            </p>
          </div>
        </Card>

        <Card className="p-5 border border-amber-100 bg-gradient-to-br from-amber-50/50 via-white to-amber-50/20 hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wider text-amber-700">Period Pending</p>
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-100 text-amber-700">
              <TrendingUp className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-2xl font-bold text-slate-900">
              Rs {filteredData.totalPending.toLocaleString()}
            </p>
            <p className="text-xs text-amber-600 font-medium mt-1">
              Outstanding fees in range
            </p>
          </div>
        </Card>

        <Card className="p-5 border border-indigo-100 bg-gradient-to-br from-indigo-50/50 via-white to-indigo-50/20 hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wider text-indigo-700">New Students</p>
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-100 text-indigo-700">
              <UserPlus className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-2xl font-bold text-slate-900">{filteredData.totalNewStudents}</p>
            <p className="text-xs text-indigo-600 font-medium mt-1">
              Enrolled in selected timeframe
            </p>
          </div>
        </Card>

        <Card className="p-5 border border-purple-100 bg-gradient-to-br from-purple-50/50 via-white to-purple-50/20 hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wider text-purple-700">Collection Rate</p>
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-purple-100 text-purple-700">
              <PieChartIcon className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline justify-between">
              <p className="text-2xl font-bold text-slate-900">{filteredData.collectionRate}%</p>
              <span className="text-[10px] text-purple-600 font-semibold bg-purple-50 px-1.5 py-0.5 rounded border border-purple-200">
                Collected / Total
              </span>
            </div>
            <div className="w-full bg-slate-200 h-2 rounded-full mt-2 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${filteredData.collectionRate}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="bg-purple-600 h-full rounded-full"
              />
            </div>
            <p className="text-[11px] text-slate-500 font-medium mt-1.5">
              Rs {filteredData.totalCollected.toLocaleString()} of Rs {(filteredData.totalCollected + filteredData.totalPending).toLocaleString()}
            </p>
          </div>
        </Card>
      </div>

      {/* Interactive Recharts Section */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Revenue Area Chart */}
        <Card className="p-4 sm:p-6 border border-border shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-bold text-slate-800">Revenue Trend (Collected vs Pending)</h3>
              <p className="text-xs text-slate-500">Breakdown of fees status over time</p>
            </div>
            <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
              Rs currency
            </span>
          </div>
          <div className="h-52 sm:h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={filteredData.chartSeries} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorCollected" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorPending" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="label" tick={{ fontSize: 9, fill: "#94a3b8" }} tickLine={false} interval="preserveStartEnd" />
                <YAxis tick={{ fontSize: 10, fill: "#64748b" }} tickLine={false} width={40} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0f172a",
                    borderColor: "#334155",
                    borderRadius: "12px",
                    color: "#fff",
                    boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.3)"
                  }}
                  itemStyle={{ color: "#fff" }}
                  formatter={(value: any) => [`Rs ${Number(value).toLocaleString()}`, ""]}
                />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: "10px", fontSize: "12px" }} />
                <Area
                  type="monotone"
                  dataKey="revenueCollected"
                  name="Collected Revenue"
                  stroke="#10b981"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#colorCollected)"
                />
                <Area
                  type="monotone"
                  dataKey="revenuePending"
                  name="Pending Revenue"
                  stroke="#f59e0b"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorPending)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* New Students Bar Chart */}
        <Card className="p-4 sm:p-6 border border-border shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-bold text-slate-800">New Students Enrolled</h3>
              <p className="text-xs text-slate-500">Registration activity across dates</p>
            </div>
            <span className="rounded-lg bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-700">
              Enrollments
            </span>
          </div>
          <div className="h-52 sm:h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={filteredData.chartSeries} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="label" tick={{ fontSize: 9, fill: "#94a3b8" }} tickLine={false} interval="preserveStartEnd" />
                <YAxis allowDecimals={false} tick={{ fontSize: 10, fill: "#64748b" }} tickLine={false} width={30} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0f172a",
                    borderColor: "#334155",
                    borderRadius: "12px",
                    color: "#fff",
                    boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.3)"
                  }}
                  formatter={(value: any) => [`${value} Students`, "New Registrations"]}
                />
                <Bar
                  dataKey="newStudents"
                  name="New Students"
                  fill="#6366f1"
                  radius={[6, 6, 0, 0]}
                  barSize={20}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </motion.section>
  );
}
