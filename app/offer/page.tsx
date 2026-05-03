"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Building,
  Home,
  Wallet,
  Send,
  Loader2,
  CircleCheck,
  ChevronDown,
} from "lucide-react";

/* ═══════════════════════════════════════════════
 * 타입 및 인터페이스
 * ═══════════════════════════════════════════════ */
type DealType = "매매" | "전세" | "월세" | "";

interface OfferFormData {
  dealType: DealType;
  budgetMin: string;
  budgetMax: string;
  region: string;
  note: string;
}

interface FormErrors {
  dealType?: string;
  budget?: string;
  region?: string;
}

interface PriceRange {
  min: number;
  max: number;
}

/* ═══════════════════════════════════════════════
 * 유틸 함수 (입력값 포맷팅 및 계산)
 * ═══════════════════════════════════════════════ */
function formatNumber(raw: string): string {
  const nums = raw.replace(/[^\d]/g, "");
  if (!nums) return "";
  return Number(nums).toLocaleString("ko-KR");
}

function parseNumber(formatted: string): number {
  return Number(formatted.replace(/[^\d]/g, "")) || 0;
}

/** 
 * 적정 거래가 도출 알고리즘 
 * (추후 매도자 데이터와 매칭할 때 백엔드/서버에서 사용할 로직이지만 프론트에 포함해둠)
 */
export function calculateFairPrice(seller: PriceRange, buyer: PriceRange): number | null {
  const overlapMin = Math.max(seller.min, buyer.min);
  const overlapMax = Math.min(seller.max, buyer.max);
  if (overlapMin > overlapMax) return null;
  return (overlapMin + overlapMax) / 2;
}

/* ═══════════════════════════════════════════════
 * 상수 데이터
 * ═══════════════════════════════════════════════ */
const DEAL_TYPES = [
  { value: "매매" as DealType, icon: Building, label: "매매", desc: "소유권 이전" },
  { value: "전세" as DealType, icon: Home, label: "전세", desc: "보증금 기반" },
  { value: "월세" as DealType, icon: Wallet, label: "월세", desc: "보증금 + 월납" },
];

const REGIONS = [
  "전주시 덕진구 에코시티",
  "전주시 덕진구 금암동",
  "전주시 완산구 서신동",
  "서울시 강남구",
  "기타 (추가 요청사항에 기재)",
];

const NOTE_MAX = 500;

/* ═══════════════════════════════════════════════
 * 메인 페이지 컴포넌트
 * ═══════════════════════════════════════════════ */
export default function OfferPage() {
  const [form, setForm] = useState<OfferFormData>({
    dealType: "",
    budgetMin: "",
    budgetMax: "",
    region: "",
    note: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  function updateField<K extends keyof OfferFormData>(key: K, value: OfferFormData[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (key === "dealType") setErrors((p) => ({ ...p, dealType: undefined }));
    if (key === "budgetMin" || key === "budgetMax") setErrors((p) => ({ ...p, budget: undefined }));
    if (key === "region") setErrors((p) => ({ ...p, region: undefined }));
  }

  function validate(): FormErrors {
    const e: FormErrors = {};
    if (!form.dealType) e.dealType = "거래 종류를 선택해 주세요";

    // ✅ 최소/최대 예산 모두 필수 입력 처리
    if (!form.budgetMin || !form.budgetMax) {
      e.budget = "최소 및 최대 예산 범위를 모두 입력해 주세요";
    } else {
      const min = parseNumber(form.budgetMin);
      const max = parseNumber(form.budgetMax);
      if (min > max) {
        e.budget = "최소 금액이 최대 금액보다 클 수 없습니다";
      }
    }

    if (!form.region) e.region = "희망 지역을 선택해 주세요";
    return e;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setSubmitting(true);
    // API 연동 모사 (1.5초 대기)
    await new Promise((r) => setTimeout(r, 1500));
    setSubmitting(false);
    setSubmitted(true);
  }

  const isValid = !!form.dealType && !!form.budgetMin && !!form.budgetMax && !!form.region;

  /* 제출 완료 화면 */
  if (submitted) {
    return (
      <div className="flex min-h-[80vh] items-center justify-center bg-gray-50 px-6">
        <div className="w-full max-w-md text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-50">
            <CircleCheck className="h-10 w-10 text-green-500" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">OfferSheet 접수 완료!</h1>
          <p className="mt-3 text-sm text-gray-500">최적의 매물을 선별하여 연락드리겠습니다.</p>
          <Link href="/" className="mt-8 inline-flex items-center gap-2 text-sm text-blue-600 hover:underline">
            <ArrowLeft className="h-4 w-4" /> 홈으로 돌아가기
          </Link>
        </div>
      </div>
    );
  }

  /* 메인 입력 폼 화면 */
  return (
    <div className="min-h-screen bg-gray-50 py-10 px-6">
      <div className="mx-auto max-w-lg">
        <Link href="/" className="mb-6 inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900">
          <ArrowLeft className="h-4 w-4" /> 뒤로 가기
        </Link>

        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">어떤 매물을 찾고 계세요?</h1>
          <p className="mt-2 text-sm text-gray-500">조건을 알려주시면 찰떡같은 매물을 찾아드릴게요.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8 rounded-2xl bg-white p-6 shadow-sm border border-gray-100">
          {/* 거래 종류 */}
          <fieldset>
            <legend className="mb-2 text-sm font-semibold text-gray-900">희망 거래 종류 *</legend>
            <div className="grid grid-cols-3 gap-3">
              {DEAL_TYPES.map((dt) => (
                <button
                  key={dt.value}
                  type="button"
                  onClick={() => updateField("dealType", dt.value)}
                  className={`flex flex-col items-center gap-1 rounded-xl border-2 p-3 text-center transition-all ${
                    form.dealType === dt.value ? "border-blue-500 bg-blue-50" : "border-gray-100 hover:border-gray-200"
                  }`}
                >
                  <dt.icon className={`h-6 w-6 ${form.dealType === dt.value ? "text-blue-500" : "text-gray-400"}`} />
                  <span className={`text-sm font-bold ${form.dealType === dt.value ? "text-blue-600" : "text-gray-700"}`}>
                    {dt.label}
                  </span>
                </button>
              ))}
            </div>
            {errors.dealType && <p className="mt-1 text-xs text-red-500">{errors.dealType}</p>}
          </fieldset>

          {/* 예산 범위 */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-900">예산 범위 (만원) *</label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="최소 금액"
                value={form.budgetMin}
                onChange={(e) => updateField("budgetMin", formatNumber(e.target.value))}
                className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm focus:border-blue-500 focus:outline-none"
              />
              <span className="text-gray-400">~</span>
              <input
                type="text"
                placeholder="최대 금액"
                value={form.budgetMax}
                onChange={(e) => updateField("budgetMax", formatNumber(e.target.value))}
                className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm focus:border-blue-500 focus:outline-none"
              />
            </div>
            {errors.budget && <p className="mt-1 text-xs text-red-500">{errors.budget}</p>}
          </div>

          {/* 희망 지역 */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-900">희망 지역 *</label>
            <div className="relative">
              <select
                value={form.region}
                onChange={(e) => updateField("region", e.target.value)}
                className="w-full appearance-none rounded-lg border border-gray-200 px-4 py-3 pr-10 text-sm focus:border-blue-500 focus:outline-none"
              >
                <option value="">지역 선택</option>
                {REGIONS.map((r) => <option key={r} value={r}>{r}</option>)}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
            {errors.region && <p className="mt-1 text-xs text-red-500">{errors.region}</p>}
          </div>

          {/* 추가 요청사항 */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-900">추가 요청사항</label>
            <textarea
              rows={3}
              maxLength={NOTE_MAX}
              value={form.note}
              onChange={(e) => updateField("note", e.target.value)}
              placeholder="자유롭게 적어주세요"
              className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm focus:border-blue-500 focus:outline-none"
            />
          </div>

          {/* 제출 버튼 */}
          <button
            type="submit"
            disabled={!isValid || submitting}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3.5 text-sm font-bold text-white transition-all hover:bg-blue-700 disabled:bg-gray-300"
          >
            {submitting ? <><Loader2 className="h-4 w-4 animate-spin" /> 제출 중...</> : <><Send className="h-4 w-4" /> 제출하기</>}
          </button>
        </form>
      </div>
    </div>
  );
}