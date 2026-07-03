import { createHash, timingSafeEqual } from "crypto";
import { NextRequest, NextResponse } from "next/server";

const COOKIE_NAME = "kb_access_token";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7;

export const runtime = "nodejs";

function hashPassword(password: string) {
  return createHash("sha256").update(password).digest("hex");
}

function isPasswordValid(inputPassword: string, accessPassword: string) {
  const inputHash = hashPassword(inputPassword);
  const accessHash = hashPassword(accessPassword);
  const inputBuffer = Buffer.from(inputHash, "hex");
  const accessBuffer = Buffer.from(accessHash, "hex");

  return (
    inputBuffer.length === accessBuffer.length &&
    timingSafeEqual(inputBuffer, accessBuffer)
  );
}

export async function POST(request: NextRequest) {
  const accessPassword = process.env.ACCESS_PASSWORD;

  if (!accessPassword) {
    return NextResponse.json(
      { success: false, message: "访问密码未配置" },
      { status: 500 },
    );
  }

  const body = (await request.json().catch(() => null)) as {
    password?: unknown;
  } | null;
  const password = typeof body?.password === "string" ? body.password : "";

  if (!isPasswordValid(password, accessPassword)) {
    return NextResponse.json(
      { success: false, message: "密码错误" },
      { status: 401 },
    );
  }

  const response = NextResponse.json({ success: true });

  response.cookies.set(COOKIE_NAME, hashPassword(password), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: COOKIE_MAX_AGE,
    path: "/",
  });

  return response;
}
