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
    const snapshot = await adminDb.ref("data/subTopicData").get();

    if (!snapshot.exists()) {
      return NextResponse.json({});
    }

    const data = snapshot.val();
    const processedData: Record<string, any[]> = {};
    
    if (data) {
      Object.entries(data).forEach(([key, value]) => {
        processedData[key] = Array.isArray(value) 
          ? value 
          : Object.entries(value || {}).map(([id, item]: [string, any]) => ({
              ...item,
              id: item.id || id
            }));
      });
    }

    return NextResponse.json(processedData);
  } catch (error: any) {
    console.error("API Error:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch sub-topic data",
        message: error?.message || "Unknown error",
      },
      { status: 500 }
    );
  }
}
