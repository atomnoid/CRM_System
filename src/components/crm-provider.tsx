"use client";

import * as React from "react";
import {
  getStudents,
  createStudent,
  updateStudent,
  deleteStudent,
  toggleStudentFeeStatus,
  resetAllStudentFeesToPending,
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
  resetAllStudentFeesToPending: () => Promise<void>;
  undoResetStudentFees: () => Promise<void>;
  canUndoReset: boolean;
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
  const [previousStudentFeeStates, setPreviousStudentFeeStates] = React.useState<Record<string, boolean> | null>(null);

  const resetAllStudentFeesToPendingData = React.useCallback(async (): Promise<void> => {
    // Snapshot current student states before reset
    setStudents((prev) => {
      const snapshot: Record<string, boolean> = {};
      prev.forEach((s) => {
        snapshot[s.id] = s.feePaid;
      });
      setPreviousStudentFeeStates(snapshot);
      return prev;
    });

    const success = await resetAllStudentFeesToPending();
    if (success) {
      setStudents((prev) => prev.map((student) => ({ ...student, feePaid: false })));
    }
  }, []);

  const undoResetStudentFeesData = React.useCallback(async (): Promise<void> => {
    if (!previousStudentFeeStates) return;

    // Restore previous student states
    const updatePromises = Object.entries(previousStudentFeeStates).map(async ([id, feePaid]) => {
      const student = students.find((s) => s.id === id);
      if (student && student.feePaid !== feePaid) {
        await updateStudent(id, {
          name: student.name,
          class: student.class,
          monthlyFee: student.monthlyFee,
          feePaid,
        });
      }
    });

    await Promise.all(updatePromises);

    setStudents((prev) =>
      prev.map((student) => {
        if (previousStudentFeeStates[student.id] !== undefined) {
          return { ...student, feePaid: previousStudentFeeStates[student.id] };
        }
        return student;
      })
    );

    setPreviousStudentFeeStates(null);
  }, [previousStudentFeeStates, students]);

  // Fetch initial data & check automated monthly reset
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

      // Automated check on the 1st of every month
      try {
        const now = new Date();
        const currentYearMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
        const lastReset = typeof window !== "undefined" ? localStorage.getItem("crm_last_fee_reset_month") : null;

        if (lastReset && lastReset !== currentYearMonth) {
          console.log(`New billing month detected (${currentYearMonth}). Resetting student fees to Pending...`);
          await resetAllStudentFeesToPending();
          setStudents((prev) => prev.map((s) => ({ ...s, feePaid: false })));
          localStorage.setItem("crm_last_fee_reset_month", currentYearMonth);
        } else if (!lastReset) {
          localStorage.setItem("crm_last_fee_reset_month", currentYearMonth);
        }
      } catch (err) {
        console.error("Monthly reset check error:", err);
      }
    };

    fetchData();
  }, [resetAllStudentFeesToPendingData]);

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
    // Optimistically toggle UI status instantly
    let originalStudent: Student | undefined;
    setStudents((prev) =>
      prev.map((student) => {
        if (student.id === id) {
          originalStudent = student;
          const nextFeePaid = !student.feePaid;
          return {
            ...student,
            feePaid: nextFeePaid,
            paidAt: nextFeePaid ? new Date().toISOString() : undefined,
          };
        }
        return student;
      })
    );

    // Call server API asynchronously in background
    const updated = await toggleStudentFeeStatus(id);

    // Revert state if backend request failed
    if (!updated && originalStudent) {
      const revertStudent = originalStudent;
      setStudents((prev) =>
        prev.map((student) => (student.id === id ? revertStudent : student))
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
        resetAllStudentFeesToPending: resetAllStudentFeesToPendingData,
        undoResetStudentFees: undoResetStudentFeesData,
        canUndoReset: previousStudentFeeStates !== null,
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
