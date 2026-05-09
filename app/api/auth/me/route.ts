import { NextResponse, type NextRequest } from "next/server";
import { getUserBySessionToken, SESSION_COOKIE_NAME } from "@/lib/auth-store";

export async function GET(request: NextRequest) {
  const user = getUserBySessionToken(request.cookies.get(SESSION_COOKIE_NAME)?.value);

  if (!user) {
    return NextResponse.json({ message: "로그인이 필요합니다." }, { status: 401 });
  }

  return NextResponse.json({ user });
}
