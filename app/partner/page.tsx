"use client";

/*
 * B2B 공인중개사 제안 관리 대시보드
 * /partner
 * 공유 Context(useOffers)를 통해 /mypage/offers와 실시간 동기화
 */

import { useState, useMemo, useCallback, type ChangeEvent, type FormEvent } from "react";
import { useAuth } from "@/lib/auth-context";
import { useOffers, type Offer, type OfferStatus } from "@/lib/offers-context";
import {
  Building2, Calendar, ChevronRight, X, Check, XCircle,
  ArrowLeftRight, TrendingDown, BarChart3, Clock, CircleCheck,
  CircleX, MessageSquare, Loader2, Filter, Inbox, BadgeCheck,
  Building, Handshake, MapPin, Phone, ShieldCheck, TrendingUp,
  User, Users,
} from "lucide-react";

/* ── 유틸 ── */
function fmt(n: number) { return n.toLocaleString("ko-KR"); }
function pctDiff(a: number, b: number) { return ((b - a) / a) * 100; }

const STATUS_META: Record<string, { label: string; color: string; bg: string; icon: typeof Clock }> = {
  PENDING:       { label: "대기중",   color: "text-amber-600",  bg: "bg-amber-50  border-amber-200",  icon: Clock },
  ACCEPTED:      { label: "수락됨",   color: "text-green-600",  bg: "bg-green-50  border-green-200",  icon: CircleCheck },
  REJECTED:      { label: "거절됨",   color: "text-red-500",    bg: "bg-red-50    border-red-200",    icon: CircleX },
  COUNTER_OFFER: { label: "역제안",   color: "text-blue-600",   bg: "bg-blue-50   border-blue-200",   icon: ArrowLeftRight },
  FINALIZED:     { label: "최종타결", color: "text-emerald-600",bg: "bg-emerald-50 border-emerald-200",icon: CircleCheck },
  WITHDRAWN:     { label: "철회됨",   color: "text-gray-500",   bg: "bg-gray-50   border-gray-200",   icon: CircleX },
};

type TabKey = "ALL" | "PENDING" | "ACCEPTED" | "REJECTED" | "COUNTER_OFFER";
const TABS: { key: TabKey; label: string }[] = [
  { key: "ALL", label: "전체" }, { key: "PENDING", label: "대기중" },
  { key: "ACCEPTED", label: "수락됨" }, { key: "REJECTED", label: "거절됨" },
  { key: "COUNTER_OFFER", label: "역제안" },
];

const PARTNER_BENEFITS = [
  {
    icon: Clock,
    title: "업무 범위 축소",
    desc: "서류 검토, 보증, 최종 납입 등 핵심 법적 절차만 중개 업무가 한정됩니다. 나머지는 홈쇼퍼가 처리합니다.",
  },
  {
    icon: Users,
    title: "영업 리소스 절감",
    desc: "플랫폼이 매도자 및 매수자를 직접 연결하여 고객 유치 부담을 해소합니다. 별도 영업 활동 불필요.",
  },
  {
    icon: TrendingUp,
    title: "부가 수익 창출",
    desc: "전담 투입 시간은 줄고, 플랫폼 매칭으로 거래 빈도는 늘어나 총수익이 증가합니다.",
  },
  {
    icon: ShieldCheck,
    title: "AI 서류 분석 지원",
    desc: "등기부등본·건축물대장 AI 자동 분석으로 권리관계 검토 시간을 90% 이상 절감합니다.",
  },
] as const;

const PROPERTY_TYPES = ["메디컬 전문 빌딩", "일반 상가", "오피스텔", "주상복합", "단지내 상가", "기타"] as const;

type PartnerFormState = {
  agencyName: string;
  ownerName: string;
  phone: string;
  address: string;
};

function PartnerLandingPage() {
  const [form, setForm] = useState<PartnerFormState>({
    agencyName: "",
    ownerName: "",
    phone: "",
    address: "",
  });
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);

  const canSubmit =
    form.agencyName.trim() &&
    form.ownerName.trim() &&
    form.phone.trim() &&
    form.address.trim() &&
    selectedTypes.length > 0;

  function handleChange(field: keyof PartnerFormState) {
    return (event: ChangeEvent<HTMLInputElement>) => {
      setForm((current) => ({ ...current, [field]: event.target.value }));
      setSubmitted(false);
    };
  }

  function toggleType(type: string) {
    setSelectedTypes((current) =>
      current.includes(type) ? current.filter((item) => item !== type) : [...current, type],
    );
    setSubmitted(false);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!canSubmit) return;

    setSubmitted(true);
  }

  return (
    <div className="bg-white">
      <section className="bg-gradient-to-b from-white via-background to-[#eef5ff] px-6 py-20 text-center sm:py-24 lg:py-28">
        <div className="mx-auto max-w-content">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-white/80 px-4 py-1.5 text-xs font-bold text-primary shadow-sm shadow-primary/5">
            <BadgeCheck className="h-3.5 w-3.5" />
            파트너 중개사 모집 중
          </div>

          <h1 className="mx-auto mt-7 max-w-3xl text-4xl font-black leading-tight tracking-tight text-primary sm:text-5xl">
            제휴 중개사가 되어,
            <br />
            <span className="text-brand-gradient">새로운 수익 파이프라인</span>을 만드세요
          </h1>

          <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-primary/70 sm:text-lg">
            홈쇼퍼가 고객 유치부터 서류 분석까지 처리합니다.
            <br className="hidden sm:block" />
            중개사님은 핵심 업무에만 집중하세요.
          </p>

          <a
            href="#partner-apply"
            className="mt-10 inline-flex items-center gap-2 rounded-xl bg-brand-gradient px-8 py-4 text-sm font-extrabold text-white shadow-brand transition hover:-translate-y-0.5"
          >
            제휴 신청하기
            <ChevronRight className="h-4 w-4" />
          </a>
        </div>
      </section>

      <section className="bg-background px-6 py-20 sm:py-24">
        <div className="mx-auto max-w-content">
          <div className="text-center">
            <h2 className="text-2xl font-black tracking-tight text-primary sm:text-3xl">
              왜 홈쇼퍼와 함께해야 할까요?
            </h2>
            <p className="mt-3 text-sm font-medium text-text-muted">
              제휴 중개사에게 제공되는 네 가지 핵심 혜택
            </p>
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-2">
            {PARTNER_BENEFITS.map((benefit) => {
              const Icon = benefit.icon;

              return (
                <article
                  key={benefit.title}
                  className="flex gap-5 rounded-xl border border-primary/5 bg-white p-8 shadow-sm shadow-primary/[0.03]"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-gradient text-white shadow-md shadow-accent/20">
                    <Icon className="h-6 w-6" strokeWidth={1.7} />
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-primary">{benefit.title}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-text-muted">{benefit.desc}</p>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section id="partner-apply" className="scroll-mt-24 bg-white px-6 py-20 sm:py-24">
        <div className="mx-auto max-w-2xl">
          <div className="text-center">
            <h2 className="text-2xl font-black tracking-tight text-primary sm:text-3xl">제휴 신청하기</h2>
            <p className="mt-4 text-sm font-medium text-text-muted">
              아래 정보를 입력해 주시면 빠르게 검토해 드리겠습니다
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="mt-12 rounded-2xl border border-accent/15 bg-background p-8 shadow-md shadow-accent/5 sm:p-10"
          >
            <div className="space-y-7">
              <label className="block">
                <span className="mb-2 flex items-center gap-2 text-sm font-extrabold text-primary">
                  <Building className="h-4 w-4 text-text-muted" />
                  중개사무소명 <span className="text-red-500">*</span>
                </span>
                <input
                  value={form.agencyName}
                  onChange={handleChange("agencyName")}
                  placeholder="홈쇼퍼공인중개사사무소"
                  className="h-12 w-full rounded-xl border border-primary/10 bg-white px-4 text-sm font-medium text-primary outline-none transition focus:border-primary/30 focus:ring-4 focus:ring-primary/5"
                />
              </label>

              <label className="block">
                <span className="mb-2 flex items-center gap-2 text-sm font-extrabold text-primary">
                  <User className="h-4 w-4 text-text-muted" />
                  대표자명 <span className="text-red-500">*</span>
                </span>
                <input
                  value={form.ownerName}
                  onChange={handleChange("ownerName")}
                  placeholder="홍길동"
                  className="h-12 w-full rounded-xl border border-primary/10 bg-white px-4 text-sm font-medium text-primary outline-none transition focus:border-primary/30 focus:ring-4 focus:ring-primary/5"
                />
              </label>

              <label className="block">
                <span className="mb-2 flex items-center gap-2 text-sm font-extrabold text-primary">
                  <Phone className="h-4 w-4 text-text-muted" />
                  연락처 <span className="text-red-500">*</span>
                </span>
                <input
                  value={form.phone}
                  onChange={handleChange("phone")}
                  placeholder="010-0000-0000"
                  inputMode="tel"
                  className="h-12 w-full rounded-xl border border-primary/10 bg-white px-4 text-sm font-medium text-primary outline-none transition focus:border-primary/30 focus:ring-4 focus:ring-primary/5"
                />
              </label>

              <label className="block">
                <span className="mb-2 flex items-center gap-2 text-sm font-extrabold text-primary">
                  <MapPin className="h-4 w-4 text-text-muted" />
                  소재지 <span className="text-red-500">*</span>
                </span>
                <input
                  value={form.address}
                  onChange={handleChange("address")}
                  placeholder="전주시 덕진구 에코시티로 00"
                  className="h-12 w-full rounded-xl border border-primary/10 bg-white px-4 text-sm font-medium text-primary outline-none transition focus:border-primary/30 focus:ring-4 focus:ring-primary/5"
                />
              </label>

              <div>
                <p className="mb-3 text-sm font-extrabold text-primary">
                  주요 취급 매물 유형 <span className="font-medium text-text-muted">(복수 선택 가능)</span>
                </p>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {PROPERTY_TYPES.map((type) => {
                    const active = selectedTypes.includes(type);

                    return (
                      <button
                        key={type}
                        type="button"
                        onClick={() => toggleType(type)}
                        className={`h-11 rounded-xl border px-3 text-xs font-bold transition ${
                          active
                            ? "border-accent bg-brand-gradient text-white shadow-sm shadow-accent/20"
                            : "border-primary/10 bg-white text-text-muted hover:border-primary/25 hover:text-primary"
                        }`}
                      >
                        {type}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={!canSubmit}
              className="mt-10 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-brand-gradient text-sm font-extrabold text-white shadow-md shadow-accent/20 transition hover:-translate-y-0.5 disabled:translate-y-0 disabled:bg-none disabled:bg-white disabled:text-text-muted disabled:shadow-none disabled:ring-1 disabled:ring-accent/15"
            >
              <Handshake className="h-4 w-4" />
              제휴 신청 제출하기
            </button>

            {submitted && (
              <p className="mt-4 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-center text-sm font-bold text-green-700">
                제휴 신청이 접수되었습니다. 담당자가 빠르게 연락드리겠습니다.
              </p>
            )}
          </form>
        </div>
      </section>
    </div>
  );
}

function PartnerPageLoading() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center bg-white">
      <div className="flex items-center gap-2 text-sm font-bold text-text-muted">
        <Loader2 className="h-4 w-4 animate-spin" />
        계정 정보를 확인하는 중
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
 * 통계 위젯
 * ═══════════════════════════════════════════════ */
function StatsWidget({ offers }: { offers: Offer[] }) {
  const s = useMemo(() => {
    const t = offers.length;
    const a = offers.filter((o) => o.status === "ACCEPTED" || o.status === "FINALIZED").length;
    const r = t ? ((a / t) * 100).toFixed(1) : "0";
    const avg = t ? (offers.reduce((s, o) => s + pctDiff(o.originalPrice, o.suggestedPrice), 0) / t).toFixed(1) : "0";
    const p = offers.filter((o) => o.status === "PENDING").length;
    return { t, a, r, avg, p };
  }, [offers]);

  const cards = [
    { label: "총 제안", value: `${s.t}건`, icon: Inbox, accent: "text-primary" },
    { label: "수락률", value: `${s.r}%`, icon: CircleCheck, accent: "text-green-600" },
    { label: "평균 조정률", value: `${s.avg}%`, icon: TrendingDown, accent: "text-blue-600" },
    { label: "대기중", value: `${s.p}건`, icon: Clock, accent: "text-amber-600" },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {cards.map((c) => (
        <div key={c.label} className="rounded-xl border border-primary/10 bg-white p-4">
          <div className="mb-2 flex items-center gap-1.5">
            <c.icon className={`h-4 w-4 ${c.accent}`} strokeWidth={1.8} />
            <span className="text-xs font-medium text-text-muted">{c.label}</span>
          </div>
          <p className={`text-xl font-extrabold ${c.accent}`}>{c.value}</p>
        </div>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════
 * 제안 리스트
 * ═══════════════════════════════════════════════ */
function OfferList({ offers, onSelect }: { offers: Offer[]; onSelect: (o: Offer) => void }) {
  if (!offers.length) return (
    <div className="flex flex-col items-center justify-center py-20 text-text-muted">
      <Filter className="mb-3 h-10 w-10 opacity-30" /><p className="text-sm font-medium">해당 상태의 제안이 없습니다</p>
    </div>
  );

  return (
    <div className="space-y-3">
      {offers.map((o) => {
        const m = STATUS_META[o.status] ?? STATUS_META.PENDING;
        const d = pctDiff(o.originalPrice, o.suggestedPrice);
        const I = m.icon;
        return (
          <button key={o.id} onClick={() => onSelect(o)} className="group flex w-full items-center gap-4 rounded-xl border border-primary/5 bg-white p-4 text-left transition-all hover:border-primary/15 hover:shadow-sm sm:p-5">
            <div className="hidden h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/5 sm:flex">
              <Building2 className="h-5 w-5 text-primary/50" strokeWidth={1.6} />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <p className="truncate text-sm font-bold text-primary">{o.propertyName}</p>
                <span className={`shrink-0 inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold ${m.bg} ${m.color}`}><I className="h-3 w-3" />{m.label}</span>
              </div>
              <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-text-muted">
                <span>제안가 <strong className="text-primary">{fmt(o.suggestedPrice)}만</strong></span>
                {d !== 0 && <span className={d < 0 ? "text-red-500" : "text-green-600"}>{d > 0 ? "+" : ""}{d.toFixed(1)}%</span>}
                <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{o.createdAt}</span>
              </div>
            </div>
            <ChevronRight className="h-5 w-5 shrink-0 text-text-muted/40 transition-transform group-hover:translate-x-0.5" />
          </button>
        );
      })}
    </div>
  );
}

/* ═══════════════════════════════════════════════
 * 상세 모달
 * ═══════════════════════════════════════════════ */
function DetailModal({ offer, onClose, onAction }: {
  offer: Offer; onClose: () => void;
  onAction: (id: string, status: OfferStatus, extra?: Partial<Offer>) => void;
}) {
  const [mode, setMode] = useState<"view" | "reject" | "counter">("view");
  const [reason, setReason] = useState("");
  const [cp, setCp] = useState("");
  const [loading, setLoading] = useState(false);

  const m = STATUS_META[offer.status] ?? STATUS_META.PENDING;
  const I = m.icon;
  const d = pctDiff(offer.originalPrice, offer.suggestedPrice);

  async function exec(st: OfferStatus, extra?: Partial<Offer>) {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    onAction(offer.id, st, extra);
    setLoading(false); onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <div className="relative z-10 flex max-h-[90vh] w-full flex-col overflow-hidden rounded-t-2xl bg-white shadow-2xl sm:max-w-lg sm:rounded-2xl" onClick={(e) => e.stopPropagation()}>
        {/* 헤더 */}
        <div className="flex items-start justify-between border-b border-gray-100 px-6 py-5">
          <div><p className="text-xs font-semibold text-text-muted">{offer.id}</p><h2 className="mt-0.5 text-lg font-extrabold text-primary">{offer.propertyName}</h2></div>
          <button onClick={onClose} className="rounded-lg p-1.5 text-text-muted hover:bg-gray-100"><X className="h-5 w-5" /></button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5">
          <div className={`mb-5 inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${m.bg} ${m.color}`}><I className="h-3.5 w-3.5" />{m.label}</div>

          <div className="mb-5 grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-gray-50 p-4 text-center"><p className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">매물 가격</p><p className="mt-1 text-lg font-extrabold text-primary">{fmt(offer.originalPrice)}만</p></div>
            <div className="rounded-xl bg-gray-50 p-4 text-center"><p className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">제안 가격</p><p className="mt-1 text-lg font-extrabold text-primary">{fmt(offer.suggestedPrice)}만</p>{d !== 0 && <span className={`mt-0.5 inline-block text-xs font-bold ${d < 0 ? "text-red-500" : "text-green-600"}`}>{d > 0 ? "+" : ""}{d.toFixed(1)}%</span>}</div>
          </div>

          <div className="mb-5 space-y-3 text-sm">
            <div className="flex items-center justify-between"><span className="flex items-center gap-1.5 text-text-muted"><Calendar className="h-4 w-4" />희망 입주일</span><span className="font-semibold text-primary">{offer.moveInDate}</span></div>
            <div className="flex items-center justify-between"><span className="flex items-center gap-1.5 text-text-muted"><Clock className="h-4 w-4" />접수일</span><span className="font-semibold text-primary">{offer.createdAt}</span></div>
          </div>

          {offer.message && (
            <div className="rounded-xl bg-blue-50/60 p-4">
              <div className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-blue-600"><MessageSquare className="h-3.5 w-3.5" />매수자 메시지</div>
              <p className="text-sm leading-relaxed text-primary">{offer.message}</p>
            </div>
          )}

          {mode === "reject" && (
            <div className="mt-5 rounded-xl border border-red-200 bg-red-50/50 p-4">
              <p className="mb-2 text-xs font-semibold text-red-600">거절 사유 (선택)</p>
              <textarea rows={2} placeholder="사유를 입력해 주세요" value={reason} onChange={(e) => setReason(e.target.value)} className="w-full resize-none rounded-lg border border-red-200 bg-white px-3 py-2 text-sm outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100" />
              <div className="mt-3 flex gap-2">
                <button onClick={() => exec("REJECTED")} disabled={loading} className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-red-500 py-2.5 text-sm font-bold text-white hover:bg-red-600 disabled:opacity-50">{loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <CircleX className="h-4 w-4" />}거절 확정</button>
                <button onClick={() => setMode("view")} className="rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium text-text-muted hover:bg-gray-50">취소</button>
              </div>
            </div>
          )}

          {mode === "counter" && (
            <div className="mt-5 rounded-xl border border-blue-200 bg-blue-50/50 p-4">
              <p className="mb-2 text-xs font-semibold text-blue-600">역제안 가격 (만원)</p>
              <div className="relative">
                <input type="text" inputMode="numeric" placeholder="예: 4,800" value={cp} onChange={(e) => { const n = e.target.value.replace(/\D/g, ""); setCp(n ? Number(n).toLocaleString("ko-KR") : ""); }} className="w-full rounded-lg border border-blue-200 bg-white px-3 py-2.5 pr-10 text-sm font-semibold outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100" />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-text-muted">만원</span>
              </div>
              <div className="mt-3 flex gap-2">
                <button onClick={() => exec("COUNTER_OFFER", { counterPrice: Number(cp.replace(/\D/g, "")) })} disabled={loading || !cp} className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-blue-600 py-2.5 text-sm font-bold text-white hover:bg-blue-700 disabled:opacity-50">{loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowLeftRight className="h-4 w-4" />}역제안 전송</button>
                <button onClick={() => setMode("view")} className="rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium text-text-muted hover:bg-gray-50">취소</button>
              </div>
            </div>
          )}
        </div>

        {mode === "view" && offer.status === "PENDING" && (
          <div className="border-t border-gray-100 px-6 py-4">
            <div className="grid grid-cols-3 gap-2">
              <button onClick={() => exec("ACCEPTED")} disabled={loading} className="flex items-center justify-center gap-1.5 rounded-xl bg-green-500 py-3 text-sm font-bold text-white hover:bg-green-600 disabled:opacity-50">{loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}수락</button>
              <button onClick={() => setMode("reject")} className="flex items-center justify-center gap-1.5 rounded-xl border border-red-200 bg-white py-3 text-sm font-bold text-red-500 hover:bg-red-50"><XCircle className="h-4 w-4" />거절</button>
              <button onClick={() => setMode("counter")} className="flex items-center justify-center gap-1.5 rounded-xl border border-blue-200 bg-white py-3 text-sm font-bold text-blue-600 hover:bg-blue-50"><ArrowLeftRight className="h-4 w-4" />역제안</button>
            </div>
          </div>
        )}
        {mode === "view" && offer.status !== "PENDING" && (
          <div className="border-t border-gray-100 px-6 py-4 text-center"><p className="text-xs text-text-muted">이미 처리된 제안입니다</p></div>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
 * 페이지
 * ═══════════════════════════════════════════════ */
function AgentPartnerDashboard() {
  const { offers, updateStatus } = useOffers();
  const [tab, setTab] = useState<TabKey>("ALL");
  const [selected, setSelected] = useState<Offer | null>(null);

  const filtered = useMemo(() => tab === "ALL" ? offers : offers.filter((o) => o.status === tab), [offers, tab]);
  const counts = useMemo(() => { const m: Record<string, number> = { ALL: offers.length }; for (const o of offers) m[o.status] = (m[o.status] || 0) + 1; return m; }, [offers]);

  const handleAction = useCallback((id: string, status: OfferStatus, extra?: Partial<Offer>) => {
    updateStatus(id, status, extra);
  }, [updateStatus]);

  const latest = selected ? offers.find((o) => o.id === selected.id) ?? null : null;

  return (
    <div className="min-h-screen bg-gray-50/80">
      <div className="mx-auto max-w-5xl px-4 pb-24 pt-8 sm:px-6">
        <div className="mb-8">
          <div className="flex items-center gap-2"><BarChart3 className="h-6 w-6 text-primary" /><h1 className="text-2xl font-extrabold tracking-tight text-primary">제안 관리 대시보드</h1></div>
          <p className="mt-1 text-sm text-text-muted">들어온 매물 제안을 확인하고 수락·거절·역제안을 관리하세요</p>
        </div>
        <div className="mb-8"><StatsWidget offers={offers} /></div>
        <div className="rounded-2xl border border-primary/10 bg-white shadow-sm">
          <div className="flex gap-0 overflow-x-auto border-b border-gray-100 px-2">
            {TABS.map((t) => { const a = tab === t.key; return (
              <button key={t.key} onClick={() => setTab(t.key)} className={`relative shrink-0 px-4 py-3.5 text-sm font-semibold transition-colors ${a ? "text-primary" : "text-text-muted hover:text-primary/70"}`}>
                {t.label}<span className={`ml-1.5 text-xs ${a ? "text-accent" : "text-text-muted/60"}`}>{counts[t.key] || 0}</span>
                {a && <span className="absolute bottom-0 left-2 right-2 h-0.5 rounded-full bg-accent" />}
              </button>); })}
          </div>
          <div className="p-4 sm:p-5"><OfferList offers={filtered} onSelect={setSelected} /></div>
        </div>
      </div>
      {latest && <DetailModal offer={latest} onClose={() => setSelected(null)} onAction={handleAction} />}
    </div>
  );
}

export default function PartnerPage() {
  const { user, loading } = useAuth();

  if (loading) {
    return <PartnerPageLoading />;
  }

  if (user?.user_role === "AGENT") {
    return <AgentPartnerDashboard />;
  }

  return <PartnerLandingPage />;
}
