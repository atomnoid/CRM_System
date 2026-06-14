import { NextResponse } from "next/server";
import { deleteTeacher, updateTeacher } from "@/lib/db";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function PATCH(
  request: Request,
  context: RouteContext
): Promise<NextResponse> {
  const { id } = await context.params;
  const input = await request.json();
  const teacher = await updateTeacher(id, input);

  if (!teacher) {
    return NextResponse.json({ error: "Failed to update teacher" }, { status: 500 });
  }

  return NextResponse.json(teacher);
}

export async function DELETE(
  _request: Request,
  context: RouteContext
): Promise<NextResponse> {
  const { id } = await context.params;
  const success = await deleteTeacher(id);

  if (!success) {
    return NextResponse.json({ error: "Failed to delete teacher" }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
