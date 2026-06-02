"use client";

import * as React from "react";
import { initialStudents, initialTeachers } from "@/lib/mock-data";
import type { Student, Teacher } from "@/types";

interface StudentInput {
  name: string;
  class: string;
  monthlyFee: number;
  feePaid: boolean;
}

interface TeacherInput {
  name: string;
  subject: string;
  monthlySalary: number;
}

interface CrmContextValue {
  students: Student[];
  teachers: Teacher[];
  addStudent: (input: StudentInput) => void;
  updateStudent: (id: string, input: StudentInput) => void;
  deleteStudent: (id: string) => void;
  toggleStudentFeeStatus: (id: string) => void;
  addTeacher: (input: TeacherInput) => void;
  updateTeacher: (id: string, input: TeacherInput) => void;
  deleteTeacher: (id: string) => void;
}

const CrmContext = React.createContext<CrmContextValue | undefined>(undefined);

export function CrmProvider({ children }: { children: React.ReactNode }): React.JSX.Element {
  const [students, setStudents] = React.useState<Student[]>(initialStudents);
  const [teachers, setTeachers] = React.useState<Teacher[]>(initialTeachers);

  const addStudent = (input: StudentInput): void => {
    setStudents((prev) => [...prev, { ...input, id: crypto.randomUUID() }]);
  };

  const updateStudent = (id: string, input: StudentInput): void => {
    setStudents((prev) => prev.map((student) => (student.id === id ? { ...student, ...input } : student)));
  };

  const deleteStudent = (id: string): void => {
    setStudents((prev) => prev.filter((student) => student.id !== id));
  };

  const toggleStudentFeeStatus = (id: string): void => {
    setStudents((prev) =>
      prev.map((student) => (student.id === id ? { ...student, feePaid: !student.feePaid } : student))
    );
  };

  const addTeacher = (input: TeacherInput): void => {
    setTeachers((prev) => [...prev, { ...input, id: crypto.randomUUID() }]);
  };

  const updateTeacher = (id: string, input: TeacherInput): void => {
    setTeachers((prev) => prev.map((teacher) => (teacher.id === id ? { ...teacher, ...input } : teacher)));
  };

  const deleteTeacher = (id: string): void => {
    setTeachers((prev) => prev.filter((teacher) => teacher.id !== id));
  };

  return (
    <CrmContext.Provider
      value={{
        students,
        teachers,
        addStudent,
        updateStudent,
        deleteStudent,
        toggleStudentFeeStatus,
        addTeacher,
        updateTeacher,
        deleteTeacher
      }}
    >
      {children}
    </CrmContext.Provider>
  );
}

export function useCrm(): CrmContextValue {
  const context = React.useContext(CrmContext);
  if (!context) {
    throw new Error("useCrm must be used within CrmProvider");
  }
  return context;
}
