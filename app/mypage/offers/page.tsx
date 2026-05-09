"use client";

/*
 * C2B 매수자 협상 결과 허브
 * /mypage/offers
 *
 * C2B-S02: 제안 상태 카드 (경쟁 현황 포함)
 * C2B-S03: 역제안 대응 모달 + 가격 비교 바 차트 + 넛지 메시지
 */

import { useState, useMemo, useEffect, useCallback } from "react";
import { useOffers, type Offer, type OfferStatus } from "@/lib/offers-context";
import {
  Building2, Calendar, Clock, CircleCheck, CircleX,
  ArrowLeftRight, Sparkles, X, Loader2, Send, Undo2,
  PartyPopper, ChevronRight, FileText, ArrowRight,
  Bell, Inbox, Users, TrendingUp, Trophy,
  AlertTriangle, ArrowUp, Crown,
} from "lucide-react";

/* ═══════════════════════════════════════════════
 * 유틸
 * ═══════════════════════════════════════════════ */
function fmt(n: number) { return n.toLocaleString("ko-KR"); }
function pctDiff(a: number, b: number) { return ((b - a) / a) * 100; }

/* ═══════════════════════════════════════════════
 * 상태 메타 (매수자 관점)
 * ═══════════════════════════════════════════════ */
const STATUS_META: Record<string, {
  label: string; color: string; bg: string; border: string;
  icon: typeof Clock; cardBg: string;
}> = {
  PENDING:       { label: "검토 대기중",   color: "text-amber-600",   bg: "bg-amber-50",   border: "border-amber-200",   icon: Clock,       cardBg: "bg-white" },
  ACCEPTED:      { label: "수락됨",       color: "text-green-600",   bg: "bg-green-50",   border: "border-green-200",   icon: CircleCheck, cardBg: "bg-white" },
  REJECTED:      { label: "아쉽게 거절됨", color: "text-red-500",     bg: "bg-red-50",     border: "border-red-200",     icon: CircleX,     cardBg: "bg-white" },
  COUNTER_OFFER: { label: "역제안 도착!",  color: "text-blue-600",    bg: "bg-blue-50",    border: "border-blue-300",    icon: Bell,        cardBg: "bg-gradient-to-r from-blue-50 to-white" },
  FINALIZED:     { label: "최종 타결",     color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-200", icon: PartyPopper, cardBg: "bg-white" },
  WITHDRAWN:     { label: "철회됨",        color: "text-gray-400",    bg: "bg-gray-50",    border: "border-gray-200",    icon: Undo2,       cardBg: "bg-gray-50/50" },
};

const CURRENT_USER = "김의사";

/* ═══════════════════════════════════════════════
 * 가격 비교 바 차트 (Tailwind only)
 * ═══════════════════════════════════════════════ */
function PriceComparisonBar({ offer }: { offer: Offer }) {
  const { originalPrice, suggestedPrice, competition } = offer;
  const { highestOffer, averageOffer, lowestOffer, totalBidders } = competition;

  /* 바 스케일: 호가(originalPrice)를 100%로 기준 */
  const scale = (v: number) => Math.min(Math.round((v / originalPrice) * 100), 110);

  const isTop = suggestedPrice >= highestOffer;
  const gapFromTop = highestOffer - suggestedPrice;

  const bars: { label: string; value: number; pct: number; color: string; highlight?: boolean; icon?: typeof Crown }[] = [
    { label: "매물 호가",   value: originalPrice,  pct: 100,                   color: "bg-gray-300" },
    { label: "최고 제안가",  value: highestOffer,   pct: scale(highestOffer),   color: "bg-red-400",  icon: Crown },
    { label: "평균 제안가",  value: averageOffer,   pct: scale(averageOffer),   color: "bg-amber-400" },
    { label: "나의 제안",    value: suggestedPrice, pct: scale(suggestedPrice), color: "bg-blue-500", highlight: true },
    { label: "최저 제안가",  value: lowestOffer,    pct: scale(lowestOffer),    color: "bg-gray-400" },
  ];

  return (
    <div className="rounded-xl border border-primary/10 bg-gray-50/50 p-5">
      {/* 헤더 */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-text-muted">
          <Users className="h-3.5 w-3.5" />
          경쟁 현황 · {totalBidders}명 참여
        </div>
        {isTop && (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700">
            <Trophy className="h-3 w-3" />
            현재 1등!
          </span>
        )}
      </div>

      {/* 바 차트 */}
      <div className="space-y-3">
        {bars.map((bar) => (
          <div key={bar.label} className="flex items-center gap-3">
            {/* 라벨 */}
            <div className="w-20 shrink-0 text-right">
              <span className={`text-[11px] font-semibold ${bar.highlight ? "text-blue-600" : "text-text-muted"}`}>
                {bar.icon && <Crown className="mb-0.5 mr-0.5 inline h-3 w-3 text-red-400" />}
                {bar.label}
              </span>
            </div>

            {/* 바 */}
            <div className="flex flex-1 items-center gap-2">
              <div className="relative h-6 flex-1 overflow-hidden rounded-full bg-gray-200/60">
                <div
                  className={`h-full rounded-full transition-all duration-700 ease-out ${bar.color}
                    ${bar.highlight ? "shadow-sm shadow-blue-300" : ""}`}
                  style={{ width: `${bar.pct}%` }}
                />
                {/* 내 제안 하이라이트 마커 */}
                {bar.highlight && (
                  <div
                    className="absolute top-0 h-full w-0.5 bg-blue-700"
                    style={{ left: `${bar.pct}%` }}
                  />
                )}
              </div>

              {/* 금액 */}
              <span className={`w-16 shrink-0 text-right text-xs font-bold tabular-nums
                ${bar.highlight ? "text-blue-600" : "text-primary"}`}>
                {fmt(bar.value)}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* ── 넛지 메시지 ── */}
      {isTop ? (
        <div className="mt-4 flex items-center gap-2 rounded-lg bg-emerald-50 px-4 py-3">
          <Trophy className="h-5 w-5 shrink-0 text-emerald-500" />
          <p className="text-xs font-semibold leading-snug text-emerald-700">
            현재 최고가로 제안 중입니다! 계약 성사 확률이 가장 높습니다.
          </p>
        </div>
      ) : (
        <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-4">
          <div className="flex items-start gap-2">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-500" />
            <div>
              <p className="text-xs font-semibold leading-snug text-amber-700">
                현재 최고 제안가보다{" "}
                <strong className="text-red-600">{fmt(gapFromTop)}만원</strong>{" "}
                낮습니다.
              </p>
              <p className="mt-0.5 text-[11px] text-amber-600">
                가격을 올려서 계약 확률을 높여보세요!
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              /* 재제안 모드로 전환 — 부모에서 mode 상태 제어 */
              const ev = new CustomEvent("nudge-renegotiate", { detail: offer.id });
              window.dispatchEvent(ev);
            }}
            className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-lg bg-amber-500
                       py-2.5 text-xs font-bold text-white transition-colors hover:bg-amber-600"
          >
            <ArrowUp className="h-3.5 w-3.5" />
            금액 올려서 재제안하기
          </button>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════
 * C2B-S02: 제안 상태 카드
 * ═══════════════════════════════════════════════ */
function OfferCard({ offer, onClick }: { offer: Offer; onClick: () => void }) {
  const m = STATUS_META[offer.status] ?? STATUS_META.PENDING;
  const Icon = m.icon;
  const isCounter = offer.status === "COUNTER_OFFER";
  const isTop = offer.suggestedPrice >= offer.competition.highestOffer;

  return (
    <button
      onClick={onClick}
      className={`group relative w-full rounded-2xl border-2 p-5 text-left transition-all duration-300
        hover:-translate-y-0.5 hover:shadow-lg
        ${isCounter
          ? "border-blue-300 shadow-md shadow-blue-100 hover:shadow-blue-200"
          : `${m.border} border-opacity-60 hover:shadow-primary/5`}
        ${m.cardBg}`}
    >
      {/* 역제안 강조 배지 */}
      {isCounter && (
        <span className="absolute -right-1 -top-2 flex items-center gap-1 rounded-full bg-blue-600 px-2.5 py-1 text-[10px] font-bold text-white shadow-lg animate-bounce">
          <Sparkles className="h-3 w-3" />확인 필요
        </span>
      )}

      <div className="flex items-start gap-4">
        <div className="hidden h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-primary/5 sm:flex">
          <Building2 className="h-7 w-7 text-primary/40" strokeWidth={1.4} />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-sm font-bold leading-snug text-primary sm:text-base">{offer.propertyName}</h3>
            <span className={`shrink-0 inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[10px] font-semibold ${m.bg} ${m.border} ${m.color}`}>
              <Icon className="h-3 w-3" />{m.label}
            </span>
          </div>

          {/* 가격 + 경쟁 요약 */}
          <div className="mt-2 flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <span className="text-sm text-text-muted">
              나의 제안 <strong className="text-primary">{fmt(offer.suggestedPrice)}만</strong>
            </span>
            {isCounter && offer.counterPrice && (
              <span className="text-sm font-bold text-blue-600">→ 역제안 {fmt(offer.counterPrice)}만</span>
            )}
          </div>

          {/* 경쟁 미니 인디케이터 */}
          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-text-muted">
            <span className="flex items-center gap-1">
              <Users className="h-3 w-3" />{offer.competition.totalBidders}명 경쟁
            </span>
            {isTop ? (
              <span className="flex items-center gap-1 font-semibold text-emerald-600">
                <Trophy className="h-3 w-3" />최고가 제안 중
              </span>
            ) : (
              <span className="flex items-center gap-1 text-amber-600">
                <TrendingUp className="h-3 w-3" />최고가 대비 -{fmt(offer.competition.highestOffer - offer.suggestedPrice)}만
              </span>
            )}
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />{offer.createdAt}
            </span>
          </div>
        </div>

        <ChevronRight className="mt-1 h-5 w-5 shrink-0 text-text-muted/30 transition-transform group-hover:translate-x-0.5" />
      </div>
    </button>
  );
}

/* ═══════════════════════════════════════════════
 * C2B-S03: 협상 모달 (가격 비교 바 + 넛지 + 액션)
 * ═══════════════════════════════════════════════ */
function NegotiationModal({
  offer,
  onClose,
  onAction,
}: {
  offer: Offer;
  onClose: () => void;
  onAction: (id: string, status: OfferStatus, extra?: Partial<Offer>) => void;
}) {
  const [mode, setMode] = useState<"view" | "renegotiate" | "finalized">("view");
  const [newPrice, setNewPrice] = useState("");
  const [loading, setLoading] = useState(false);

  const m = STATUS_META[offer.status] ?? STATUS_META.PENDING;
  const Icon = m.icon;
  const isCounter = offer.status === "COUNTER_OFFER";
  const counterDiff = offer.counterPrice ? pctDiff(offer.suggestedPrice, offer.counterPrice) : 0;

  /* 넛지 버튼 이벤트 수신 (PriceComparisonBar에서 dispatch) */
  useEffect(() => {
    function onNudge(e: Event) {
      const ce = e as CustomEvent;
      if (ce.detail === offer.id) setMode("renegotiate");
    }
    window.addEventListener("nudge-renegotiate", onNudge);
    return () => window.removeEventListener("nudge-renegotiate", onNudge);
  }, [offer.id]);

  useEffect(() => { document.body.style.overflow = "hidden"; return () => { document.body.style.overflow = ""; }; }, []);
  useEffect(() => { const fn = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); }; window.addEventListener("keydown", fn); return () => window.removeEventListener("keydown", fn); }, [onClose]);

  async function exec(status: OfferStatus, extra?: Partial<Offer>) {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    onAction(offer.id, status, extra);
    setLoading(false);
    if (status === "FINALIZED") setMode("finalized");
    else onClose();
  }

  /* ── 타결 축하 ── */
  if (mode === "finalized") {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
        <div className="relative z-10 w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-2xl" onClick={(e) => e.stopPropagation()}>
          <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50">
            <PartyPopper className="h-10 w-10 text-emerald-500" strokeWidth={1.5} />
          </div>
          <h2 className="text-2xl font-extrabold text-primary">축하합니다!</h2>
          <p className="mt-2 text-sm text-text-muted">협상이 타결되었습니다.<br />전담 매니저가 가계약 절차를 안내드릴 예정입니다.</p>
          <div className="mt-6 rounded-xl bg-emerald-50 p-4">
            <p className="text-sm font-semibold text-emerald-700">{offer.propertyName}</p>
            <p className="mt-1 text-lg font-extrabold text-emerald-600">{fmt(offer.counterPrice ?? offer.suggestedPrice)}만원</p>
          </div>
          <button onClick={onClose} className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-bold text-white hover:bg-primary/90">
            확인<ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    );
  }

  /* ── 메인 모달 ── */
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <div className="relative z-10 flex max-h-[92vh] w-full flex-col overflow-hidden rounded-t-2xl bg-white shadow-2xl sm:max-w-lg sm:rounded-2xl" onClick={(e) => e.stopPropagation()}>

        {/* 헤더 */}
        <div className="flex items-start justify-between border-b border-gray-100 px-6 py-5">
          <div>
            <p className="text-xs text-text-muted">{offer.id}</p>
            <h2 className="mt-0.5 text-lg font-extrabold text-primary">{offer.propertyName}</h2>
          </div>
          <button onClick={onClose} className="rounded-lg p-1.5 text-text-muted hover:bg-gray-100"><X className="h-5 w-5" /></button>
        </div>

        {/* 본문 */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {/* 상태 */}
          <div className={`mb-5 inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${m.bg} ${m.border} ${m.color}`}>
            <Icon className="h-3.5 w-3.5" />{m.label}
          </div>

          {/* 가격 비교 카드 (역제안 시 3칸) */}
          <div className={`mb-5 grid gap-3 ${isCounter ? "grid-cols-3" : "grid-cols-2"}`}>
            <div className="rounded-xl bg-gray-50 p-3 text-center sm:p-4">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">매물 호가</p>
              <p className="mt-1 text-base font-extrabold text-primary sm:text-lg">{fmt(offer.originalPrice)}만</p>
            </div>
            <div className="rounded-xl bg-gray-50 p-3 text-center sm:p-4">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">나의 제안</p>
              <p className="mt-1 text-base font-extrabold text-blue-600 sm:text-lg">{fmt(offer.suggestedPrice)}만</p>
            </div>
            {isCounter && offer.counterPrice && (
              <div className="rounded-xl border-2 border-blue-200 bg-blue-50 p-3 text-center sm:p-4">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-blue-600">역제안가</p>
                <p className="mt-1 text-base font-extrabold text-blue-700 sm:text-lg">{fmt(offer.counterPrice)}만</p>
                <span className={`mt-0.5 inline-block text-xs font-bold ${counterDiff > 0 ? "text-red-500" : "text-green-600"}`}>
                  {counterDiff > 0 ? "+" : ""}{counterDiff.toFixed(1)}%
                </span>
              </div>
            )}
          </div>

          {/* ★ 가격 비교 바 차트 + 넛지 메시지 */}
          <div className="mb-5">
            <PriceComparisonBar offer={offer} />
          </div>

          {/* 메타 정보 */}
          <div className="mb-5 space-y-2.5 text-sm">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-text-muted"><Calendar className="h-4 w-4" />희망 입주일</span>
              <span className="font-semibold text-primary">{offer.moveInDate}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-text-muted"><Clock className="h-4 w-4" />제안 접수일</span>
              <span className="font-semibold text-primary">{offer.createdAt}</span>
            </div>
          </div>

          {/* 메시지 */}
          {offer.message && (
            <div className="rounded-xl bg-primary/5 p-4">
              <div className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-primary/60"><FileText className="h-3.5 w-3.5" />내가 남긴 메시지</div>
              <p className="text-sm leading-relaxed text-primary">{offer.message}</p>
            </div>
          )}

          {/* ── 재협상 입력 ── */}
          {mode === "renegotiate" && (
            <div className="mt-5 rounded-xl border-2 border-accent/30 bg-accent/5 p-5">
              <p className="mb-1 text-sm font-bold text-primary">새로운 제안 가격을 입력하세요</p>
              <p className="mb-3 text-[11px] text-text-muted">
                현재 최고가 {fmt(offer.competition.highestOffer)}만원 이상을 권장합니다
              </p>
              <div className="relative">
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder={`예: ${fmt(offer.competition.highestOffer + 100)}`}
                  value={newPrice}
                  onChange={(e) => { const n = e.target.value.replace(/\D/g, ""); setNewPrice(n ? Number(n).toLocaleString("ko-KR") : ""); }}
                  className="w-full rounded-xl border border-accent/30 bg-white px-4 py-3 pr-12
                             text-base font-bold text-primary outline-none
                             focus:border-accent focus:ring-2 focus:ring-accent/20"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-text-muted">만원</span>
              </div>
              {/* 입력 중 실시간 피드백 */}
              {newPrice && (
                <p className={`mt-2 text-xs font-semibold ${
                  Number(newPrice.replace(/\D/g, "")) >= offer.competition.highestOffer
                    ? "text-emerald-600" : "text-amber-600"
                }`}>
                  {Number(newPrice.replace(/\D/g, "")) >= offer.competition.highestOffer
                    ? "👍 최고가 이상입니다. 계약 확률이 높아요!"
                    : `⚠️ 최고가(${fmt(offer.competition.highestOffer)}만)보다 낮습니다`}
                </p>
              )}
              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => exec("PENDING", { suggestedPrice: Number(newPrice.replace(/\D/g, "")) })}
                  disabled={loading || !newPrice}
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-accent py-3
                             text-sm font-bold text-white hover:bg-accent/90 disabled:opacity-50"
                >
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                  재제안 전송
                </button>
                <button onClick={() => setMode("view")} className="rounded-xl border border-gray-200 px-5 py-3 text-sm font-medium text-text-muted hover:bg-gray-50">취소</button>
              </div>
            </div>
          )}
        </div>

        {/* ── 하단 액션 (역제안 상태) ── */}
        {mode === "view" && isCounter && (
          <div className="border-t border-gray-100 px-6 py-4">
            <div className="flex flex-col gap-2 sm:flex-row">
              <button onClick={() => exec("FINALIZED")} disabled={loading} className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-500 py-3.5 text-sm font-bold text-white hover:bg-emerald-600 disabled:opacity-50">
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <CircleCheck className="h-4 w-4" />}수락 및 가계약 진행
              </button>
              <button onClick={() => setMode("renegotiate")} className="flex flex-1 items-center justify-center gap-2 rounded-xl border-2 border-accent/30 bg-white py-3.5 text-sm font-bold text-accent hover:bg-accent/5">
                <ArrowLeftRight className="h-4 w-4" />재협상 제안
              </button>
              <button onClick={() => exec("WITHDRAWN")} disabled={loading} className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-3.5 text-sm font-medium text-text-muted hover:bg-gray-50 sm:flex-none">
                <Undo2 className="h-4 w-4" />철회
              </button>
            </div>
          </div>
        )}

        {/* PENDING에서도 재제안 가능 */}
        {mode === "view" && offer.status === "PENDING" && (
          <div className="border-t border-gray-100 px-6 py-4">
            <div className="flex gap-2">
              <button onClick={() => setMode("renegotiate")} className="flex flex-1 items-center justify-center gap-2 rounded-xl border-2 border-accent/30 bg-white py-3.5 text-sm font-bold text-accent hover:bg-accent/5">
                <ArrowUp className="h-4 w-4" />금액 수정하기
              </button>
              <button onClick={() => exec("WITHDRAWN")} disabled={loading} className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-3.5 text-sm font-medium text-text-muted hover:bg-gray-50">
                <Undo2 className="h-4 w-4" />철회
              </button>
            </div>
          </div>
        )}

        {/* 기타 상태 안내 */}
        {mode === "view" && !isCounter && offer.status !== "PENDING" && (
          <div className="border-t border-gray-100 px-6 py-4 text-center">
            <p className="text-xs text-text-muted">
              {offer.status === "ACCEPTED" && "제안이 수락되었습니다! 전담 매니저가 곧 연락드립니다."}
              {offer.status === "REJECTED" && "이번에는 아쉽게 매칭되지 못했습니다."}
              {offer.status === "FINALIZED" && "협상이 최종 타결되었습니다."}
              {offer.status === "WITHDRAWN" && "이 제안은 철회되었습니다."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
 * 탭 필터
 * ═══════════════════════════════════════════════ */
type FilterKey = "ALL" | "COUNTER_OFFER" | "PENDING" | "DONE";

const FILTER_TABS: { key: FilterKey; label: string }[] = [
  { key: "ALL", label: "전체" },
  { key: "COUNTER_OFFER", label: "역제안 도착" },
  { key: "PENDING", label: "검토 대기" },
  { key: "DONE", label: "완료됨" },
];

function filterOffers(offers: Offer[], tab: FilterKey): Offer[] {
  switch (tab) {
    case "COUNTER_OFFER": return offers.filter((o) => o.status === "COUNTER_OFFER");
    case "PENDING": return offers.filter((o) => o.status === "PENDING");
    case "DONE": return offers.filter((o) => ["ACCEPTED", "REJECTED", "FINALIZED", "WITHDRAWN"].includes(o.status));
    default: return offers;
  }
}

/* ═══════════════════════════════════════════════
 * 메인 페이지
 * ═══════════════════════════════════════════════ */
export default function MyOffersPage() {
  const { offers, updateStatus } = useOffers();
  const [tab, setTab] = useState<FilterKey>("ALL");
  const [selected, setSelected] = useState<Offer | null>(null);

  const myOffers = useMemo(() => offers.filter((o) => o.buyerName === CURRENT_USER), [offers]);
  const filtered = useMemo(() => filterOffers(myOffers, tab), [myOffers, tab]);
  const counts = useMemo(() => ({
    ALL: myOffers.length,
    COUNTER_OFFER: myOffers.filter((o) => o.status === "COUNTER_OFFER").length,
    PENDING: myOffers.filter((o) => o.status === "PENDING").length,
    DONE: myOffers.filter((o) => ["ACCEPTED", "REJECTED", "FINALIZED", "WITHDRAWN"].includes(o.status)).length,
  }), [myOffers]);

  const handleAction = useCallback((id: string, status: OfferStatus, extra?: Partial<Offer>) => {
    updateStatus(id, status, extra);
  }, [updateStatus]);

  const latest = selected ? offers.find((o) => o.id === selected.id) ?? null : null;
  const counterCount = counts.COUNTER_OFFER;

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50/40 via-white to-background">
      <div className="mx-auto max-w-2xl px-4 pb-24 pt-8 sm:px-6">

        {/* 헤더 */}
        <div className="mb-8">
          <h1 className="text-2xl font-extrabold tracking-tight text-primary sm:text-3xl">내 제안 현황</h1>
          <p className="mt-1 text-sm text-text-muted">보낸 제안의 경쟁 현황을 확인하고 전략적으로 대응하세요</p>
        </div>

        {/* 역제안 알림 배너 */}
        {counterCount > 0 && (
          <button onClick={() => setTab("COUNTER_OFFER")} className="mb-6 flex w-full items-center gap-3 rounded-2xl border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-white p-4 text-left transition-all hover:shadow-md hover:shadow-blue-100">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100"><Bell className="h-5 w-5 text-blue-600" /></div>
            <div className="flex-1"><p className="text-sm font-bold text-blue-700">역제안이 {counterCount}건 도착했습니다!</p><p className="text-xs text-blue-500">지금 확인하고 협상을 이어가세요</p></div>
            <ChevronRight className="h-5 w-5 text-blue-400" />
          </button>
        )}

        {/* 요약 카드 */}
        <div className="mb-6 grid grid-cols-3 gap-3">
          <div className="rounded-xl border border-primary/10 bg-white p-4 text-center">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">보낸 제안</p>
            <p className="mt-1 text-xl font-extrabold text-primary">{myOffers.length}</p>
          </div>
          <div className="rounded-xl border border-primary/10 bg-white p-4 text-center">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">역제안</p>
            <p className="mt-1 text-xl font-extrabold text-blue-600">{counterCount}</p>
          </div>
          <div className="rounded-xl border border-primary/10 bg-white p-4 text-center">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">타결</p>
            <p className="mt-1 text-xl font-extrabold text-emerald-600">
              {myOffers.filter((o) => o.status === "FINALIZED" || o.status === "ACCEPTED").length}
            </p>
          </div>
        </div>

        {/* 탭 필터 */}
        <div className="mb-5 flex gap-2 overflow-x-auto pb-1">
          {FILTER_TABS.map((t) => {
            const active = tab === t.key;
            return (
              <button key={t.key} onClick={() => setTab(t.key)} className={`relative shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition-all ${active ? "bg-primary text-white shadow-sm" : "border border-primary/10 bg-white text-text-muted hover:border-primary/20"}`}>
                {t.label}{(counts[t.key] ?? 0) > 0 && <span className={`ml-1.5 text-xs ${active ? "text-white/70" : "text-text-muted/60"}`}>{counts[t.key]}</span>}
              </button>
            );
          })}
        </div>

        {/* 카드 리스트 */}
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-text-muted">
            <Inbox className="mb-3 h-12 w-12 opacity-20" /><p className="text-sm font-medium">해당 상태의 제안이 없습니다</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((o) => <OfferCard key={o.id} offer={o} onClick={() => setSelected(o)} />)}
          </div>
        )}
      </div>

      {latest && <NegotiationModal offer={latest} onClose={() => setSelected(null)} onAction={handleAction} />}
    </div>
  );
}
