import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production";

export async function requireAuth(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    const token = authHeader?.replace("Bearer ", "") || request.cookies.get("auth_token")?.value;

    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized - Please sign in to continue" },
        { status: 401 }
      );
    }

    jwt.verify(token, JWT_SECRET);
    return null; // Auth successful
  } catch (error: any) {
    return NextResponse.json(
      { error: "Unauthorized - Invalid or expired token" },
      { status: 401 }
    );
  }
}
