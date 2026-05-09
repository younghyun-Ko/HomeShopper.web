import type { AuthUser, UserRole } from "@/lib/auth-types";

export const SESSION_COOKIE_NAME = "homeshopper_session";

interface UserRecord extends AuthUser {
  passwordHash: string;
  createdAt: string;
}

interface SessionRecord {
  userId: string;
  createdAt: string;
}

type SignupInput = {
  email: string;
  password: string;
  name: string;
  user_role: UserRole;
  agencyName?: string;
  licenseNumber?: string;
};

const users = new Map<string, UserRecord>();
const sessions = new Map<string, SessionRecord>();

function hashPassword(password: string) {
  return `demo:${Buffer.from(password).toString("base64")}`;
}

function publicUser(user: UserRecord): AuthUser {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    user_role: user.user_role,
    agencyName: user.agencyName,
    licenseNumber: user.licenseNumber,
  };
}

function seedUser(input: SignupInput) {
  const id = `usr_${input.user_role.toLowerCase()}_${users.size + 1}`;
  const normalizedEmail = input.email.trim().toLowerCase();

  users.set(normalizedEmail, {
    id,
    email: normalizedEmail,
    name: input.name.trim(),
    user_role: input.user_role,
    agencyName: input.agencyName?.trim() || undefined,
    licenseNumber: input.licenseNumber?.trim() || undefined,
    passwordHash: hashPassword(input.password),
    createdAt: new Date().toISOString(),
  });
}

seedUser({
  email: "general@homeshopper.kr",
  password: "password123",
  name: "김의사",
  user_role: "GENERAL",
});

seedUser({
  email: "agent@homeshopper.kr",
  password: "password123",
  name: "전주파트너",
  user_role: "AGENT",
  agencyName: "홈쇼퍼 제휴공인중개사",
  licenseNumber: "45113-2026-00001",
});

export function createUser(input: SignupInput) {
  const email = input.email.trim().toLowerCase();

  if (!email || !input.password || !input.name.trim()) {
    throw new Error("필수 정보를 입력해 주세요.");
  }

  if (input.password.length < 8) {
    throw new Error("비밀번호는 8자 이상이어야 합니다.");
  }

  if (input.user_role === "AGENT" && (!input.agencyName?.trim() || !input.licenseNumber?.trim())) {
    throw new Error("공인중개사는 중개사무소명과 등록번호가 필요합니다.");
  }

  if (users.has(email)) {
    throw new Error("이미 가입된 이메일입니다.");
  }

  seedUser({ ...input, email });
  return publicUser(users.get(email)!);
}

export function verifyUser(email: string, password: string) {
  const user = users.get(email.trim().toLowerCase());

  if (!user || user.passwordHash !== hashPassword(password)) {
    return null;
  }

  return publicUser(user);
}

export function createSession(userId: string) {
  const token = crypto.randomUUID();

  sessions.set(token, {
    userId,
    createdAt: new Date().toISOString(),
  });

  return token;
}

export function deleteSession(token: string) {
  sessions.delete(token);
}

export function getUserBySessionToken(token?: string) {
  if (!token) return null;

  const session = sessions.get(token);
  if (!session) return null;

  const user = [...users.values()].find((item) => item.id === session.userId);
  return user ? publicUser(user) : null;
}

export function userHasRole(user: AuthUser | null, allowedRoles: UserRole[]) {
  return Boolean(user && allowedRoles.includes(user.user_role));
}
