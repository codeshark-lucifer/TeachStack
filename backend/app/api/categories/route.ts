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
    const snapshot = await adminDb.ref("data/categories").get();

    if (!snapshot.exists()) {
      return NextResponse.json([]);
    }

    const categories = snapshot.val();
    const categoriesArray = Object.entries(categories || {}).map(([id, data]: [string, any]) => ({
      ...data,
      id: data.id || id
    }));
    
    return NextResponse.json(categoriesArray);
  } catch (error: any) {
    console.error("API Error:", error);

    return NextResponse.json(
      {
        error: "Failed to fetch categories",
        message: error?.message || "Unknown error",
      },
      { status: 500 }
    );
  }
}