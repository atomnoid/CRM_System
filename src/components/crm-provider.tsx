"use client";

import * as React from "react";
import {
  getStudents,
  createStudent,
  updateStudent,
  deleteStudent,
  toggleStudentFeeStatus,
  getTeachers,
  createTeacher,
  updateTeacher,
  deleteTeacher,
} from "@/lib/api-client";
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
  addStudent: (input: StudentInput) => Promise<void>;
  updateStudent: (id: string, input: StudentInput) => Promise<void>;
  deleteStudent: (id: string) => Promise<void>;
  toggleStudentFeeStatus: (id: string) => Promise<void>;
  addTeacher: (input: TeacherInput) => Promise<void>;
  updateTeacher: (id: string, input: TeacherInput) => Promise<void>;
  deleteTeacher: (id: string) => Promise<void>;
  isLoading: boolean;
}

const CrmContext = React.createContext<CrmContextValue | undefined>(undefined);

export function CrmProvider({ children }: { children: React.ReactNode }): React.JSX.Element {
  const [students, setStudents] = React.useState<Student[]>([]);
  const [teachers, setTeachers] = React.useState<Teacher[]>([]);
  const [isLoading, setIsLoading] = React.useState<boolean>(true);

  // Fetch initial data
  React.useEffect(() => {
    const fetchData = async (): Promise<void> => {
      setIsLoading(true);
      const [studentsData, teachersData] = await Promise.all([
        getStudents(),
        getTeachers(),
      ]);
      setStudents(studentsData);
      setTeachers(teachersData);
      setIsLoading(false);
    };

    fetchData();
  }, []);

  const addStudent = async (input: StudentInput): Promise<void> => {
    const newStudent = await createStudent(input);
    if (newStudent) {
      setStudents((prev) => [newStudent, ...prev]);
    }
  };

  const updateStudentData = async (id: string, input: StudentInput): Promise<void> => {
    const updated = await updateStudent(id, input);
    if (updated) {
      setStudents((prev) =>
        prev.map((student) => (student.id === id ? updated : student))
      );
    }
  };

  const deleteStudentData = async (id: string): Promise<void> => {
    const success = await deleteStudent(id);
    if (success) {
      setStudents((prev) => prev.filter((student) => student.id !== id));
    }
  };

  const toggleStudentFeeStatusData = async (id: string): Promise<void> => {
    const updated = await toggleStudentFeeStatus(id);
    if (updated) {
      setStudents((prev) =>
        prev.map((student) => (student.id === id ? updated : student))
      );
    }
  };

  const addTeacher = async (input: TeacherInput): Promise<void> => {
    const newTeacher = await createTeacher(input);
    if (newTeacher) {
      setTeachers((prev) => [newTeacher, ...prev]);
    }
  };

  const updateTeacherData = async (id: string, input: TeacherInput): Promise<void> => {
    const updated = await updateTeacher(id, input);
    if (updated) {
      setTeachers((prev) =>
        prev.map((teacher) => (teacher.id === id ? updated : teacher))
      );
    }
  };

  const deleteTeacherData = async (id: string): Promise<void> => {
    const success = await deleteTeacher(id);
    if (success) {
      setTeachers((prev) => prev.filter((teacher) => teacher.id !== id));
    }
  };

  return (
    <CrmContext.Provider
      value={{
        students,
        teachers,
        addStudent,
        updateStudent: updateStudentData,
        deleteStudent: deleteStudentData,
        toggleStudentFeeStatus: toggleStudentFeeStatusData,
        addTeacher,
        updateTeacher: updateTeacherData,
        deleteTeacher: deleteTeacherData,
        isLoading,
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
