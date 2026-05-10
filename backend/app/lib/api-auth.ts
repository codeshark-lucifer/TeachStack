import { NextRequest } from "next/server";

export function isAuthorized(request: NextRequest) {
  const token = request.headers.get("x-api-token");
  return token === process.env.API_SECRET;
}