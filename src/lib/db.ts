import { getSupabase } from "./supabase";
import type { Student, Teacher } from "@/types";

function mapStudent(student: {
  id: string;
  name: string;
  class: string;
  monthly_fee: number;
  fee_paid: boolean;
  paid_till_month: string | null;
  created_at: string;
}): Student {
  return {
    id: student.id,
    name: student.name,
    class: student.class,
    monthlyFee: student.monthly_fee,
    feePaid: student.fee_paid,
    paidTillMonth: student.paid_till_month ?? undefined,
    createdAt: student.created_at,
  };
}

function mapTeacher(teacher: {
  id: string;
  name: string;
  subject: string;
  monthly_salary: number;
  created_at: string;
}): Teacher {
  return {
    id: teacher.id,
    name: teacher.name,
    subject: teacher.subject,
    monthlySalary: teacher.monthly_salary,
    createdAt: teacher.created_at,
  };
}

function logDbError(action: string, error: { message?: string; code?: string }): void {
  console.error(`Error ${action}:`, error.message ?? error);
}

// ============================================
// STUDENT OPERATIONS
// ============================================

export async function getStudents(): Promise<Student[]> {
  const { data, error } = await getSupabase()
    .from("students")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    logDbError("fetching students", error);
    return [];
  }

  return (data || []).map(mapStudent);
}

export async function createStudent(input: {
  name: string;
  class: string;
  monthlyFee: number;
  feePaid: boolean;
}): Promise<Student | null> {
  const client = getSupabase();

  const { data, error } = await client
    .from("students")
    .insert({
      name: input.name,
      class: input.class,
      monthly_fee: input.monthlyFee,
      fee_paid: input.feePaid,
    })
    .select()
    .single();

  if (error) {
    logDbError("creating student", error);
    return null;
  }

  return mapStudent(data);
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
  const client = getSupabase();
  const { data, error } = await client
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
    logDbError("updating student", error);
    return null;
  }

  return mapStudent(data);
}

export async function deleteStudent(id: string): Promise<boolean> {
  const { error } = await getSupabase().from("students").delete().eq("id", id);

  if (error) {
    logDbError("deleting student", error);
    return false;
  }

  return true;
}

export async function toggleStudentFeeStatus(id: string): Promise<Student | null> {
  const { data: student, error: fetchError } = await getSupabase()
    .from("students")
    .select("fee_paid")
    .eq("id", id)
    .single();

  if (fetchError) {
    logDbError("fetching student", fetchError);
    return null;
  }

  const client = getSupabase();
  const { data, error } = await client
    .from("students")
    .update({
      fee_paid: !student.fee_paid,
    })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    logDbError("toggling fee status", error);
    return null;
  }

  return mapStudent(data);
}

// ============================================
// TEACHER OPERATIONS
// ============================================

export async function getTeachers(): Promise<Teacher[]> {
  const { data, error } = await getSupabase()
    .from("teachers")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    logDbError("fetching teachers", error);
    return [];
  }

  return (data || []).map(mapTeacher);
}

export async function createTeacher(input: {
  name: string;
  subject: string;
  monthlySalary: number;
}): Promise<Teacher | null> {
  const client = getSupabase();
  const { data, error } = await client
    .from("teachers")
    .insert({
      name: input.name,
      subject: input.subject,
      monthly_salary: input.monthlySalary,
    })
    .select()
    .single();

  if (error) {
    logDbError("creating teacher", error);
    return null;
  }

  return mapTeacher(data);
}

export async function updateTeacher(
  id: string,
  input: {
    name: string;
    subject: string;
    monthlySalary: number;
  }
): Promise<Teacher | null> {
  const client = getSupabase();
  const { data, error } = await client
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
    logDbError("updating teacher", error);
    return null;
  }

  return mapTeacher(data);
}

export async function deleteTeacher(id: string): Promise<boolean> {
  const { error } = await getSupabase().from("teachers").delete().eq("id", id);

  if (error) {
    logDbError("deleting teacher", error);
    return false;
  }

  return true;
}
