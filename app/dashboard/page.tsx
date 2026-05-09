"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (loading) return;

    router.replace(user?.user_role === "AGENT" ? "/agent/dashboard" : "/mypage/offers");
  }, [loading, router, user]);

  return (
    <div className="flex min-h-[50vh] items-center justify-center bg-background px-6">
      <p className="text-sm font-semibold text-text-muted">마이페이지로 이동 중입니다</p>
    </div>
  );
}
