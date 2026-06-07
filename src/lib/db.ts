import { supabase } from "./supabase";
import type { Student, Teacher } from "@/types";

// ============================================
// STUDENT OPERATIONS
// ============================================

export async function getStudents(): Promise<Student[]> {
  const { data, error } = await supabase
    .from("students")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching students:", {
      message: error.message,
      code: error.code,
      hint: (error as any).hint,
      details: (error as any).details,
    });
    return [];
  }

  return (data || []).map((student: any) => ({
    id: student.id,
    name: student.name,
    class: student.class,
    monthlyFee: student.monthly_fee,
    feePaid: student.fee_paid,
    paidTillMonth: student.paid_till_month,
    createdAt: student.created_at,
  }));
}

export async function createStudent(input: {
  name: string;
  class: string;
  monthlyFee: number;
  feePaid: boolean;
}): Promise<Student | null> {
  const { data, error } = await supabase
    .from("students")
    .insert([
      {
        name: input.name,
        class: input.class,
        monthly_fee: input.monthlyFee,
        fee_paid: input.feePaid,
      },
    ])
    .select()
    .single();

  if (error) {
    console.error("Error creating student:", {
      message: error.message,
      code: error.code,
      hint: (error as any).hint,
      details: (error as any).details,
    });
    return null;
  }

  return {
    id: data.id,
    name: data.name,
    class: data.class,
    monthlyFee: data.monthly_fee,
    feePaid: data.fee_paid,
    paidTillMonth: data.paid_till_month,
    createdAt: data.created_at,
  };
}

export async function updateStudent(
  id: string,
  input: {
    name: string;
    class: string;
    monthlyFee: number;
    feePaid: boolean;
  }
): Promise<Student | null> {
  const { data, error } = await supabase
    .from("students")
    .update({
      name: input.name,
      class: input.class,
      monthly_fee: input.monthlyFee,
      fee_paid: input.feePaid,
    })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error updating student:", {
      message: error.message,
      code: error.code,
      hint: (error as any).hint,
      details: (error as any).details,
    });
    return null;
  }

  return {
    id: data.id,
    name: data.name,
    class: data.class,
    monthlyFee: data.monthly_fee,
    feePaid: data.fee_paid,
    paidTillMonth: data.paid_till_month,
    createdAt: data.created_at,
  };
}

export async function deleteStudent(id: string): Promise<boolean> {
  const { error } = await supabase.from("students").delete().eq("id", id);

  if (error) {
    console.error("Error deleting student:", {
      message: error.message,
      code: error.code,
      hint: (error as any).hint,
      details: (error as any).details,
    });
    return false;
  }

  return true;
}

export async function toggleStudentFeeStatus(id: string): Promise<Student | null> {
  // First, get the current student to toggle the fee status
  const { data: student, error: fetchError } = await supabase
    .from("students")
    .select("fee_paid")
    .eq("id", id)
    .single();

  if (fetchError) {
    console.error("Error fetching student:", {
      message: fetchError.message,
      code: fetchError.code,
      hint: (fetchError as any).hint,
      details: (fetchError as any).details,
    });
    return null;
  }

  // Update with toggled fee status
  const { data, error } = await supabase
    .from("students")
    .update({
      fee_paid: !student.fee_paid,
    })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error toggling fee status:", {
      message: error.message,
      code: error.code,
      hint: (error as any).hint,
      details: (error as any).details,
    });
    return null;
  }

  return {
    id: data.id,
    name: data.name,
    class: data.class,
    monthlyFee: data.monthly_fee,
    feePaid: data.fee_paid,
    paidTillMonth: data.paid_till_month,
    createdAt: data.created_at,
  };
}

// ============================================
// TEACHER OPERATIONS
// ============================================

export async function getTeachers(): Promise<Teacher[]> {
  const { data, error } = await supabase
    .from("teachers")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching teachers:", {
      message: error.message,
      code: error.code,
      hint: (error as any).hint,
      details: (error as any).details,
    });
    return [];
  }

  return (data || []).map((teacher: any) => ({
    id: teacher.id,
    name: teacher.name,
    subject: teacher.subject,
    monthlySalary: teacher.monthly_salary,
    createdAt: teacher.created_at,
  }));
}

export async function createTeacher(input: {
  name: string;
  subject: string;
  monthlySalary: number;
}): Promise<Teacher | null> {
  const { data, error } = await supabase
    .from("teachers")
    .insert([
      {
        name: input.name,
        subject: input.subject,
        monthly_salary: input.monthlySalary,
      },
    ])
    .select()
    .single();

  if (error) {
    console.error("Error creating teacher:", {
      message: error.message,
      code: error.code,
      hint: (error as any).hint,
      details: (error as any).details,
    });
    return null;
  }

  return {
    id: data.id,
    name: data.name,
    subject: data.subject,
    monthlySalary: data.monthly_salary,
    createdAt: data.created_at,
  };
}

export async function updateTeacher(
  id: string,
  input: {
    name: string;
    subject: string;
    monthlySalary: number;
  }
): Promise<Teacher | null> {
  const { data, error } = await supabase
    .from("teachers")
    .update({
      name: input.name,
      subject: input.subject,
      monthly_salary: input.monthlySalary,
    })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error updating teacher:", {
      message: error.message,
      code: error.code,
      hint: (error as any).hint,
      details: (error as any).details,
    });
    return null;
  }

  return {
    id: data.id,
    name: data.name,
    subject: data.subject,
    monthlySalary: data.monthly_salary,
    createdAt: data.created_at,
  };
}

export async function deleteTeacher(id: string): Promise<boolean> {
  const { error } = await supabase.from("teachers").delete().eq("id", id);

  if (error) {
    console.error("Error deleting teacher:", {
      message: error.message,
      code: error.code,
      hint: (error as any).hint,
      details: (error as any).details,
    });
    return false;
  }

  return true;
}
