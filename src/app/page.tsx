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
          <DashboardCard title="Total Students" value="Loading..." />
          <DashboardCard title="Paid Students" value="Loading..." />
          <DashboardCard title="Pending Students" value="Loading..." />
          <DashboardCard title="Revenue Collected" value="Loading..." />
          <DashboardCard title="Revenue Pending" value="Loading..." />
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
        <DashboardCard title="Total Students" value={totalStudents.toString()} />
        <DashboardCard title="Paid Students" value={paidStudents.toString()} />
        <DashboardCard title="Pending Students" value={pendingStudents.toString()} />
        <DashboardCard title="Revenue Collected" value={`Rs ${revenueCollected.toLocaleString()}`} />
        <DashboardCard title="Revenue Pending" value={`Rs ${revenuePending.toLocaleString()}`} />
      </section>
    </>
  );
}

export default function Page(): JSX.Element {
  return <DashboardContent />;
}

