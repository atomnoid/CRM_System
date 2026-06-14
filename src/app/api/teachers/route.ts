import { NextResponse } from "next/server";
import { createTeacher, getTeachers } from "@/lib/db";

export async function GET(): Promise<NextResponse> {
  const teachers = await getTeachers();
  return NextResponse.json(teachers);
}

export async function POST(request: Request): Promise<NextResponse> {
  const input = await request.json();
  const teacher = await createTeacher(input);

  if (!teacher) {
    return NextResponse.json({ error: "Failed to create teacher" }, { status: 500 });
  }

  return NextResponse.json(teacher, { status: 201 });
}
