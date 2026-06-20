import { NextResponse } from "next/server";
import { createStudent, getStudents } from "@/lib/db";

export async function GET(): Promise<NextResponse> {
  try {
    const students = await getStudents();
    return NextResponse.json(students);
  } catch (error: any) {
    console.error("GET /api/students error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch students" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const input = await request.json();
    const student = await createStudent(input);

    if (!student) {
      return NextResponse.json({ error: "Failed to create student" }, { status: 500 });
    }

    return NextResponse.json(student, { status: 201 });
  } catch (error: any) {
    console.error("POST /api/students error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create student" },
      { status: 500 }
    );
  }
}
