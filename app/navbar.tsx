"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useState, type FormEvent } from "react";
import { BriefcaseBusiness, LogIn, LogOut, User, X } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import type { AuthUser, UserRole } from "@/lib/auth-types";

const NAV_LINKS = [
  { label: "서비스 소개", href: "/#service-intro", sectionId: "service-intro" },
  { label: "매물 보기", href: "/offer", pathname: "/offer" },
  { label: "AI 분석", href: "/#ai-analysis", sectionId: "ai-analysis" },
  { label: "상담 신청", href: "/#contact", sectionId: "contact" },
] as const;

function getMyPageHref(user: AuthUser) {
  return user.user_role === "AGENT" ? "/agent/dashboard" : "/mypage/offers";
}

function AuthDialog({
  onClose,
  onSuccess,
}: {
  onClose: () => void;
  onSuccess: (user: AuthUser) => void;
}) {
  const { login, signup } = useAuth();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [role, setRole] = useState<UserRole>("GENERAL");
  const [email, setEmail] = useState("general@homeshopper.kr");
  const [password, setPassword] = useState("password123");
  const [name, setName] = useState("김의사");
  const [agencyName, setAgencyName] = useState("홈쇼퍼 제휴공인중개사");
  const [licenseNumber, setLicenseNumber] = useState("45113-2026-00001");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const roleOptions = useMemo(
    () => [
      { role: "GENERAL" as const, label: "일반 회원", icon: User },
      { role: "AGENT" as const, label: "공인중개사", icon: BriefcaseBusiness },
    ],
    [],
  );

  function applyRoleDefaults(nextRole: UserRole, nextMode = mode) {
    setRole(nextRole);
    setName(nextRole === "AGENT" ? "전주파트너" : "김의사");

    if (nextMode === "login") {
      setEmail(nextRole === "AGENT" ? "agent@homeshopper.kr" : "general@homeshopper.kr");
      setPassword("password123");
    }
  }

  function applyMode(nextMode: "login" | "signup") {
    setMode(nextMode);

    if (nextMode === "login") {
      setEmail(role === "AGENT" ? "agent@homeshopper.kr" : "general@homeshopper.kr");
      setPassword("password123");
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const payload = {
        email,
        password,
        name,
        user_role: role,
        agencyName,
        licenseNumber,
      };
      const user = mode === "login" ? await login(payload) : await signup(payload);
      onSuccess(user);
    } catch (err) {
      setError(err instanceof Error ? err.message : "로그인 처리에 실패했습니다.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center bg-black/35 px-4 sm:items-center"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md overflow-hidden rounded-t-2xl bg-white shadow-2xl sm:rounded-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-primary/10 px-5 py-4">
          <div>
            <p className="text-xs font-semibold text-accent">
              {mode === "login" ? "로그인" : "회원가입"}
            </p>
            <h2 className="mt-0.5 text-lg font-extrabold text-primary">
              {role === "AGENT" ? "공인중개사 계정" : "일반 회원 계정"}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-text-muted transition-colors hover:bg-gray-100 hover:text-primary"
            aria-label="닫기"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="border-b border-primary/10 px-5 pt-5">
          <div className="grid grid-cols-2 rounded-xl bg-gray-100 p-1">
            {(["login", "signup"] as const).map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => applyMode(item)}
                className={`rounded-lg px-3 py-2 text-sm font-bold transition-colors ${
                  mode === item ? "bg-white text-primary shadow-sm" : "text-text-muted hover:text-primary"
                }`}
              >
                {item === "login" ? "로그인" : "회원가입"}
              </button>
            ))}
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2">
            {roleOptions.map((item) => {
              const Icon = item.icon;
              const active = role === item.role;

              return (
                <button
                  key={item.role}
                  type="button"
                  onClick={() => applyRoleDefaults(item.role)}
                  className={`flex items-center justify-center gap-2 rounded-xl border px-3 py-3 text-sm font-bold transition-colors ${
                    active
                      ? "border-accent bg-accent/10 text-primary"
                      : "border-primary/10 text-text-muted hover:border-primary/20 hover:text-primary"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 px-5 py-5">
          {mode === "signup" && (
            <label className="block">
              <span className="mb-1.5 block text-xs font-bold text-primary">이름</span>
              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                className="w-full rounded-xl border border-primary/10 px-4 py-3 text-sm outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20"
                required
              />
            </label>
          )}

          <label className="block">
            <span className="mb-1.5 block text-xs font-bold text-primary">이메일</span>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded-xl border border-primary/10 px-4 py-3 text-sm outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20"
              required
            />
          </label>

          <label className="block">
            <span className="mb-1.5 block text-xs font-bold text-primary">비밀번호</span>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-xl border border-primary/10 px-4 py-3 text-sm outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20"
              required
              minLength={8}
            />
          </label>

          {mode === "signup" && role === "AGENT" && (
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="mb-1.5 block text-xs font-bold text-primary">중개사무소명</span>
                <input
                  value={agencyName}
                  onChange={(event) => setAgencyName(event.target.value)}
                  className="w-full rounded-xl border border-primary/10 px-4 py-3 text-sm outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20"
                  required
                />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-xs font-bold text-primary">등록번호</span>
                <input
                  value={licenseNumber}
                  onChange={(event) => setLicenseNumber(event.target.value)}
                  className="w-full rounded-xl border border-primary/10 px-4 py-3 text-sm outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20"
                  required
                />
              </label>
            </div>
          )}

          {error && (
            <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-bold text-white transition-colors hover:bg-primary/90 disabled:opacity-50"
          >
            <LogIn className="h-4 w-4" />
            {submitting ? "처리 중" : mode === "login" ? "로그인" : "가입하고 시작"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading, logout } = useAuth();
  const [activeSection, setActiveSection] = useState("");
  const [authOpen, setAuthOpen] = useState(false);

  useEffect(() => {
    const sections = NAV_LINKS.map((link) =>
      "sectionId" in link ? document.getElementById(link.sectionId) : null,
    ).filter((section): section is HTMLElement => Boolean(section));

    if (sections.length === 0) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleSection = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visibleSection) {
          setActiveSection(visibleSection.target.id);
        }
      },
      {
        rootMargin: "-20% 0px -45% 0px",
        threshold: [0, 0.25, 0.5, 0.75],
      },
    );

    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, [pathname]);

  function goToMyPage(authUser = user) {
    if (!authUser) {
      setAuthOpen(true);
      return;
    }

    router.push(getMyPageHref(authUser));
  }

  async function handleLogout() {
    await logout();
    if (pathname.startsWith("/agent") || pathname.startsWith("/mypage")) {
      router.push("/");
    }
  }

  return (
    <>
      <nav className="sticky top-0 z-50 border-b border-primary/10 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-content items-center gap-5 px-6 py-4">
          <Link
            href="/"
            className="shrink-0 text-lg font-extrabold tracking-tight text-primary"
          >
            HomeShopper
          </Link>

          <div className="flex flex-1 items-center justify-end gap-5 overflow-x-auto">
            {NAV_LINKS.map((link) => {
              const isActive =
                ("sectionId" in link &&
                  pathname === "/" &&
                  activeSection === link.sectionId) ||
                ("pathname" in link && pathname === link.pathname);

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={isActive ? "page" : undefined}
                  className={`shrink-0 text-sm transition-colors hover:text-primary ${
                    isActive
                      ? "font-bold text-accent underline decoration-2 underline-offset-8"
                      : "font-medium text-text-muted"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}

            <button
              type="button"
              onClick={() => goToMyPage()}
              className="shrink-0 text-sm font-medium text-text-muted transition-colors hover:text-primary"
            >
              마이페이지
            </button>

            <Link
              href="/partner"
              className="shrink-0 text-sm font-medium text-text-muted transition-colors hover:text-primary"
            >
              중개사 제휴
            </Link>

            {!loading && user ? (
              <div className="flex shrink-0 items-center gap-2">
                <span className="hidden rounded-full border border-primary/10 px-3 py-1.5 text-xs font-bold text-primary sm:inline-flex">
                  {user.user_role === "AGENT" ? "공인중개사" : "일반 회원"}
                </span>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="inline-flex items-center gap-1.5 rounded-full border border-primary/10 px-3 py-1.5 text-xs font-bold text-text-muted transition-colors hover:border-primary/20 hover:text-primary"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  로그아웃
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setAuthOpen(true)}
                className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-xs font-bold text-white transition-colors hover:bg-primary/90"
              >
                <LogIn className="h-3.5 w-3.5" />
                로그인
              </button>
            )}
          </div>
        </div>
      </nav>

      {authOpen && (
        <AuthDialog
          onClose={() => setAuthOpen(false)}
          onSuccess={(authUser) => {
            setAuthOpen(false);
            goToMyPage(authUser);
          }}
        />
      )}
    </>
  );
}
