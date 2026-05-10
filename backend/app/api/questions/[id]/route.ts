import { NextRequest, NextResponse } from "next/server";
import { getAdminDb } from "@/app/lib/firebase-admin";
import { isAuthorized } from "@/app/lib/api-auth";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isAuthorized(request)) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const { id } = await params;

  try {
    const adminDb = getAdminDb();
    const snapshot = await adminDb.ref(`data/categories/${id}/questions`).get();

    if (!snapshot.exists()) {
      return NextResponse.json([]);
    }

    const data = snapshot.val();
    const questions = Array.isArray(data) ? data : Object.values(data || {});
    return NextResponse.json(questions.filter(Boolean));
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch questions" },
      { status: 500 }
    );
  }
}