"use client";

/*
 * B2C 메인 랜딩 페이지
 * 섹션 ID: B2C-S01 ~ B2C-S08
 */

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Percent,
  ShieldCheck,
  Handshake,
  ClipboardEdit,
  UserCheck,
  FileSignature,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Loader2,
  Building2,
  Hospital,
  Landmark,
  MapPin,
  Maximize,
  Banknote,
  X,
  Stethoscope,
  RefreshCw,
  Send,
  CircleCheck,
  Scale,
  TriangleAlert,
  type LucideIcon,
} from "lucide-react";

function SectionScrollIndicator({ href, className = "" }: { href: string; className?: string }) {
  return (
    <a
      href={href}
      aria-label="다음 섹션으로 이동"
      className={`flex h-10 w-10 items-center justify-center rounded-full border border-accent/15 bg-white/85 text-accent shadow-md shadow-accent/10 backdrop-blur-md transition-colors hover:bg-white hover:text-primary ${className}`}
    >
      <ChevronDown className="h-5 w-5 animate-gentle-bounce" strokeWidth={1.8} />
    </a>
  );
}

/* ═══════════════════════════════════════════════
 * B2C-S01: Hero 섹션
 * ═══════════════════════════════════════════════ */
function HeroSection() {
  return (
    <section
      id="hero"
      className="relative flex min-h-[75vh] items-center justify-center overflow-hidden px-6 py-10 pb-12"
    >
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/hero-bg.png"
          alt="Modern medical office"
          fill
          className="object-cover opacity-90 transition-transform duration-1000 hover:scale-105"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-background" />
      </div>

      <div className="relative z-10 mx-auto max-w-content text-center animate-fade-up">
        <div className="glass mx-auto mb-4 inline-flex items-center gap-2 rounded-full px-4 py-1.5 shadow-lg">
          <Sparkles className="h-4 w-4 text-accent" />
          <p className="text-xs font-bold tracking-wide text-primary">성공적인 개원의 시작점</p>
        </div>

        <h1 className="mx-auto mt-2 max-w-4xl text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl md:text-7xl drop-shadow-sm">
          리스크는 <span className="text-blue-400">AI</span>가 지우고,<br />
          수수료는 <span className="text-brand-gradient bg-clip-text text-transparent">홈쇼퍼</span>가 낮췄습니다.
        </h1>
        
        <p className="mx-auto mt-6 max-w-2xl text-lg font-medium text-white/80 md:text-xl">
          데이터 기반의 권리 분석과 합리적인 중개 시스템으로<br />
          당신의 첫 번째 병원을 안전하게 시작하세요.
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <a
            href="#contact"
            className="group relative flex items-center gap-2 overflow-hidden rounded-2xl bg-brand-gradient px-10 py-5 text-base font-bold text-white shadow-brand transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
          >
            <span className="relative z-10">무료 매물 상담 신청</span>
            <ChevronRight className="relative z-10 h-5 w-5 transition-transform group-hover:translate-x-1" />
          </a>
          <a
            href="#properties"
            className="glass flex items-center gap-2 rounded-2xl px-10 py-5 text-base font-bold text-primary transition-all hover:bg-white/90"
          >
            실시간 매물 보기
          </a>
        </div>
      </div>
      
      <SectionScrollIndicator href="#service-intro" className="absolute bottom-10 left-1/2 -translate-x-1/2" />
    </section>
  );
}

/* ═══════════════════════════════════════════════
 * B2C-S02: 핵심 가치 제안
 * ═══════════════════════════════════════════════ */
const VALUE_CARDS = [
  { icon: Percent, title: "중개 수수료 대폭 절감", desc: "플랫폼이 매칭부터 서류까지 — 중개사 업무 로드를 줄여 수수료를 낮춥니다" },
  { icon: ShieldCheck, title: "AI 권리관계 안심 분석", desc: "등기부등본·실거래가를 AI가 자동 분석하여 거래 리스크를 사전에 차단합니다" },
  { icon: Handshake, title: "전속 중개 매칭", desc: "검증된 제휴 중개사가 전속으로 배정되어 거래 완료까지 책임지고 함께합니다" },
] as const;

function ValuePropSection() {
  return (
    <section id="service-intro" className="dot-pattern relative scroll-mt-24 bg-background pt-24 pb-36">
      <div className="mx-auto max-w-content px-6 animate-fade-up">
        <div className="mb-16 text-center">
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-primary sm:text-4xl">왜 홈쇼퍼인가요?</h2>
          <p className="mt-4 text-base text-text-muted">개원을 준비하는 의사 선생님을 위한 세 가지 차별화된 약속</p>
        </div>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {VALUE_CARDS.map((card) => (
            <div key={card.title} className="group glass rounded-3xl p-10 transition-all duration-500 hover:-translate-y-2 hover:bg-white hover:shadow-2xl">
              <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-gradient text-white shadow-brand transition-transform group-hover:scale-110 group-hover:rotate-3">
                <card.icon className="h-8 w-8" strokeWidth={1.5} />
              </div>
              <h3 className="text-xl font-bold text-primary">{card.title}</h3>
              <p className="mt-4 text-base leading-relaxed text-text-muted">{card.desc}</p>
            </div>
          ))}
        </div>
      </div>
      <SectionScrollIndicator href="#service-flow" className="absolute bottom-10 left-1/2 -translate-x-1/2" />
    </section>
  );
}

/* ═══════════════════════════════════════════════
 * B2C-S03: 서비스 플로우
 * ═══════════════════════════════════════════════ */
const STEPS = [
  { icon: ClipboardEdit, title: "매물 상담 신청", desc: "원하시는 지역과 예산을 남겨주세요", highlight: false },
  { icon: UserCheck, title: "전담 매니저 배정", desc: "홈쇼퍼 전담 매니저가 맞춤 매물을 선별합니다", highlight: true },
  { icon: FileSignature, title: "전속 중개 매칭 및 계약", desc: "제휴 중개사와 함께 안전하게 계약을 진행합니다", highlight: false },
] as const;

function ServiceFlowSection() {
  return (
    <section id="service-flow" className="mesh-bg relative pt-28 pb-36">
      <div className="mx-auto max-w-content px-6 animate-fade-up">
        <div className="mb-20 text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-primary sm:text-4xl">간단한 3단계로 완성</h2>
          <p className="mt-4 text-lg text-text-muted">상담 신청부터 계약까지, 홈쇼퍼가 모든 과정을 함께합니다</p>
        </div>
        <div className="relative flex flex-col items-center gap-10 lg:flex-row lg:justify-between lg:gap-0">
          {/* Connecting Line (Desktop) - Removed per user request */}
          
          {STEPS.map((step, i) => (
            <div key={step.title} className="relative z-10 flex flex-col items-center lg:w-1/3">
              <div className={`group flex flex-col items-center rounded-3xl p-10 text-center transition-all duration-500 lg:w-72 ${step.highlight ? "glass ring-4 ring-accent/5 scale-105 shadow-2xl" : "bg-white/50 border border-white/20 hover:bg-white hover:shadow-xl"}`}>
                <span className="mb-6 inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white">0{i + 1}</span>
                <div className={`mb-6 flex h-20 w-20 items-center justify-center rounded-3xl transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6 ${step.highlight ? "bg-accent text-white shadow-brand" : "bg-accent/10 text-accent"}`}>
                  <step.icon className="h-10 w-10" strokeWidth={1.5} />
                </div>
                <h3 className="text-xl font-bold text-primary">{step.title}</h3>
                <p className="mt-4 text-sm leading-relaxed text-text-muted">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <SectionScrollIndicator href="#ai-analysis" className="absolute bottom-10 left-1/2 -translate-x-1/2" />
    </section>
  );
}

/* ═══════════════════════════════════════════════
 * B2C-S04: AI 안심 분석 데모 (Fake)
 * ═══════════════════════════════════════════════ */
type AnalysisStatus = "safe" | "caution" | "danger";

interface AnalysisItem {
  label: string;
  value: string;
  status: AnalysisStatus;
  detail: string;
  icon: LucideIcon;
}

interface SampleProperty {
  id: string;
  name: string;
  icon: LucideIcon;
  address: string;
  score: number;
  verdict: string;
  verdictStatus: AnalysisStatus;
  summary: string;
  recommendation: string;
  items: AnalysisItem[];
}

const STATUS_META: Record<AnalysisStatus, { label: string; badge: string; icon: LucideIcon; iconClass: string; tone: string }> = {
  safe: {
    label: "안전",
    badge: "border-green-200 bg-green-50 text-green-700",
    icon: CircleCheck,
    iconClass: "bg-green-50 text-green-600",
    tone: "text-green-600",
  },
  caution: {
    label: "주의",
    badge: "border-amber-200 bg-amber-50 text-amber-700",
    icon: TriangleAlert,
    iconClass: "bg-amber-50 text-amber-600",
    tone: "text-amber-600",
  },
  danger: {
    label: "위험",
    badge: "border-red-200 bg-red-50 text-red-700",
    icon: X,
    iconClass: "bg-red-50 text-red-600",
    tone: "text-red-600",
  },
};

const SAMPLE_PROPERTIES: SampleProperty[] = [
  {
    id: "a",
    name: "A 상가",
    icon: Building2,
    address: "전주시 덕진구 금암동 127-3",
    score: 98,
    verdict: "계약 진행 권장",
    verdictStatus: "safe",
    summary: "권리관계와 임대차 리스크가 낮고 호가도 적정 범위로 확인되었습니다.",
    recommendation: "현재 조건 기준으로 계약 검토를 진행해도 좋은 매물입니다.",
    items: [
      { label: "근저당권", value: "설정 없음", status: "safe", detail: "등기부상 선순위 담보권이 확인되지 않습니다.", icon: ShieldCheck },
      { label: "가압류/가처분", value: "해당 없음", status: "safe", detail: "권리 제한 사항이 없어 소유권 이전 리스크가 낮습니다.", icon: Scale },
      { label: "위반건축물", value: "해당 없음", status: "safe", detail: "건축물대장 기준 위반 항목이 확인되지 않습니다.", icon: Building2 },
      { label: "호가 적정성", value: "적정 범위", status: "safe", detail: "주변 실거래가와 임대 시세 대비 무리 없는 수준입니다.", icon: Banknote },
    ],
  },
  {
    id: "b",
    name: "B 빌딩",
    icon: Landmark,
    address: "서울시 강남구 역삼동 823-1",
    score: 82,
    verdict: "조건부 진행",
    verdictStatus: "caution",
    summary: "주요 권리 제한은 낮지만 선순위 근저당 말소 조건 확인이 필요합니다.",
    recommendation: "계약 전 말소 특약과 잔금일 처리 조건을 중개사와 재확인하세요.",
    items: [
      { label: "근저당권", value: "1건 확인", status: "caution", detail: "국민은행 3억 원 설정 건이 있어 매도 시 말소 조건 확인이 필요합니다.", icon: ShieldCheck },
      { label: "가압류/가처분", value: "해당 없음", status: "safe", detail: "권리 제한 사항은 별도로 확인되지 않습니다.", icon: Scale },
      { label: "기존 임차인", value: "2건 확인", status: "caution", detail: "인도 가능 시점과 기존 임대차 승계 여부를 확인해야 합니다.", icon: FileSignature },
      { label: "호가 적정성", value: "소폭 상회", status: "caution", detail: "비교 매물 대비 호가가 약간 높아 협상 여지가 있습니다.", icon: Banknote },
    ],
  },
  {
    id: "c",
    name: "C 메디컬타워",
    icon: Hospital,
    address: "전주시 완산구 서신동 891-5",
    score: 95,
    verdict: "개원 적합",
    verdictStatus: "safe",
    summary: "의료시설 기준과 주차 조건이 양호하며 권리관계도 안정적입니다.",
    recommendation: "진료과별 인테리어 동선과 관리비 조건을 추가 검토하면 좋습니다.",
    items: [
      { label: "근저당권", value: "설정 없음", status: "safe", detail: "선순위 담보권 없이 안정적인 권리 상태입니다.", icon: ShieldCheck },
      { label: "의료시설 기준", value: "적합", status: "safe", detail: "개원 용도에 필요한 기본 시설 기준을 충족합니다.", icon: Stethoscope },
      { label: "주차 확보", value: "기준 충족", status: "safe", detail: "법정 기준에 맞는 주차 여건이 확인되었습니다.", icon: MapPin },
      { label: "호가 적정성", value: "적정 범위", status: "safe", detail: "유사 메디컬 빌딩 임대 조건과 비교해 안정적입니다.", icon: Banknote },
    ],
  },
];

function StatusBadge({ status }: { status: AnalysisStatus }) {
  const meta = STATUS_META[status];
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-bold ${meta.badge}`}>
      {meta.label}
    </span>
  );
}

function ScoreGauge({ score, status }: { score: number; status: AnalysisStatus }) {
  const color = status === "safe" ? "#16A34A" : status === "caution" ? "#F59E0B" : "#DC2626";

  return (
    <div
      className="relative flex h-32 w-32 shrink-0 items-center justify-center rounded-full"
      style={{ background: `conic-gradient(${color} ${score * 3.6}deg, #E5E7EB 0deg)` }}
      aria-label={`안심 점수 ${score}점`}
    >
      <div className="flex h-24 w-24 flex-col items-center justify-center rounded-full bg-white shadow-inner">
        <span className="text-3xl font-extrabold text-primary">{score}</span>
        <span className="mt-0.5 text-[11px] font-bold text-text-muted">안심 점수</span>
      </div>
    </div>
  );
}

function AnalysisResultDashboard({ property }: { property: SampleProperty }) {
  const verdictMeta = STATUS_META[property.verdictStatus];
  const VerdictIcon = verdictMeta.icon;

  return (
    <div className="mesh-bg border-t border-primary/10 p-6 sm:p-10">
      <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
        {/* Left: Score Column */}
        <div className="flex flex-col items-center justify-center rounded-3xl bg-white p-8 shadow-xl shadow-primary/5">
          <ScoreGauge score={property.score} status={property.verdictStatus} />
          <div className="mt-8 w-full space-y-4">
            <div className="flex items-center justify-between text-sm font-medium">
              <span className="text-text-muted">시장 적합성</span>
              <span className="text-primary">95%</span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-primary/5">
              <div className="h-full w-[95%] bg-accent" />
            </div>
            <div className="flex items-center justify-between text-sm font-medium">
              <span className="text-text-muted">법률 안전성</span>
              <span className="text-primary">98%</span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-primary/5">
              <div className="h-full w-[98%] bg-green-500" />
            </div>
          </div>
        </div>

        {/* Right: Detailed Analysis */}
        <div className="space-y-6">
          <div className="glass flex flex-wrap items-center gap-4 rounded-3xl p-6">
            <span className={`flex h-12 w-12 items-center justify-center rounded-2xl ${verdictMeta.iconClass}`}>
              <VerdictIcon className="h-7 w-7" strokeWidth={2} />
            </span>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <StatusBadge status={property.verdictStatus} />
                <h4 className="text-xl font-bold text-primary">{property.verdict}</h4>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-text-muted">{property.summary}</p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {property.items.map((item) => {
              const ItemIcon = item.icon;
              const itemMeta = STATUS_META[item.status];

              return (
                <div key={item.label} className="group flex flex-col justify-between rounded-2xl bg-white p-5 shadow-sm transition-all hover:shadow-md">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`flex h-10 w-10 items-center justify-center rounded-xl transition-colors group-hover:bg-accent group-hover:text-white ${itemMeta.iconClass}`}>
                        <ItemIcon className="h-5 w-5" strokeWidth={1.5} />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-text-muted uppercase tracking-wider">{item.label}</p>
                        <p className="text-base font-bold text-primary">{item.value}</p>
                      </div>
                    </div>
                    <StatusBadge status={item.status} />
                  </div>
                  <p className="mt-4 text-xs leading-relaxed text-text-muted">{item.detail}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="mt-10 flex flex-col items-center justify-between gap-6 border-t border-primary/5 pt-10 sm:flex-row">
        <div>
          <p className="text-sm font-bold text-primary">이 분석은 AI 가독 모델을 기반으로 생성되었습니다.</p>
          <p className="text-xs text-text-muted">실제 계약 시 반드시 공인중개사와 법률 전문가의 재확인을 거치시기 바랍니다.</p>
        </div>
        <a href="#contact" className="group flex items-center gap-2 rounded-2xl bg-primary px-8 py-4 text-sm font-bold text-white transition-all hover:bg-accent hover:shadow-brand">
          <Sparkles className="h-4 w-4" />
          상세 리포트 받아보기
          <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </a>
      </div>
    </div>
  );
}

function AiDemoSection() {
  const [selected, setSelected] = useState("a");
  const [phase, setPhase] = useState<"idle" | "loading" | "done">("idle");
  const analysisTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const current = SAMPLE_PROPERTIES.find((p) => p.id === selected)!;

  useEffect(() => () => {
    if (analysisTimer.current) clearTimeout(analysisTimer.current);
  }, []);

  function handleAnalyze() {
    if (analysisTimer.current) clearTimeout(analysisTimer.current);
    setPhase("loading");
    analysisTimer.current = setTimeout(() => setPhase("done"), 900);
  }

  function handleSelect(id: string) {
    if (analysisTimer.current) clearTimeout(analysisTimer.current);
    setSelected(id);
    setPhase("idle");
  }

  return (
    <section id="ai-analysis" className="relative scroll-mt-24 bg-white py-24">
      <div className="mx-auto max-w-content px-6">
        <div className="mb-14 text-center">
          <div className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-accent/10 px-3 py-1 text-xs font-semibold text-accent">
            <Sparkles className="h-3.5 w-3.5" />AI 기술 미리보기
          </div>
          <h2 className="text-2xl font-extrabold tracking-tight text-primary sm:text-3xl">권리관계, AI가 먼저 확인합니다</h2>
          <p className="mt-3 text-sm text-text-muted sm:text-base">샘플 매물을 선택하고 분석 결과를 직접 확인해 보세요</p>
        </div>

        <div className="mx-auto max-w-4xl overflow-hidden rounded-2xl border border-primary/10 bg-white shadow-lg shadow-primary/5">
          <div className="grid border-b border-primary/10 bg-background sm:grid-cols-3">
            {SAMPLE_PROPERTIES.map((property) => {
              const Icon = property.icon;
              const active = selected === property.id;

              return (
                <button
                  key={property.id}
                  onClick={() => handleSelect(property.id)}
                  className={`flex min-h-16 items-center justify-center gap-2 border-b border-primary/10 px-4 py-4 text-sm font-bold transition-colors last:border-b-0 sm:border-b-0 sm:border-r sm:last:border-r-0 ${
                    active ? "bg-white text-primary shadow-sm" : "text-text-muted hover:bg-white/70 hover:text-primary"
                  }`}
                >
                  <Icon className={`h-4 w-4 ${active ? "text-accent" : ""}`} strokeWidth={1.8} />
                  <span>{property.name}</span>
                </button>
              );
            })}
          </div>

          <div className="flex flex-col gap-4 border-b border-primary/10 bg-white px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-base font-extrabold text-primary">{current.name}</p>
                <StatusBadge status={current.verdictStatus} />
              </div>
              <p className="mt-1 flex items-center gap-1.5 text-xs font-medium text-text-muted">
                <MapPin className="h-3.5 w-3.5" />
                {current.address}
              </p>
            </div>
            <button
              onClick={handleAnalyze}
              disabled={phase === "loading"}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-bold text-white shadow-md shadow-primary/10 transition-all hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {phase === "loading" ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShieldCheck className="h-4 w-4" />}
              {phase === "loading" ? "분석 중..." : "AI 권리 분석 시작"}
            </button>
          </div>

          {phase === "idle" && (
            <div className="grid gap-5 bg-background p-6 text-center sm:p-8">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-accent/10 text-accent">
                <ShieldCheck className="h-7 w-7" strokeWidth={1.7} />
              </div>
              <div>
                <p className="text-base font-extrabold text-primary">샘플 매물 리포트를 확인해 보세요</p>
                <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-text-muted">
                  등기부등본, 건축물대장, 임대 조건을 종합해 위험 신호를 카드 형태로 요약합니다.
                </p>
              </div>
            </div>
          )}

          {phase === "loading" && (
            <div className="flex min-h-80 items-center justify-center bg-background p-8">
              <div className="text-center">
                <Loader2 className="mx-auto h-8 w-8 animate-spin text-accent" />
                <p className="mt-4 text-sm font-bold text-primary">권리관계와 임대 조건을 대조하고 있습니다</p>
                <p className="mt-1 text-xs text-text-muted">잠시 후 신뢰도 리포트가 표시됩니다</p>
              </div>
            </div>
          )}

          {phase === "done" && <AnalysisResultDashboard property={current} />}
        </div>
        <SectionScrollIndicator href="#properties" className="absolute bottom-8 left-1/2 -translate-x-1/2" />
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════
 * B2C-S05: 매물 프리뷰
 * ═══════════════════════════════════════════════ */
interface PropertyItem {
  id: string;
  location: string;
  title: string;
  recommend: string;
  area: string;
  deposit: string;
  rent: string;
  status: "상담가능" | "매칭중";
  detail: string;
  thumbnailUrl?: string;
  thumbnailVariant: "map" | "building";
}

const PROPERTIES: PropertyItem[] = [
  { id: "p1", location: "전주시 덕진구 에코시티", title: "신축 메디컬타워", recommend: "내과 / 이비인후과 추천", area: "전용 45평", deposit: "보증금 5,000만", rent: "월 350만", status: "상담가능", thumbnailUrl: "/prop-1.png", thumbnailVariant: "building", detail: "2024년 준공된 신축 메디컬 전용 건물로, 엘리베이터 2기, 장애인 편의시설 완비. 에코시티 중심 상권에 위치하여 유동인구가 풍부하며, 주차장 80대 규모를 갖추고 있습니다. 내과·이비인후과 등 1차 진료과 개원에 최적화된 평면 구조입니다." },
  { id: "p2", location: "전주시 완산구 서신동", title: "대로변 1층 상가", recommend: "약국 / 치과 추천", area: "전용 32평", deposit: "보증금 7,000만", rent: "월 400만", status: "상담가능", thumbnailUrl: "/prop-2.png", thumbnailVariant: "map", detail: "4차선 대로변 코너에 위치한 1층 상가로, 간판 노출도가 매우 우수합니다. 전면 유리 파사드로 시인성이 높고, 인근 대단지 아파트 배후 세대 약 3,000세대를 확보하고 있어 약국·치과 등 높은 유동인구를 필요로 하는 업종에 적합합니다." },
  { id: "p3", location: "전주시 완산구 효자동", title: "대단지 아파트 단지내 상가", recommend: "소아과 추천", area: "전용 28평", deposit: "보증금 3,000만", rent: "월 200만", status: "매칭중", thumbnailUrl: "/prop-3.png", thumbnailVariant: "building", detail: "효자동 대단지 아파트(1,200세대) 단지 내 상가 2층에 위치하며, 엘리베이터 직결 동선을 갖추고 있습니다. 단지 내 어린이집 2곳, 초등학교 1곳 인접으로 소아과 개원 시 안정적인 내원 환자 확보가 가능한 입지입니다." },
];

function PropertyThumbnail({ property }: { property: PropertyItem }) {
  if (property.thumbnailUrl) {
    return (
      <div
        role="img"
        aria-label={`${property.title} 썸네일`}
        className="h-full w-full bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
        style={{ backgroundImage: `url(${property.thumbnailUrl})` }}
      />
    );
  }

  if (property.thumbnailVariant === "building") {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center bg-white text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/5 text-primary/70 transition-transform duration-300 group-hover:scale-105">
          <Building2 className="h-8 w-8" strokeWidth={1.5} />
        </div>
        <p className="mt-3 text-xs font-bold text-primary">건물 이미지 준비 중</p>
        <p className="mt-1 text-[11px] font-medium text-text-muted">{property.location}</p>
      </div>
    );
  }

  return (
    <div className="relative h-full w-full overflow-hidden bg-[#EEF2F0]">
      <div
        className="absolute inset-0 opacity-70"
        style={{
          backgroundImage:
            "linear-gradient(90deg, rgba(27,42,74,0.08) 1px, transparent 1px), linear-gradient(0deg, rgba(27,42,74,0.08) 1px, transparent 1px)",
          backgroundSize: "34px 34px",
        }}
      />
      <div className="absolute left-[-12%] top-[28%] h-4 w-[125%] rotate-[-12deg] rounded-full bg-white/90 shadow-sm" />
      <div className="absolute left-[18%] top-[-12%] h-[130%] w-4 rotate-[18deg] rounded-full bg-white/80 shadow-sm" />
      <div className="absolute right-[16%] top-[18%] h-[110%] w-3 rotate-[-28deg] rounded-full bg-accent/25" />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="rounded-2xl border border-white/80 bg-white/90 px-4 py-3 text-center shadow-lg shadow-primary/10 backdrop-blur-sm">
          <MapPin className="mx-auto h-6 w-6 text-accent" strokeWidth={2} />
          <p className="mt-1 text-xs font-extrabold text-primary">지도 썸네일</p>
          <p className="mt-0.5 text-[11px] font-medium text-text-muted">{property.location}</p>
        </div>
      </div>
    </div>
  );
}

function PropertyPreviewSection() {
  const [modal, setModal] = useState<PropertyItem | null>(null);
  const close = useCallback(() => setModal(null), []);

  useEffect(() => {
    if (!modal) return;
    const fn = (e: KeyboardEvent) => { if (e.key === "Escape") close(); };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [modal, close]);

  useEffect(() => {
    document.body.style.overflow = modal ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [modal]);

  return (
    <section id="properties" className="relative scroll-mt-24 bg-background py-24">
      <div className="mx-auto max-w-content px-6">
        <div className="mb-14 text-center">
          <div className="mb-4 flex flex-wrap items-center justify-center gap-2">
            <h2 className="text-2xl font-extrabold tracking-tight text-primary sm:text-3xl">현재 등록 매물</h2>
            <span className="inline-flex items-center gap-1 rounded-full bg-accent/10 px-3 py-1 text-[11px] font-semibold text-accent"><RefreshCw className="h-3 w-3" />신규 매물 업데이트 중</span>
          </div>
          <p className="text-sm text-text-muted sm:text-base">전주 지역 핵심 상권의 엄선된 매물을 확인해 보세요</p>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {PROPERTIES.map((p) => (
            <button key={p.id} onClick={() => setModal(p)} className="group flex h-full cursor-pointer flex-col overflow-hidden rounded-2xl border border-primary/5 bg-white p-0 text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/5">
              <div className="relative aspect-[16/10] w-full overflow-hidden border-b border-primary/5 bg-background">
                <PropertyThumbnail property={p} />
                <div className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-[11px] font-bold text-primary shadow-sm backdrop-blur-sm">
                  {p.location}
                </div>
                <div className={`absolute right-4 top-4 rounded-full px-3 py-1 text-[11px] font-bold shadow-sm ${p.status === "상담가능" ? "bg-brand-gradient text-white" : "bg-primary/75 text-white"}`}>
                  {p.status}
                </div>
              </div>
              <div className="flex flex-1 flex-col px-6 pb-6 pt-5">
                <h3 className="text-lg font-bold text-primary">{p.title}</h3>
                <div className="mt-1 flex items-center gap-1.5"><Stethoscope className="h-3.5 w-3.5 text-accent" /><span className="text-xs font-medium text-accent">{p.recommend}</span></div>
                <div className="mt-4 space-y-2">
                  <div className="flex items-center gap-2 text-sm text-text-muted"><Maximize className="h-3.5 w-3.5 shrink-0" />{p.area}</div>
                  <div className="flex items-center gap-2 text-sm text-text-muted"><Banknote className="h-3.5 w-3.5 shrink-0" />{p.deposit} · {p.rent}</div>
                  <div className="flex items-center gap-2 text-sm text-text-muted"><MapPin className="h-3.5 w-3.5 shrink-0" />{p.location}</div>
                </div>
                <p className="mt-auto pt-4 text-xs font-medium text-accent transition-colors group-hover:text-primary">클릭하여 상세 보기 →</p>
              </div>
            </button>
          ))}
        </div>
        <SectionScrollIndicator href="#faq" className="absolute bottom-8 left-1/2 -translate-x-1/2" />
      </div>

      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={close}>
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
          <div className="relative z-10 w-full max-w-lg rounded-2xl bg-white shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between border-b border-primary/10 px-6 py-5">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-extrabold text-primary">{modal.title}</h3>
                  <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${modal.status === "상담가능" ? "bg-accent/10 text-accent" : "bg-text-muted/10 text-text-muted"}`}>{modal.status}</span>
                </div>
                <p className="mt-1 flex items-center gap-1 text-sm text-text-muted"><MapPin className="h-3.5 w-3.5" />{modal.location}</p>
              </div>
              <button onClick={close} className="rounded-lg p-1.5 text-text-muted transition-colors hover:bg-primary/5 hover:text-primary"><X className="h-5 w-5" /></button>
            </div>
            <div className="px-6 py-5">
              <div className="mb-4 flex items-center gap-1.5"><Stethoscope className="h-4 w-4 text-accent" /><span className="text-sm font-semibold text-accent">{modal.recommend}</span></div>
              <div className="mb-5 grid grid-cols-3 gap-3">
                <div className="rounded-xl bg-background p-3 text-center"><p className="text-[10px] font-medium text-text-muted">면적</p><p className="mt-0.5 text-sm font-bold text-primary">{modal.area.replace("전용 ", "")}</p></div>
                <div className="rounded-xl bg-background p-3 text-center"><p className="text-[10px] font-medium text-text-muted">보증금</p><p className="mt-0.5 text-sm font-bold text-primary">{modal.deposit.replace("보증금 ", "")}</p></div>
                <div className="rounded-xl bg-background p-3 text-center"><p className="text-[10px] font-medium text-text-muted">월세</p><p className="mt-0.5 text-sm font-bold text-primary">{modal.rent.replace("월 ", "")}</p></div>
              </div>
              <p className="text-sm leading-relaxed text-text-muted">{modal.detail}</p>
            </div>
            <div className="border-t border-primary/10 px-6 py-5">
              <a href="#contact" onClick={close} className="block w-full rounded-xl bg-brand-gradient py-3.5 text-center text-sm font-bold text-white shadow-md shadow-accent/20 transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-accent/30">이 매물 상담 신청하기</a>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

/* ═══════════════════════════════════════════════
 * B2C-S06: FAQ
 * ═══════════════════════════════════════════════ */
const FAQ_DATA = [
  { q: "중개 수수료는 기존 대비 얼마나 절감되나요?", a: "플랫폼이 매칭과 서류 검토를 지원하여 중개사의 업무 로드를 줄인 만큼, 법정 수수료 대비 합리적이고 대폭 절감된 수수료율을 적용받으실 수 있습니다." },
  { q: "전속 중개란 무엇인가요?", a: "여러 부동산을 돌아다닐 필요 없이, 홈쇼퍼의 엄격한 검증을 통과한 전담 제휴 중개사 1곳이 배정되어 계약의 처음부터 끝까지 1:1로 책임지고 밀착 관리해 드리는 서비스입니다." },
  { q: "AI 분석은 어떤 항목을 검토하나요?", a: "건축물대장 및 등기부등본을 기반으로 근저당권, 가압류, 위반건축물 여부 등 권리관계의 안전성을 분석하고, 실거래가 데이터를 바탕으로 호가의 적정성을 평가해 드립니다." },
  { q: "현재 어떤 지역의 매물을 다루나요?", a: "현재 전북(전주) 지역의 주요 상권 및 메디컬 빌딩 매물을 집중적으로 다루고 있으며, 점진적으로 전국 단위로 확장할 예정입니다." },
  { q: "거래 과정에서 분쟁이 생기면 어떻게 하나요?", a: "홈쇼퍼 플랫폼이 매수자와 중개사 사이에서 원활한 소통을 돕고, 필요시 제휴된 법률 자문망을 통해 안전하게 분쟁이 조율될 수 있도록 적극 지원합니다." },
];

function FaqSection() {
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  return (
    <section id="faq" className="relative bg-white py-24">
      <div className="mx-auto max-w-content px-6">
        <div className="mb-14 text-center">
          <h2 className="text-2xl font-extrabold tracking-tight text-primary sm:text-3xl">자주 묻는 질문</h2>
          <p className="mt-3 text-sm text-text-muted sm:text-base">궁금한 점이 더 있으시면 상담을 신청해 주세요</p>
        </div>
        <div className="mx-auto max-w-2xl divide-y divide-primary/10 rounded-2xl border border-primary/10 bg-background">
          {FAQ_DATA.map((item, i) => {
            const open = openIdx === i;
            return (
              <div key={i}>
                <button onClick={() => setOpenIdx(open ? null : i)} className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left transition-colors hover:bg-white/60">
                  <span className={`text-sm font-semibold leading-snug sm:text-base ${open ? "text-primary" : "text-primary/80"}`}>{item.q}</span>
                  {open ? <ChevronUp className="h-5 w-5 shrink-0 text-accent" /> : <ChevronDown className="h-5 w-5 shrink-0 text-text-muted" />}
                </button>
                <div className={`grid transition-all duration-300 ease-in-out ${open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
                  <div className="overflow-hidden"><p className="px-6 pb-5 text-sm leading-relaxed text-text-muted">{item.a}</p></div>
                </div>
              </div>
            );
          })}
        </div>
        <SectionScrollIndicator href="#contact" className="absolute bottom-8 left-1/2 -translate-x-1/2" />
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════
 * B2C-S07: 리드 수집 폼 (사전예약)
 * ─ 제출 완료 후 /thankyou에서 공유 및 상세 조건 입력 유도
 * ═══════════════════════════════════════════════ */

/** 전화번호 자동 포맷팅: 01012345678 → 010-1234-5678 */
function formatPhone(raw: string): string {
  const nums = raw.replace(/\D/g, "").slice(0, 11);
  if (nums.length <= 3) return nums;
  if (nums.length <= 7) return `${nums.slice(0, 3)}-${nums.slice(3)}`;
  return `${nums.slice(0, 3)}-${nums.slice(3, 7)}-${nums.slice(7)}`;
}

interface FormErrors {
  name?: string;
  phone?: string;
  privacy?: string;
}

function LeadFormSection() {
  const router = useRouter();
  /* ── 폼 상태 ── */
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [privacy, setPrivacy] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);

  /** 유효성 검사 */
  function validate(): FormErrors {
    const e: FormErrors = {};
    if (!name.trim()) e.name = "이름을 입력해 주세요";
    const digits = phone.replace(/\D/g, "");
    if (!digits) e.phone = "연락처를 입력해 주세요";
    else if (digits.length < 10 || digits.length > 11) e.phone = "올바른 전화번호를 입력해 주세요";
    if (!privacy) e.privacy = "개인정보 수집·이용에 동의해 주세요";
    return e;
  }

  /** 제출 핸들러 */
  async function handleSubmit() {
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setSubmitting(true);

    /*
     * MVP 단계: 실제 Supabase / Slack 연동은 Edge Function에서 처리.
     * 아래는 네트워크 지연을 모의하는 코드임.
     * 실제 배포 시 fetch("/api/leads", { method: "POST", body: ... }) 로 교체.
     */
    await new Promise((r) => setTimeout(r, 1500));

    setSubmitting(false);
    router.push("/thankyou");
  }

  /* ── 폼 UI ── */
  const isValid = name.trim() && phone.replace(/\D/g, "").length >= 10 && privacy;

  return (
    <section id="contact" className="scroll-mt-24 bg-gradient-to-b from-background to-white py-24">
      <div className="mx-auto max-w-content px-6">
        <div className="mx-auto max-w-md">
          {/* 헤더 */}
          <div className="mb-10 text-center">
            <h2 className="text-2xl font-extrabold tracking-tight text-primary sm:text-3xl">
              지금 상담 신청하세요
            </h2>
            <p className="mt-3 text-sm text-text-muted">
              맞춤 매물과 무료 AI 권리 분석 리포트를 받아보세요
            </p>
          </div>

          {/* 폼 카드 */}
          <div className="rounded-2xl border border-primary/10 bg-white p-6 shadow-sm sm:p-8">
            {/* 이름 */}
            <div className="mb-5">
              <label htmlFor="name" className="mb-1.5 block text-sm font-semibold text-primary">
                이름 <span className="text-red-400">*</span>
              </label>
              <input
                id="name"
                type="text"
                placeholder="홍길동"
                value={name}
                onChange={(e) => { setName(e.target.value); setErrors((p) => ({ ...p, name: undefined })); }}
                className={`w-full rounded-xl border px-4 py-3 text-sm text-primary outline-none
                  transition-colors placeholder:text-text-muted/50
                  focus:border-accent focus:ring-2 focus:ring-accent/20
                  ${errors.name ? "border-red-400" : "border-primary/10"}`}
              />
              {errors.name && <p className="mt-1 text-xs text-red-400">{errors.name}</p>}
            </div>

            {/* 연락처 */}
            <div className="mb-5">
              <label htmlFor="phone" className="mb-1.5 block text-sm font-semibold text-primary">
                연락처 <span className="text-red-400">*</span>
              </label>
              <input
                id="phone"
                type="tel"
                inputMode="numeric"
                placeholder="010-0000-0000"
                value={phone}
                onChange={(e) => {
                  setPhone(formatPhone(e.target.value));
                  setErrors((p) => ({ ...p, phone: undefined }));
                }}
                className={`w-full rounded-xl border px-4 py-3 text-sm text-primary outline-none
                  transition-colors placeholder:text-text-muted/50
                  focus:border-accent focus:ring-2 focus:ring-accent/20
                  ${errors.phone ? "border-red-400" : "border-primary/10"}`}
              />
              {errors.phone && <p className="mt-1 text-xs text-red-400">{errors.phone}</p>}
            </div>

            {/* 이메일 (선택) */}
            <div className="mb-6">
              <label htmlFor="email" className="mb-1.5 block text-sm font-semibold text-primary">
                이메일 <span className="text-xs font-normal text-text-muted">(선택)</span>
              </label>
              <input
                id="email"
                type="email"
                placeholder="example@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-primary/10 px-4 py-3 text-sm text-primary
                           outline-none transition-colors placeholder:text-text-muted/50
                           focus:border-accent focus:ring-2 focus:ring-accent/20"
              />
            </div>

            {/* 개인정보 동의 */}
            <div className="mb-6">
              <label className="flex cursor-pointer items-start gap-3">
                <input
                  type="checkbox"
                  checked={privacy}
                  onChange={(e) => { setPrivacy(e.target.checked); setErrors((p) => ({ ...p, privacy: undefined })); }}
                  className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer rounded border-primary/20
                             text-accent accent-accent focus:ring-accent/30"
                />
                <span className="text-xs leading-relaxed text-text-muted">
                  <span className="font-semibold text-primary">[필수]</span>{" "}
                  개인정보 수집 및 이용에 동의합니다.
                  수집 항목: 이름, 연락처, 이메일 | 이용 목적: 매물 상담 및 안내
                  | 보유 기간: 상담 완료 후 1년
                </span>
              </label>
              {errors.privacy && <p className="mt-1 pl-7 text-xs text-red-400">{errors.privacy}</p>}
            </div>

            {/* 제출 버튼 */}
            <button
              onClick={handleSubmit}
              disabled={submitting || !isValid}
              className="flex h-13 w-full items-center justify-center gap-2 rounded-xl
                         bg-brand-gradient py-3.5 text-sm font-bold text-white shadow-md
                         shadow-accent/20 transition-all
                         hover:-translate-y-0.5 hover:shadow-lg hover:shadow-accent/30
                         disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-40
                         disabled:shadow-none"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  신청 처리 중...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  매물 상담 신청하기
                </>
              )}
            </button>

            <p className="mt-3 text-center text-[11px] text-text-muted">
              전담 매니저가 24시간 내 연락드리겠습니다
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════
 * 페이지 조립
 * ═══════════════════════════════════════════════ */
export default function HomePage() {
  return (
    <>
      <HeroSection />
      <ValuePropSection />
      <ServiceFlowSection />
      <AiDemoSection />
      <PropertyPreviewSection />
      <FaqSection />
      <LeadFormSection />
    </>
  );
}
