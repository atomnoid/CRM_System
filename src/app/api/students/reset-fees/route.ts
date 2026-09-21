import { NextResponse } from "next/server";
import { resetAllStudentFeesToPending } from "@/lib/db";

export async function POST(): Promise<NextResponse> {
  try {
    await resetAllStudentFeesToPending();
    return NextResponse.json({ success: true, message: "All student fees reset to pending" });
  } catch (error: any) {
    console.error("POST /api/students/reset-fees error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to reset student fees" },
      { status: 500 }
    );
  }
}
