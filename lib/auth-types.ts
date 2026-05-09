export type UserRole = "GENERAL" | "AGENT";

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  user_role: UserRole;
  agencyName?: string;
  licenseNumber?: string;
}

export interface AuthResponse {
  user: AuthUser;
}
