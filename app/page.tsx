"use client";

/*
 * B2C 메인 랜딩 페이지
 * 섹션 ID: B2C-S01 ~ B2C-S08
 */

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import {
  BadgeCheck,
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
  Link2,
  MessageCircle,
  Share2,
  Check,
  Send,
  ArrowRight,
  CircleCheck,
} from "lucide-react";

const QUICK_ACCESS_LINKS = [
  { label: "매물", href: "#properties", icon: Building2, type: "anchor" },
  { label: "AI 분석", href: "#ai-analysis", icon: Sparkles, type: "anchor" },
  { label: "상담", href: "#contact", icon: MessageCircle, type: "anchor" },
  { label: "내 제안", href: "/dashboard", icon: UserCheck, type: "page" },
  { label: "제휴", href: "/partner", icon: Handshake, type: "page" },
] as const;

/* ═══════════════════════════════════════════════
 * B2C-S01: Hero 섹션
 * ═══════════════════════════════════════════════ */
function HeroSection() {
  return (
    <section
      id="hero"
      className="relative flex min-h-[80vh] items-center justify-center overflow-hidden
                 bg-gradient-to-br from-background via-white to-primary/5"
    >
      <div className="pointer-events-none absolute -right-32 -top-32 h-[480px] w-[480px] rounded-full bg-accent/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -left-40 h-[400px] w-[400px] rounded-full bg-primary/5 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-content px-6 text-center">
        <div className="mb-8 flex flex-wrap items-center justify-center gap-3">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/10 bg-white/70 px-4 py-1.5 text-xs font-semibold text-primary backdrop-blur-sm">
            <BadgeCheck className="h-3.5 w-3.5 text-accent" />
            특허 출원 완료
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/10 bg-white/70 px-4 py-1.5 text-xs font-semibold text-primary backdrop-blur-sm">
            <BadgeCheck className="h-3.5 w-3.5 text-accent" />
            전주 지역 제휴 중개사 운영 중
          </span>
        </div>

        <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-primary sm:text-5xl md:text-6xl">
          개원, 이제
          <br className="sm:hidden" />
          <span className="text-accent"> 부동산</span>부터
          <br />
          안심하세요
        </h1>

        <p className="mx-auto mt-6 max-w-lg text-base leading-relaxed text-text-muted sm:text-lg">
          전속 중개 매칭 + 권리관계 AI 분석으로
          <br className="hidden sm:block" />
          중개 수수료를 대폭 절감하세요
        </p>

        <a
          href="#contact"
          className="mt-10 inline-block rounded-xl bg-accent px-8 py-4 text-sm font-bold text-white shadow-lg shadow-accent/25 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-accent/30 active:translate-y-0 sm:text-base"
        >
          매물 상담 신청하기
        </a>

        <nav
          aria-label="빠른 이동"
          className="mx-auto mt-8 w-full max-w-3xl rounded-2xl border border-primary/10 bg-white/80 p-3 shadow-lg shadow-primary/5 backdrop-blur-md"
        >
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
            {QUICK_ACCESS_LINKS.map((item) => {
              const Icon = item.icon;
              const className =
                "group flex min-h-16 flex-col items-center justify-center gap-1.5 rounded-xl px-2 py-3 text-xs font-bold text-primary transition-all duration-200 hover:-translate-y-0.5 hover:bg-accent/10 hover:text-accent active:translate-y-0 sm:text-sm";
              const content = (
                <>
                  <Icon className="h-5 w-5 text-accent transition-transform group-hover:scale-110" strokeWidth={1.8} />
                  <span className="leading-none">{item.label}</span>
                </>
              );

              return item.type === "page" ? (
                <Link key={item.href} href={item.href} className={className}>
                  {content}
                </Link>
              ) : (
                <a key={item.href} href={item.href} className={className}>
                  {content}
                </a>
              );
            })}
          </div>
        </nav>
      </div>
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
    <section id="service-intro" className="scroll-mt-24 bg-white py-24">
      <div className="mx-auto max-w-content px-6">
        <div className="mb-14 text-center">
          <h2 className="text-2xl font-extrabold tracking-tight text-primary sm:text-3xl">왜 홈쇼퍼인가요?</h2>
          <p className="mt-3 text-sm text-text-muted sm:text-base">개원을 준비하는 의사 선생님을 위한 세 가지 약속</p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {VALUE_CARDS.map((card) => (
            <div key={card.title} className="group rounded-2xl border border-primary/5 bg-background p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:shadow-primary/5">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10 transition-colors group-hover:bg-accent/20">
                <card.icon className="h-6 w-6 text-accent" strokeWidth={1.8} />
              </div>
              <h3 className="text-lg font-bold text-primary">{card.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-text-muted">{card.desc}</p>
            </div>
          ))}
        </div>
      </div>
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
    <section id="service-flow" className="bg-background py-24">
      <div className="mx-auto max-w-content px-6">
        <div className="mb-14 text-center">
          <h2 className="text-2xl font-extrabold tracking-tight text-primary sm:text-3xl">간단한 3단계로 완성</h2>
          <p className="mt-3 text-sm text-text-muted sm:text-base">상담 신청부터 계약까지, 홈쇼퍼가 함께합니다</p>
        </div>
        <div className="flex flex-col items-center gap-4 lg:flex-row lg:justify-center lg:gap-0">
          {STEPS.map((step, i) => (
            <div key={step.title} className="flex flex-col items-center lg:flex-row">
              <div className={`relative flex w-full max-w-xs flex-col items-center rounded-2xl p-8 text-center transition-all duration-300 lg:w-64 ${step.highlight ? "border-2 border-accent/40 bg-white shadow-lg shadow-accent/10" : "border border-primary/5 bg-white"}`}>
                {step.highlight && <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-accent px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">Core</span>}
                <span className="mb-4 text-xs font-bold text-text-muted">STEP {i + 1}</span>
                <div className={`mb-4 flex h-14 w-14 items-center justify-center rounded-2xl ${step.highlight ? "bg-accent/15" : "bg-primary/5"}`}>
                  <step.icon className={`h-7 w-7 ${step.highlight ? "text-accent" : "text-primary/60"}`} strokeWidth={1.6} />
                </div>
                <h3 className={`text-base font-bold ${step.highlight ? "text-accent" : "text-primary"}`}>{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-text-muted">{step.desc}</p>
              </div>
              {i < STEPS.length - 1 && (
                <>
                  <div className="hidden px-3 lg:flex lg:items-center"><ChevronRight className="h-6 w-6 text-text-muted/40" /></div>
                  <div className="flex py-1 lg:hidden"><ChevronDown className="h-6 w-6 text-text-muted/40" /></div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════
 * B2C-S04: AI 안심 분석 데모 (Fake)
 * ═══════════════════════════════════════════════ */
interface SampleProperty { id: string; name: string; icon: typeof Building2; address: string; result: string; }

const SAMPLE_PROPERTIES: SampleProperty[] = [
  { id: "a", name: "A 상가", icon: Building2, address: "전주시 덕진구 금암동 127-3",
    result: `🔍 등기부등본 및 건축물대장 분석 중...\n\n━━━ 권리관계 분석 결과 ━━━\n\n- 근저당권 설정: 없음 (안전)\n- 가압류/가처분: 해당 사항 없음 (안전)\n- 위반건축물 여부: 해당 사항 없음 (안전)\n- 상가건물 임대차보호법 적용 범위: 확인 완료\n- 실거래가 대비 호가 적정성: 적정 범위 내\n\n✅ 최종 안심 점수: 98점 / 100점\n→ 계약 진행을 권장합니다.` },
  { id: "b", name: "B 빌딩", icon: Landmark, address: "서울시 강남구 역삼동 823-1",
    result: `🔍 등기부등본 및 건축물대장 분석 중...\n\n━━━ 권리관계 분석 결과 ━━━\n\n- 근저당권 설정: 1건 (국민은행, 3억 원)\n  ⚠️ 매도 시 말소 조건 확인 필요\n- 가압류/가처분: 해당 사항 없음 (안전)\n- 위반건축물 여부: 해당 사항 없음 (안전)\n- 임대차 현황: 기존 임차인 2건 확인\n- 실거래가 대비 호가 적정성: 소폭 상회\n\n⚠️ 최종 안심 점수: 82점 / 100점\n→ 근저당 말소 조건 확인 후 진행을 권장합니다.` },
  { id: "c", name: "C 메디컬타워", icon: Hospital, address: "전주시 완산구 서신동 891-5",
    result: `🔍 등기부등본 및 건축물대장 분석 중...\n\n━━━ 권리관계 분석 결과 ━━━\n\n- 근저당권 설정: 없음 (안전)\n- 가압류/가처분: 해당 사항 없음 (안전)\n- 위반건축물 여부: 해당 사항 없음 (안전)\n- 의료법 시설 기준 적합 여부: 적합\n- 주차장 확보 비율: 법정 기준 충족\n- 실거래가 대비 호가 적정성: 적정 범위 내\n\n✅ 최종 안심 점수: 95점 / 100점\n→ 개원 용도로 적합하며, 계약 진행을 권장합니다.` },
];

function AiDemoSection() {
  const [selected, setSelected] = useState("a");
  const [phase, setPhase] = useState<"idle" | "loading" | "typing" | "done">("idle");
  const [displayed, setDisplayed] = useState("");
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const resultRef = useRef<HTMLDivElement>(null);
  const current = SAMPLE_PROPERTIES.find((p) => p.id === selected)!;

  useEffect(() => () => { if (intervalRef.current) clearInterval(intervalRef.current); }, []);

  function handleAnalyze() {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setDisplayed(""); setPhase("loading");
    setTimeout(() => {
      setPhase("typing");
      const full = current.result; let idx = 0;
      intervalRef.current = setInterval(() => {
        idx++; setDisplayed(full.slice(0, idx));
        if (resultRef.current) resultRef.current.scrollTop = resultRef.current.scrollHeight;
        if (idx >= full.length) { if (intervalRef.current) clearInterval(intervalRef.current); setPhase("done"); }
      }, 18);
    }, 1200);
  }

  function handleSelect(id: string) {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setSelected(id); setPhase("idle"); setDisplayed("");
  }

  return (
    <section id="ai-analysis" className="scroll-mt-24 bg-white py-24">
      <div className="mx-auto max-w-content px-6">
        <div className="mb-14 text-center">
          <div className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-accent/10 px-3 py-1 text-xs font-semibold text-accent">
            <Sparkles className="h-3.5 w-3.5" />AI 기술 미리보기
          </div>
          <h2 className="text-2xl font-extrabold tracking-tight text-primary sm:text-3xl">권리관계, AI가 먼저 확인합니다</h2>
          <p className="mt-3 text-sm text-text-muted sm:text-base">샘플 매물을 선택하고 분석 결과를 직접 확인해 보세요</p>
        </div>
        <div className="mx-auto max-w-3xl overflow-hidden rounded-2xl border border-primary/10 bg-background shadow-sm">
          <div className="flex border-b border-primary/10">
            {SAMPLE_PROPERTIES.map((p) => { const Icon = p.icon; const a = selected === p.id; return (
              <button key={p.id} onClick={() => handleSelect(p.id)} className={`flex flex-1 items-center justify-center gap-2 px-4 py-3.5 text-sm font-semibold transition-colors ${a ? "border-b-2 border-accent bg-white text-primary" : "text-text-muted hover:bg-white/60 hover:text-primary"}`}>
                <Icon className={`h-4 w-4 ${a ? "text-accent" : ""}`} /><span className="hidden sm:inline">{p.name}</span><span className="sm:hidden">{p.name.split(" ")[0]}</span>
              </button>); })}
          </div>
          <div className="flex flex-col items-start justify-between gap-4 border-b border-primary/10 bg-white px-6 py-4 sm:flex-row sm:items-center">
            <div><p className="text-sm font-bold text-primary">{current.name}</p><p className="mt-0.5 text-xs text-text-muted">{current.address}</p></div>
            <button onClick={handleAnalyze} disabled={phase === "loading" || phase === "typing"} className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50">
              {phase === "loading" || phase === "typing" ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShieldCheck className="h-4 w-4" />}
              {phase === "loading" ? "분석 준비 중..." : phase === "typing" ? "분석 중..." : "AI 권리 분석 시작"}
            </button>
          </div>
          <div ref={resultRef} className="h-72 overflow-y-auto bg-[#1a1a2e] p-6 font-mono text-sm leading-relaxed sm:h-80">
            {phase === "idle" && <p className="text-gray-500">← 매물을 선택하고 <span className="text-gray-400">[AI 권리 분석 시작]</span> 버튼을 눌러보세요</p>}
            {phase === "loading" && <div className="flex items-center gap-3 text-accent"><Loader2 className="h-5 w-5 animate-spin" /><span>데이터를 수집하고 있습니다...</span></div>}
            {(phase === "typing" || phase === "done") && <pre className="whitespace-pre-wrap text-green-400">{displayed}{phase === "typing" && <span className="animate-pulse text-accent">▌</span>}</pre>}
          </div>
          {phase === "done" && (
            <div className="border-t border-primary/10 bg-white px-6 py-5 text-center">
              <a href="#contact" className="inline-flex items-center gap-2 rounded-xl bg-accent px-6 py-3 text-sm font-bold text-white shadow-md shadow-accent/20 transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-accent/30"><Sparkles className="h-4 w-4" />내 매물도 분석받기</a>
              <p className="mt-2 text-xs text-text-muted">상담을 신청하시면 실제 매물에 대한 분석을 무료로 제공해 드립니다</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════
 * B2C-S05: 매물 프리뷰
 * ═══════════════════════════════════════════════ */
interface PropertyItem { id: string; location: string; title: string; recommend: string; area: string; deposit: string; rent: string; status: "상담가능" | "매칭중"; detail: string; }

const PROPERTIES: PropertyItem[] = [
  { id: "p1", location: "전주시 덕진구 에코시티", title: "신축 메디컬타워", recommend: "내과 / 이비인후과 추천", area: "전용 45평", deposit: "보증금 5,000만", rent: "월 350만", status: "상담가능", detail: "2024년 준공된 신축 메디컬 전용 건물로, 엘리베이터 2기, 장애인 편의시설 완비. 에코시티 중심 상권에 위치하여 유동인구가 풍부하며, 주차장 80대 규모를 갖추고 있습니다. 내과·이비인후과 등 1차 진료과 개원에 최적화된 평면 구조입니다." },
  { id: "p2", location: "전주시 완산구 서신동", title: "대로변 1층 상가", recommend: "약국 / 치과 추천", area: "전용 32평", deposit: "보증금 7,000만", rent: "월 400만", status: "상담가능", detail: "4차선 대로변 코너에 위치한 1층 상가로, 간판 노출도가 매우 우수합니다. 전면 유리 파사드로 시인성이 높고, 인근 대단지 아파트 배후 세대 약 3,000세대를 확보하고 있어 약국·치과 등 높은 유동인구를 필요로 하는 업종에 적합합니다." },
  { id: "p3", location: "전주시 완산구 효자동", title: "대단지 아파트 단지내 상가", recommend: "소아과 추천", area: "전용 28평", deposit: "보증금 3,000만", rent: "월 200만", status: "매칭중", detail: "효자동 대단지 아파트(1,200세대) 단지 내 상가 2층에 위치하며, 엘리베이터 직결 동선을 갖추고 있습니다. 단지 내 어린이집 2곳, 초등학교 1곳 인접으로 소아과 개원 시 안정적인 내원 환자 확보가 가능한 입지입니다." },
];

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
    <section id="properties" className="scroll-mt-24 bg-background py-24">
      <div className="mx-auto max-w-content px-6">
        <div className="mb-14 text-center">
          <div className="mb-4 flex items-center justify-center gap-2">
            <h2 className="text-2xl font-extrabold tracking-tight text-primary sm:text-3xl">현재 등록 매물</h2>
            <span className="inline-flex items-center gap-1 rounded-full bg-accent/10 px-3 py-1 text-[11px] font-semibold text-accent"><RefreshCw className="h-3 w-3" />신규 매물 업데이트 중</span>
          </div>
          <p className="text-sm text-text-muted sm:text-base">전주 지역 핵심 상권의 엄선된 매물을 확인해 보세요</p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {PROPERTIES.map((p) => (
            <button key={p.id} onClick={() => setModal(p)} className="group cursor-pointer rounded-2xl border border-primary/5 bg-white p-0 text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/5">
              <div className={`flex items-center justify-between rounded-t-2xl px-6 py-3 ${p.status === "상담가능" ? "bg-primary" : "bg-text-muted/80"}`}>
                <span className="text-xs font-semibold text-white/80">{p.location}</span>
                <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${p.status === "상담가능" ? "bg-accent text-white" : "bg-white/20 text-white"}`}>{p.status}</span>
              </div>
              <div className="px-6 pb-6 pt-5">
                <h3 className="text-lg font-bold text-primary">{p.title}</h3>
                <div className="mt-1 flex items-center gap-1.5"><Stethoscope className="h-3.5 w-3.5 text-accent" /><span className="text-xs font-medium text-accent">{p.recommend}</span></div>
                <div className="mt-4 space-y-2">
                  <div className="flex items-center gap-2 text-sm text-text-muted"><Maximize className="h-3.5 w-3.5 shrink-0" />{p.area}</div>
                  <div className="flex items-center gap-2 text-sm text-text-muted"><Banknote className="h-3.5 w-3.5 shrink-0" />{p.deposit} · {p.rent}</div>
                  <div className="flex items-center gap-2 text-sm text-text-muted"><MapPin className="h-3.5 w-3.5 shrink-0" />{p.location}</div>
                </div>
                <p className="mt-4 text-xs font-medium text-accent transition-colors group-hover:text-primary">클릭하여 상세 보기 →</p>
              </div>
            </button>
          ))}
        </div>
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
              <a href="#contact" onClick={close} className="block w-full rounded-xl bg-accent py-3.5 text-center text-sm font-bold text-white shadow-md shadow-accent/20 transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-accent/30">이 매물 상담 신청하기</a>
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
    <section id="faq" className="bg-white py-24">
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
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════
 * B2C-S07: 메신저 공유 바
 * ─ 카카오톡(모의) · 링크 복사(Clipboard API) · 문자 공유
 * ═══════════════════════════════════════════════ */

function ShareBar() {
  /* 토스트 노출 상태 */
  const [toast, setToast] = useState(false);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  /** 링크 복사 — Clipboard API 사용 */
  async function handleCopyLink() {
    const url = typeof window !== "undefined" ? window.location.href : "";
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      /* fallback: 구형 브라우저 */
      const ta = document.createElement("textarea");
      ta.value = url; document.body.appendChild(ta);
      ta.select(); document.execCommand("copy");
      document.body.removeChild(ta);
    }
    /* 토스트 표시 (2.5초 후 자동 사라짐) */
    setToast(true);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(false), 2500);
  }

  /** 카카오톡 공유 — SDK 로드 전 모의 로직 */
  function handleKakaoShare() {
    /*
     * 실제 배포 시 Kakao SDK 초기화 후 아래 코드 활성화:
     * Kakao.Share.sendDefault({ objectType: 'feed', content: { ... } });
     *
     * MVP에서는 모바일이면 카카오톡 딥링크, 아니면 알림 표시.
     */
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent("개원 부동산, 이제 안심하세요 — 홈쇼퍼");
    const kakaoLink = `https://sharer.kakao.com/talk/friends/picker/link?url=${url}&text=${text}`;
    window.open(kakaoLink, "_blank", "width=480,height=640");
  }

  /** SMS 문자 공유 */
  function handleSmsShare() {
    const body = encodeURIComponent(`개원 부동산, 이제 안심하세요 — 홈쇼퍼\n${window.location.href}`);
    window.location.href = `sms:?body=${body}`;
  }

  return (
    <section id="share-bar" className="bg-background py-16">
      <div className="mx-auto max-w-content px-6">
        <div className="relative mx-auto max-w-md">
          {/* 헤더 */}
          <p className="mb-5 text-center text-sm font-semibold text-primary">
            주변 동료 선생님께 알려주세요
          </p>

          {/* 버튼 그룹 — 44px 최소 터치 영역 확보 */}
          <div className="flex items-center justify-center gap-3">
            {/* 카카오톡 */}
            <button
              onClick={handleKakaoShare}
              className="flex h-12 items-center gap-2 rounded-xl bg-[#FEE500] px-5
                         text-sm font-bold text-[#3C1E1E] shadow-sm transition-all
                         hover:-translate-y-0.5 hover:shadow-md active:translate-y-0"
              aria-label="카카오톡으로 공유"
            >
              <MessageCircle className="h-5 w-5" />
              <span className="hidden sm:inline">카카오톡</span>
            </button>

            {/* 링크 복사 */}
            <button
              onClick={handleCopyLink}
              className="flex h-12 items-center gap-2 rounded-xl border border-primary/10
                         bg-white px-5 text-sm font-bold text-primary shadow-sm transition-all
                         hover:-translate-y-0.5 hover:shadow-md active:translate-y-0"
              aria-label="링크 복사"
            >
              <Link2 className="h-5 w-5" />
              <span className="hidden sm:inline">링크 복사</span>
            </button>

            {/* 문자 공유 */}
            <button
              onClick={handleSmsShare}
              className="flex h-12 items-center gap-2 rounded-xl border border-primary/10
                         bg-white px-5 text-sm font-bold text-primary shadow-sm transition-all
                         hover:-translate-y-0.5 hover:shadow-md active:translate-y-0"
              aria-label="문자로 공유"
            >
              <Share2 className="h-5 w-5" />
              <span className="hidden sm:inline">문자</span>
            </button>
          </div>

          {/* 토스트 알림 */}
          <div
            className={`pointer-events-none absolute -bottom-12 left-1/2 -translate-x-1/2
                        transition-all duration-300
                        ${toast ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"}`}
          >
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-xs font-semibold text-white shadow-lg">
              <Check className="h-3.5 w-3.5" />
              링크가 복사되었습니다
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════
 * B2C-S08: 리드 수집 폼 (사전예약)
 * ─ Two-step 흐름: 제출 완료 → /offer 유도
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
  /* ── 폼 상태 ── */
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [privacy, setPrivacy] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

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
    setSubmitted(true);
  }

  /* ── 제출 완료 화면 (Two-step → /offer 유도) ── */
  if (submitted) {
    return (
      <section id="contact" className="scroll-mt-24 bg-gradient-to-b from-background to-white py-24">
        <div className="mx-auto max-w-content px-6">
          <div className="mx-auto max-w-md text-center">
            {/* 체크 아이콘 */}
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-50">
              <CircleCheck className="h-10 w-10 text-green-500" strokeWidth={1.5} />
            </div>

            <h2 className="text-2xl font-extrabold text-primary">
              신청이 완료되었습니다!
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-text-muted">
              전담 매니저가 <strong className="text-primary">24시간 내</strong>에
              연락드리겠습니다.
            </p>

            {/* Two-step: OfferSheet 유도 */}
            <div className="mt-8 rounded-2xl border border-accent/20 bg-accent/5 p-6">
              <p className="text-sm font-semibold text-primary">
                조금 더 구체적인 조건을 알려주시면
                <br />
                <span className="text-accent">찰떡같은 매물</span>을 찾아드릴게요!
              </p>
              <a
                href="/offer"
                className="mt-4 inline-flex items-center gap-2 rounded-xl bg-accent px-6 py-3 text-sm
                           font-bold text-white shadow-md shadow-accent/20 transition-all
                           hover:-translate-y-0.5 hover:shadow-lg hover:shadow-accent/30"
              >
                상세 조건 입력하기
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>

            {/* 홈으로 */}
            <button
              onClick={() => { setSubmitted(false); setName(""); setPhone(""); setEmail(""); setPrivacy(false); setErrors({}); }}
              className="mt-4 text-xs text-text-muted underline transition-colors hover:text-primary"
            >
              처음으로 돌아가기
            </button>
          </div>
        </div>
      </section>
    );
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
                         bg-accent py-3.5 text-sm font-bold text-white shadow-md
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
      <ShareBar />
      <LeadFormSection />
    </>
  );
}
