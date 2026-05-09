import { NextResponse, type NextRequest } from "next/server";
import { createSession, createUser, SESSION_COOKIE_NAME } from "@/lib/auth-store";
import type { UserRole } from "@/lib/auth-types";

const USER_ROLES = new Set<UserRole>(["GENERAL", "AGENT"]);

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const userRole = body?.user_role as UserRole;

  if (!USER_ROLES.has(userRole)) {
    return NextResponse.json({ message: "회원 유형을 선택해 주세요." }, { status: 400 });
  }

  try {
    const user = createUser({
      email: String(body?.email ?? ""),
      password: String(body?.password ?? ""),
      name: String(body?.name ?? ""),
      user_role: userRole,
      agencyName: body?.agencyName ? String(body.agencyName) : undefined,
      licenseNumber: body?.licenseNumber ? String(body.licenseNumber) : undefined,
    });

    const response = NextResponse.json({ user }, { status: 201 });
    response.cookies.set(SESSION_COOKIE_NAME, createSession(user.id), {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
    });

    return response;
  } catch (error) {
    const message = error instanceof Error ? error.message : "회원가입에 실패했습니다.";
    return NextResponse.json({ message }, { status: 400 });
  }
}
