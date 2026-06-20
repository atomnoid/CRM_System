import { NextResponse } from "next/server";
import { createTeacher, getTeachers } from "@/lib/db";

export async function GET(): Promise<NextResponse> {
  try {
    const teachers = await getTeachers();
    return NextResponse.json(teachers);
  } catch (error: any) {
    console.error("GET /api/teachers error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch teachers" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const input = await request.json();
    const teacher = await createTeacher(input);

    if (!teacher) {
      return NextResponse.json({ error: "Failed to create teacher" }, { status: 500 });
    }

    return NextResponse.json(teacher, { status: 201 });
  } catch (error: any) {
    console.error("POST /api/teachers error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create teacher" },
      { status: 500 }
    );
  }
}
