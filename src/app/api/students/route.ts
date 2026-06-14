import { NextResponse } from "next/server";
import { createStudent, getStudents } from "@/lib/db";

export async function GET(): Promise<NextResponse> {
  const students = await getStudents();
  return NextResponse.json(students);
}

export async function POST(request: Request): Promise<NextResponse> {
  const input = await request.json();
  const student = await createStudent(input);

  if (!student) {
    return NextResponse.json({ error: "Failed to create student" }, { status: 500 });
  }

  return NextResponse.json(student, { status: 201 });
}
