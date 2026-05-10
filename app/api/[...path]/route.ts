import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL =
  process.env.BACKEND_API_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:3001";

const ALLOWED_GET_PATHS = [
  /^categories$/,
  /^category\/[A-Za-z0-9_-]+$/,
  /^questions\/[A-Za-z0-9_-]+$/,
  /^exam-types$/,
  /^sub-topics$/,
];

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  if (!process.env.API_SECRET) {
    return NextResponse.json(
      { error: "API proxy is not configured." },
      { status: 500 }
    );
  }

  const { path } = await params;
  const endpoint = path.join("/");

  if (!ALLOWED_GET_PATHS.some((pattern) => pattern.test(endpoint))) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const upstreamUrl = new URL(`/api/${endpoint}`, API_BASE_URL);
  upstreamUrl.search = request.nextUrl.search;

  const response = await fetch(upstreamUrl, {
    headers: {
      Accept: "application/json",
      "x-api-token": process.env.API_SECRET,
    },
    cache: "no-store",
  });

  const body = await response.text();

  return new NextResponse(body, {
    status: response.status,
    headers: {
      "content-type":
        response.headers.get("content-type") || "application/json",
    },
  });
}
