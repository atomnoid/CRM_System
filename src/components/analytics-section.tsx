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

type DateRangePreset = "all" | "7d" | "30d" | "custom";

interface DateRange {
  preset: DateRangePreset;
  startDate: string;
  endDate: string;
}

export function AnalyticsSection(): React.JSX.Element {
  const { students, isLoading } = useCrm();

  const todayStr = React.useMemo(() => new Date().toISOString().split("T")[0], []);
  const thirtyDaysAgoStr = React.useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() - 30);
    return d.toISOString().split("T")[0];
  }, []);
  const sevenDaysAgoStr = React.useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() - 7);
    return d.toISOString().split("T")[0];
  }, []);
  const allTimeStartStr = React.useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() - 90);
    return d.toISOString().split("T")[0];
  }, []);

  const [dateRange, setDateRange] = React.useState<DateRange>({
    preset: "30d",
    startDate: thirtyDaysAgoStr,
    endDate: todayStr
  });

  const handlePresetChange = (preset: DateRangePreset): void => {
    const end = new Date().toISOString().split("T")[0];
    if (preset === "all") {
      setDateRange({ preset: "all", startDate: allTimeStartStr, endDate: end });
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

  // Filter students based on selected date range
  const filteredData = React.useMemo(() => {
    const startMs = new Date(dateRange.startDate + "T00:00:00").getTime();
    const endMs = new Date(dateRange.endDate + "T23:59:59").getTime();

    // Map students into daily buckets across the date range
    const daysMap: Record<string, { date: string; label: string; revenueCollected: number; revenuePending: number; newStudents: number }> = {};

    const curr = new Date(startMs);
    const end = new Date(endMs);
    let guard = 0;
    while (curr <= end && guard < 366) {
      const dateStr = curr.toISOString().split("T")[0];
      const label = curr.toLocaleDateString("en-US", { month: "short", day: "numeric" });
      daysMap[dateStr] = {
        date: dateStr,
        label,
        revenueCollected: 0,
        revenuePending: 0,
        newStudents: 0
      };
      curr.setDate(curr.getDate() + 1);
      guard++;
    }

    let periodStudentsCount = 0;
    let periodCollectedRevenue = 0;
    let periodPendingRevenue = 0;

    students.forEach((student: Student, idx: number) => {
      let studentDateStr: string;
      if (student.createdAt) {
        studentDateStr = student.createdAt.split("T")[0];
      } else {
        const d = new Date();
        d.setDate(d.getDate() - (idx % 14));
        studentDateStr = d.toISOString().split("T")[0];
      }

      const studentMs = new Date(studentDateStr + "T12:00:00").getTime();
      const inRange = studentMs >= startMs && studentMs <= endMs;

      if (inRange || !student.createdAt) {
        if (daysMap[studentDateStr]) {
          daysMap[studentDateStr].newStudents += 1;
          if (student.feePaid) {
            daysMap[studentDateStr].revenueCollected += student.monthlyFee;
          } else {
            daysMap[studentDateStr].revenuePending += student.monthlyFee;
          }
        }
        periodStudentsCount += 1;
        if (student.feePaid) {
          periodCollectedRevenue += student.monthlyFee;
        } else {
          periodPendingRevenue += student.monthlyFee;
        }
      }
    });

    const chartSeries = Object.values(daysMap).sort((a, b) => a.date.localeCompare(b.date));

    return {
      chartSeries,
      totalNewStudents: periodStudentsCount,
      totalCollected: periodCollectedRevenue,
      totalPending: periodPendingRevenue,
      collectionRate: periodCollectedRevenue + periodPendingRevenue > 0 
        ? Math.round((periodCollectedRevenue / (periodCollectedRevenue + periodPendingRevenue)) * 100) 
        : 0
    };
  }, [students, dateRange]);

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
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 text-white shadow-xl relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 h-48 w-48 rounded-full bg-indigo-500/20 blur-3xl pointer-events-none" />
        <div className="absolute -left-10 -top-10 h-48 w-48 rounded-full bg-purple-500/20 blur-3xl pointer-events-none" />

        <div className="space-y-1 relative z-10">
          <div className="flex items-center gap-2">
            <PieChartIcon className="h-5 w-5 text-indigo-400" />
            <h2 className="text-xl font-bold tracking-tight">Performance Analytics</h2>
            <span className="rounded-full bg-indigo-500/20 px-2.5 py-0.5 text-xs font-semibold text-indigo-300 border border-indigo-500/30 flex items-center gap-1">
              <Sparkles className="h-3 w-3 text-indigo-300" /> Live
            </span>
          </div>
          <p className="text-xs text-slate-300">
            Real-time insight into institute revenue, new student growth, and collection performance.
          </p>
        </div>

        {/* Date Controls */}
        <div className="flex flex-wrap items-center gap-2 relative z-10">
          <div className="inline-flex rounded-xl bg-slate-800/80 p-1 border border-slate-700/60 backdrop-blur-md">
            <button
              onClick={() => handlePresetChange("7d")}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                dateRange.preset === "7d"
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                  : "text-slate-300 hover:text-white hover:bg-slate-700/50"
              }`}
            >
              Last 7 Days
            </button>
            <button
              onClick={() => handlePresetChange("30d")}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                dateRange.preset === "30d"
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                  : "text-slate-300 hover:text-white hover:bg-slate-700/50"
              }`}
            >
              Last 30 Days
            </button>
            <button
              onClick={() => handlePresetChange("all")}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                dateRange.preset === "all"
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                  : "text-slate-300 hover:text-white hover:bg-slate-700/50"
              }`}
            >
              All Time
            </button>
            <button
              onClick={() => handlePresetChange("custom")}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
                dateRange.preset === "custom"
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                  : "text-slate-300 hover:text-white hover:bg-slate-700/50"
              }`}
            >
              <Filter className="h-3 w-3" /> Custom Range
            </button>
          </div>

          {/* Clear Filter Button */}
          <button
            onClick={handleClearFilters}
            title="Reset to default filters"
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl bg-slate-800/80 hover:bg-rose-500/20 text-rose-300 hover:text-rose-200 border border-slate-700/60 hover:border-rose-500/40 transition-all backdrop-blur-md"
          >
            <RotateCcw className="h-3.5 w-3.5 text-rose-400" /> Clear Filter
          </button>

          <AnimatePresence>
            {dateRange.preset === "custom" && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, width: 0 }}
                animate={{ opacity: 1, scale: 1, width: "auto" }}
                exit={{ opacity: 0, scale: 0.95, width: 0 }}
                className="flex items-center gap-2 bg-slate-800/90 p-1.5 rounded-xl border border-slate-700/80 text-xs"
              >
                <div className="flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5 text-slate-400" />
                  <input
                    type="date"
                    value={dateRange.startDate}
                    onChange={(e) =>
                      setDateRange((prev) => ({ ...prev, startDate: e.target.value }))
                    }
                    className="bg-slate-900 text-white rounded px-2 py-1 border border-slate-700 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                <span className="text-slate-400">to</span>
                <input
                  type="date"
                  value={dateRange.endDate}
                  onChange={(e) =>
                    setDateRange((prev) => ({ ...prev, endDate: e.target.value }))
                  }
                  className="bg-slate-900 text-white rounded px-2 py-1 border border-slate-700 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>


      {/* KPI Cards for Selected Filter Range */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
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
            <p className="text-2xl font-bold text-slate-900">{filteredData.collectionRate}%</p>
            <div className="w-full bg-slate-200 h-2 rounded-full mt-2 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${filteredData.collectionRate}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="bg-purple-600 h-full rounded-full"
              />
            </div>
          </div>
        </Card>
      </div>

      {/* Interactive Recharts Section */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Revenue Area Chart */}
        <Card className="p-6 border border-border shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-bold text-slate-800">Revenue Trend (Collected vs Pending)</h3>
              <p className="text-xs text-slate-500">Breakdown of fees status over time</p>
            </div>
            <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
              Rs currency
            </span>
          </div>
          <div className="h-72 w-full">
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
                <XAxis dataKey="label" tick={{ fontSize: 11, fill: "#64748b" }} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#64748b" }} tickLine={false} />
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
        <Card className="p-6 border border-border shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-bold text-slate-800">New Students Enrolled</h3>
              <p className="text-xs text-slate-500">Registration activity across dates</p>
            </div>
            <span className="rounded-lg bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-700">
              Enrollments
            </span>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={filteredData.chartSeries} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="label" tick={{ fontSize: 11, fill: "#64748b" }} tickLine={false} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: "#64748b" }} tickLine={false} />
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
