import { NextRequest, NextResponse } from "next/server";
import { getAdminDb } from "@/app/lib/firebase-admin";
import { isAuthorized } from "@/app/lib/api-auth";

export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const adminDb = getAdminDb();
    const snapshot = await adminDb.ref("data/examTypes").get();

    if (!snapshot.exists()) {
      return NextResponse.json([]);
    }

    const examTypes = snapshot.val();
    const examTypesArray = Array.isArray(examTypes) 
      ? examTypes 
      : Object.entries(examTypes || {}).map(([id, data]: [string, any]) => ({
          ...data,
          id: data.id || id
        }));
    
    return NextResponse.json(examTypesArray.filter(Boolean));
  } catch (error: any) {
    console.error("API Error:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch exam types",
        message: error?.message || "Unknown error",
      },
      { status: 500 }
    );
  }
}
