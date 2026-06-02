import type { JSX } from "react";
import { Header } from "@/components/header";
import { StudentTable } from "@/components/student-table";

export default function StudentsPage(): JSX.Element {
  return (
    <>
      <Header title="Students" description="Manage student records and fee status." />
      <StudentTable />
    </>
  );
}
