import { NextResponse } from "next/server";
import { deleteStudent, updateStudent } from "@/lib/db";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function PATCH(
  request: Request,
  context: RouteContext
): Promise<NextResponse> {
  const { id } = await context.params;
  const input = await request.json();
  const student = await updateStudent(id, input);

  if (!student) {
    return NextResponse.json({ error: "Failed to update student" }, { status: 500 });
  }

  return NextResponse.json(student);
}

export async function DELETE(
  _request: Request,
  context: RouteContext
): Promise<NextResponse> {
  const { id } = await context.params;
  const success = await deleteStudent(id);

  if (!success) {
    return NextResponse.json({ error: "Failed to delete student" }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
