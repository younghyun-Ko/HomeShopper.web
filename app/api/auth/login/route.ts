import { NextResponse, type NextRequest } from "next/server";
import { createSession, SESSION_COOKIE_NAME, verifyUser } from "@/lib/auth-store";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const user = verifyUser(String(body?.email ?? ""), String(body?.password ?? ""));

  if (!user) {
    return NextResponse.json({ message: "이메일 또는 비밀번호를 확인해 주세요." }, { status: 401 });
  }

  if (body?.user_role && user.user_role !== body.user_role) {
    return NextResponse.json({ message: "선택한 회원 유형과 계정 유형이 다릅니다." }, { status: 403 });
  }

  const response = NextResponse.json({ user });
  response.cookies.set(SESSION_COOKIE_NAME, createSession(user.id), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
  });

  return response;
}
