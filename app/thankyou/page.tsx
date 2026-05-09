"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import {
  ArrowRight,
  Check,
  CircleCheck,
  Link2,
  MessageCircle,
  Share2,
  Sparkles,
} from "lucide-react";

function SharePanel() {
  const [toast, setToast] = useState(false);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  async function handleCopyLink() {
    const url = window.location.origin;

    try {
      await navigator.clipboard.writeText(url);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = url;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
    }

    setToast(true);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(false), 2500);
  }

  function handleKakaoShare() {
    const url = encodeURIComponent(window.location.origin);
    const text = encodeURIComponent("개원 부동산, 이제 안심하세요 - 홈쇼퍼");
    const kakaoLink = `https://sharer.kakao.com/talk/friends/picker/link?url=${url}&text=${text}`;
    window.open(kakaoLink, "_blank", "width=480,height=640");
  }

  function handleSmsShare() {
    const body = encodeURIComponent(`개원 부동산, 이제 안심하세요 - 홈쇼퍼\n${window.location.origin}`);
    window.location.href = `sms:?body=${body}`;
  }

  return (
    <div className="relative rounded-2xl border border-primary/10 bg-white p-5 shadow-sm">
      <div className="text-center">
        <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10 text-accent">
          <Sparkles className="h-5 w-5" strokeWidth={1.8} />
        </div>
        <p className="text-sm font-extrabold text-primary">동료 선생님께도 알려주세요</p>
        <p className="mt-1 text-xs leading-relaxed text-text-muted">
          개원 준비 중인 지인에게 홈쇼퍼를 공유하면 더 빠르게 좋은 매물을 찾을 수 있습니다.
        </p>
      </div>

      <div className="mt-5 grid grid-cols-3 gap-2">
        <button
          type="button"
          onClick={handleKakaoShare}
          className="flex h-12 items-center justify-center gap-1.5 rounded-xl bg-[#FEE500] px-3 text-xs font-bold text-[#3C1E1E] shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md active:translate-y-0 sm:text-sm"
          aria-label="카카오톡으로 공유"
        >
          <MessageCircle className="h-4 w-4" />
          카카오톡
        </button>
        <button
          type="button"
          onClick={handleCopyLink}
          className="flex h-12 items-center justify-center gap-1.5 rounded-xl border border-primary/10 bg-background px-3 text-xs font-bold text-primary shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md active:translate-y-0 sm:text-sm"
          aria-label="링크 복사"
        >
          <Link2 className="h-4 w-4" />
          링크 복사
        </button>
        <button
          type="button"
          onClick={handleSmsShare}
          className="flex h-12 items-center justify-center gap-1.5 rounded-xl border border-primary/10 bg-background px-3 text-xs font-bold text-primary shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md active:translate-y-0 sm:text-sm"
          aria-label="문자로 공유"
        >
          <Share2 className="h-4 w-4" />
          문자
        </button>
      </div>

      <div
        className={`pointer-events-none absolute -bottom-12 left-1/2 -translate-x-1/2 transition-all duration-300 ${
          toast ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
        }`}
      >
        <span className="inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-xs font-semibold text-white shadow-lg">
          <Check className="h-3.5 w-3.5" />
          링크가 복사되었습니다
        </span>
      </div>
    </div>
  );
}

export default function ThankYouPage() {
  return (
    <section className="bg-gradient-to-b from-background to-white px-6 py-20 sm:py-24">
      <div className="mx-auto max-w-md text-center">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-50">
          <CircleCheck className="h-10 w-10 text-green-500" strokeWidth={1.5} />
        </div>

        <h1 className="text-2xl font-extrabold text-primary sm:text-3xl">
          신청이 완료되었습니다!
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-text-muted">
          전담 매니저가 <strong className="text-primary">24시간 내</strong>에 연락드리겠습니다.
        </p>

        <div className="mt-8">
          <SharePanel />
        </div>

        <div className="mt-8 rounded-2xl border border-accent/20 bg-accent/5 p-6">
          <p className="text-sm font-semibold text-primary">
            조금 더 구체적인 조건을 알려주시면
            <br />
            <span className="text-accent">찰떡같은 매물</span>을 찾아드릴게요!
          </p>
          <Link
            href="/offer"
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-accent px-6 py-3 text-sm font-bold text-white shadow-md shadow-accent/20 transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-accent/30"
          >
            상세 조건 입력하기
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <Link
          href="/"
          className="mt-5 inline-flex text-xs font-semibold text-text-muted underline transition-colors hover:text-primary"
        >
          홈으로 돌아가기
        </Link>
      </div>
    </section>
  );
}
