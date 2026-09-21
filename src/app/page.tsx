"use client";

import type { JSX } from "react";
import { motion } from "framer-motion";
import { Header } from "@/components/header";
import { DashboardCard } from "@/components/dashboard-card";
import { QuickActions } from "@/components/quick-actions";
import { AnalyticsSection } from "@/components/analytics-section";
import { useCrm } from "@/components/crm-provider";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" as const } }
};

function DashboardContent(): JSX.Element {
  const { students, isLoading } = useCrm();

  if (isLoading) {
    return (
      <div className="space-y-8">
        <Header title="Dashboard" description="Overview of your coaching institute metrics." />
        <section className="grid grid-cols-2 gap-3 sm:gap-4 sm:grid-cols-3 lg:grid-cols-5">
          <DashboardCard title="Total Students" value="Loading..." tone="total" />
          <DashboardCard title="Paid Students" value="Loading..." tone="paid" />
          <DashboardCard title="Pending Students" value="Loading..." tone="pending" />
          <DashboardCard title="Revenue Collected" value="Loading..." tone="revenue" />
          <DashboardCard title="Revenue Pending" value="Loading..." tone="pending-revenue" />
        </section>
      </div>
    );
  }

  const totalStudents = students.length;
  const paidStudents = students.filter((s) => s.feePaid).length;
  const pendingStudents = totalStudents - paidStudents;
  const revenueCollected = students
    .filter((s) => s.feePaid)
    .reduce((sum, s) => sum + s.monthlyFee, 0);
  const revenuePending = students
    .filter((s) => !s.feePaid)
    .reduce((sum, s) => sum + s.monthlyFee, 0);

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8 pb-10"
    >
      <motion.div variants={itemVariants}>
        <Header title="Dashboard Overview" description="Overview of your coaching institute metrics and financial health." />
      </motion.div>

      <motion.section variants={itemVariants} className="grid grid-cols-2 gap-3 sm:gap-4 sm:grid-cols-3 lg:grid-cols-5">
        <DashboardCard title="Total Students" value={totalStudents.toString()} tone="total" />
        <DashboardCard title="Paid Students" value={paidStudents.toString()} tone="paid" />
        <DashboardCard title="Pending Students" value={pendingStudents.toString()} tone="pending" />
        <DashboardCard title="Revenue Collected" value={`Rs ${revenueCollected.toLocaleString()}`} tone="revenue" />
        <DashboardCard title="Revenue Pending" value={`Rs ${revenuePending.toLocaleString()}`} tone="pending-revenue" />
      </motion.section>

      <motion.div variants={itemVariants}>
        <QuickActions />
      </motion.div>

      <motion.div variants={itemVariants}>
        <AnalyticsSection />
      </motion.div>
    </motion.div>
  );
}


export default function Page(): JSX.Element {
  return <DashboardContent />;
}


