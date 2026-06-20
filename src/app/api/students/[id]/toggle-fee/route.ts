import { NextResponse } from "next/server";
import { toggleStudentFeeStatus } from "@/lib/db";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function POST(
  _request: Request,
  context: RouteContext
): Promise<NextResponse> {
  try {
    const { id } = await context.params;
    const student = await toggleStudentFeeStatus(id);

    if (!student) {
      return NextResponse.json({ error: "Failed to toggle fee status" }, { status: 500 });
    }

    return NextResponse.json(student);
  } catch (error: any) {
    console.error("POST /api/students/[id]/toggle-fee error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to toggle fee status" },
      { status: 500 }
    );
  }
}
