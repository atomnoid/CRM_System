import type { JSX } from "react";
import { Header } from "@/components/header";
import { TeacherTable } from "@/components/teacher-table";

export default function TeachersPage(): JSX.Element {
  return (
    <>
      <Header title="Teachers" description="Manage teacher records and salaries." />
      <TeacherTable />
    </>
  );
}
