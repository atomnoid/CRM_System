import { NextResponse } from "next/server";
import { toggleStudentFeeStatus } from "@/lib/db";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function POST(
  _request: Request,
  context: RouteContext
): Promise<NextResponse> {
  const { id } = await context.params;
  const student = await toggleStudentFeeStatus(id);

  if (!student) {
    return NextResponse.json({ error: "Failed to toggle fee status" }, { status: 500 });
  }

  return NextResponse.json(student);
}
