import type { Student, Teacher } from "@/types";

async function parseJson<T>(response: Response): Promise<T | null> {
  if (!response.ok) {
    return null;
  }

  return response.json() as Promise<T>;
}

export async function getStudents(): Promise<Student[]> {
  const response = await fetch("/api/students");
  return (await parseJson<Student[]>(response)) ?? [];
}

export async function createStudent(input: {
  name: string;
  class: string;
  monthlyFee: number;
  feePaid: boolean;
}): Promise<Student | null> {
  const response = await fetch("/api/students", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  return parseJson<Student>(response);
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
  const response = await fetch(`/api/students/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  return parseJson<Student>(response);
}

export async function deleteStudent(id: string): Promise<boolean> {
  const response = await fetch(`/api/students/${id}`, { method: "DELETE" });
  return response.ok;
}

export async function toggleStudentFeeStatus(id: string): Promise<Student | null> {
  const response = await fetch(`/api/students/${id}/toggle-fee`, {
    method: "POST",
  });

  return parseJson<Student>(response);
}

export async function getTeachers(): Promise<Teacher[]> {
  const response = await fetch("/api/teachers");
  return (await parseJson<Teacher[]>(response)) ?? [];
}

export async function createTeacher(input: {
  name: string;
  subject: string;
  monthlySalary: number;
}): Promise<Teacher | null> {
  const response = await fetch("/api/teachers", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  return parseJson<Teacher>(response);
}

export async function updateTeacher(
  id: string,
  input: {
    name: string;
    subject: string;
    monthlySalary: number;
  }
): Promise<Teacher | null> {
  const response = await fetch(`/api/teachers/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  return parseJson<Teacher>(response);
}

export async function deleteTeacher(id: string): Promise<boolean> {
  const response = await fetch(`/api/teachers/${id}`, { method: "DELETE" });
  return response.ok;
}
