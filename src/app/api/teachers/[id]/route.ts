import { NextResponse } from "next/server";
import { deleteTeacher, updateTeacher } from "@/lib/db";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function PATCH(
  request: Request,
  context: RouteContext
): Promise<NextResponse> {
  try {
    const { id } = await context.params;
    const input = await request.json();
    const teacher = await updateTeacher(id, input);

    if (!teacher) {
      return NextResponse.json({ error: "Failed to update teacher" }, { status: 500 });
    }

    return NextResponse.json(teacher);
  } catch (error: any) {
    console.error("PATCH /api/teachers/[id] error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update teacher" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: Request,
  context: RouteContext
): Promise<NextResponse> {
  try {
    const { id } = await context.params;
    const success = await deleteTeacher(id);

    if (!success) {
      return NextResponse.json({ error: "Failed to delete teacher" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("DELETE /api/teachers/[id] error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to delete teacher" },
      { status: 500 }
    );
  }
}
