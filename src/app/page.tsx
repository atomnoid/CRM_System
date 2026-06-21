"use client";

import type { JSX } from "react";
import { Header } from "@/components/header";
import { DashboardCard } from "@/components/dashboard-card";
import { useCrm } from "@/components/crm-provider";

function DashboardContent(): JSX.Element {
  const { students, isLoading } = useCrm();

  if (isLoading) {
    return (
      <>
        <Header title="Dashboard" description="Overview of your coaching institute metrics." />
        <section className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <DashboardCard title="Total Students" value="Loading..." tone="total" />
          <DashboardCard title="Paid Students" value="Loading..." tone="paid" />
          <DashboardCard title="Pending Students" value="Loading..." tone="pending" />
          <DashboardCard title="Revenue Collected" value="Loading..." tone="revenue" />
          <DashboardCard title="Revenue Pending" value="Loading..." tone="pending-revenue" />
        </section>
      </>
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
    <>
      <Header title="Dashboard" description="Overview of your coaching institute metrics." />
      <section className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <DashboardCard title="Total Students" value={totalStudents.toString()} tone="total" />
        <DashboardCard title="Paid Students" value={paidStudents.toString()} tone="paid" />
        <DashboardCard title="Pending Students" value={pendingStudents.toString()} tone="pending" />
        <DashboardCard title="Revenue Collected" value={`Rs ${revenueCollected.toLocaleString()}`} tone="revenue" />
        <DashboardCard title="Revenue Pending" value={`Rs ${revenuePending.toLocaleString()}`} tone="pending-revenue" />
      </section>
    </>
  );
}

export default function Page(): JSX.Element {
  return <DashboardContent />;
}

