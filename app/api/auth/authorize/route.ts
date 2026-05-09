import { NextResponse, type NextRequest } from "next/server";
import { getUserBySessionToken, SESSION_COOKIE_NAME, userHasRole } from "@/lib/auth-store";
import type { UserRole } from "@/lib/auth-types";

const USER_ROLES = new Set<UserRole>(["GENERAL", "AGENT"]);

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const allowedRoles = Array.isArray(body?.allowedRoles)
    ? body.allowedRoles.filter((role: unknown): role is UserRole => USER_ROLES.has(role as UserRole))
    : [];
  const user = getUserBySessionToken(request.cookies.get(SESSION_COOKIE_NAME)?.value);

  if (!user) {
    return NextResponse.json({ allowed: false, message: "로그인이 필요합니다." }, { status: 401 });
  }

  if (allowedRoles.length === 0) {
    return NextResponse.json({ allowed: false, message: "검증할 권한이 없습니다." }, { status: 400 });
  }

  const allowed = userHasRole(user, allowedRoles);

  return NextResponse.json(
    { allowed, user, requiredRoles: allowedRoles },
    { status: allowed ? 200 : 403 },
  );
}
