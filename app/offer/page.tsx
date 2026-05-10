"use client";

import { useRef, useState, type RefObject } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Building,
  Home,
  Wallet,
  Ruler,
  CalendarDays,
  Send,
  Loader2,
  CircleCheck,
  ChevronDown,
} from "lucide-react";
import type {
  AreaUnit,
  BuildingType,
  DealType,
  MoveInTimeline,
  OfferRequestDto,
  PriceRangeDto,
} from "@/lib/offer-types";

/* ═══════════════════════════════════════════════
 * 타입 및 인터페이스
 * ═══════════════════════════════════════════════ */
type SelectedDealType = DealType | "";

type BudgetFieldKey =
  | "purchasePriceMin"
  | "purchasePriceMax"
  | "jeonseDepositMin"
  | "jeonseDepositMax"
  | "monthlyDepositMin"
  | "monthlyDepositMax"
  | "monthlyRentMin"
  | "monthlyRentMax";

type BudgetErrorKey = "purchasePrice" | "jeonseDeposit" | "monthlyDeposit" | "monthlyRent";
type FocusableElement = HTMLButtonElement | HTMLInputElement | HTMLSelectElement;

interface OfferFormData {
  dealType: SelectedDealType;
  purchasePriceMin: string;
  purchasePriceMax: string;
  jeonseDepositMin: string;
  jeonseDepositMax: string;
  monthlyDepositMin: string;
  monthlyDepositMax: string;
  monthlyRentMin: string;
  monthlyRentMax: string;
  region: string;
  areaUnit: AreaUnit;
  areaMin: string;
  areaMax: string;
  buildingTypes: BuildingType[];
  moveInTimeline: MoveInTimeline | "";
  elevatorRequired: boolean | null;
  note: string;
}

interface FormErrors {
  dealType?: string;
  purchasePrice?: string;
  jeonseDeposit?: string;
  monthlyDeposit?: string;
  monthlyRent?: string;
  region?: string;
  area?: string;
  buildingTypes?: string;
  moveInTimeline?: string;
  elevatorRequired?: string;
  submit?: string;
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

const BUILDING_TYPE_OPTIONS: { value: BuildingType; label: string }[] = [
  { value: "medical_building", label: "메디컬 전문 빌딩" },
  { value: "commercial", label: "일반 상가" },
  { value: "mixed_use", label: "주상복합" },
  { value: "office", label: "오피스 빌딩" },
  { value: "new_building", label: "신축 건물" },
];

const MOVE_IN_OPTIONS: { value: MoveInTimeline; label: string }[] = [
  { value: "immediate", label: "즉시 입주" },
  { value: "within_1_month", label: "1개월 이내" },
  { value: "within_3_months", label: "3개월 이내" },
  { value: "within_6_months", label: "6개월 이내" },
  { value: "flexible", label: "시기 협의 가능" },
];

const NOTE_MAX = 300;

const BUDGET_ERROR_BY_FIELD: Record<BudgetFieldKey, BudgetErrorKey> = {
  purchasePriceMin: "purchasePrice",
  purchasePriceMax: "purchasePrice",
  jeonseDepositMin: "jeonseDeposit",
  jeonseDepositMax: "jeonseDeposit",
  monthlyDepositMin: "monthlyDeposit",
  monthlyDepositMax: "monthlyDeposit",
  monthlyRentMin: "monthlyRent",
  monthlyRentMax: "monthlyRent",
};

const ERROR_FOCUS_ORDER: (keyof FormErrors)[] = [
  "dealType",
  "purchasePrice",
  "jeonseDeposit",
  "monthlyDeposit",
  "monthlyRent",
  "region",
  "area",
  "buildingTypes",
  "moveInTimeline",
  "elevatorRequired",
];

function getRangeError(minValue: string, maxValue: string, emptyMessage: string): string | undefined {
  if (!minValue || !maxValue) return emptyMessage;

  const min = parseNumber(minValue);
  const max = parseNumber(maxValue);
  if (min <= 0 || max <= 0) return "금액은 1만원 이상 입력해 주세요";
  if (min > max) return "최소 금액이 최대 금액보다 클 수 없습니다";
  return undefined;
}

function isValidRange(minValue: string, maxValue: string): boolean {
  if (!minValue || !maxValue) return false;
  return getRangeError(minValue, maxValue, "금액 범위를 입력해 주세요") === undefined;
}

function toPriceRange(minValue: string, maxValue: string): PriceRangeDto {
  return {
    min: parseNumber(minValue),
    max: parseNumber(maxValue),
  };
}

function getAreaError(minValue: string, maxValue: string): string | undefined {
  if (!minValue || !maxValue) return "희망 전용면적 범위를 모두 입력해 주세요";

  const min = parseNumber(minValue);
  const max = parseNumber(maxValue);
  if (min <= 0 || max <= 0) return "전용면적은 1 이상 입력해 주세요";
  if (min > max) return "최소 면적이 최대 면적보다 클 수 없습니다";
  return undefined;
}

function isValidArea(minValue: string, maxValue: string): boolean {
  return getAreaError(minValue, maxValue) === undefined;
}

function joinKoreanList(items: string[]): string {
  if (items.length <= 1) return items[0] ?? "";
  if (items.length === 2) return `${items[0]}와 ${items[1]}`;
  return `${items.slice(0, -1).join(", ")}와 ${items[items.length - 1]}`;
}

function getBudgetLabel(dealType: SelectedDealType): string {
  if (dealType === "매매") return "매매가";
  if (dealType === "전세") return "전세 보증금";
  if (dealType === "월세") return "보증금과 월세";
  return "예산";
}

function getMissingLabels(form: OfferFormData): string[] {
  const labels: string[] = [];

  if (!form.dealType) {
    labels.push("거래 종류", "예산");
  } else if (
    (form.dealType === "매매" && !isValidRange(form.purchasePriceMin, form.purchasePriceMax)) ||
    (form.dealType === "전세" && !isValidRange(form.jeonseDepositMin, form.jeonseDepositMax)) ||
    (form.dealType === "월세" &&
      (!isValidRange(form.monthlyDepositMin, form.monthlyDepositMax) ||
        !isValidRange(form.monthlyRentMin, form.monthlyRentMax)))
  ) {
    labels.push(getBudgetLabel(form.dealType));
  }

  if (!form.region) labels.push("희망 지역");
  if (!isValidArea(form.areaMin, form.areaMax)) labels.push("희망 전용면적");
  if (form.buildingTypes.length === 0) labels.push("건물 유형");
  if (!form.moveInTimeline) labels.push("입주 희망 시기");
  if (form.elevatorRequired === null) labels.push("엘리베이터 조건");
  return labels;
}

function buildOfferRequestDto(form: OfferFormData): OfferRequestDto {
  if (!form.moveInTimeline || form.elevatorRequired === null) {
    throw new Error("핵심 조건을 모두 입력해 주세요.");
  }

  const base = {
    region: form.region,
    desiredArea: {
      unit: form.areaUnit,
      min: parseNumber(form.areaMin),
      max: parseNumber(form.areaMax),
    },
    buildingTypes: form.buildingTypes,
    moveInTimeline: form.moveInTimeline,
    elevatorRequired: form.elevatorRequired,
    note: form.note.trim(),
  };

  if (form.dealType === "매매") {
    return {
      ...base,
      dealType: "매매",
      purchasePrice: toPriceRange(form.purchasePriceMin, form.purchasePriceMax),
    };
  }

  if (form.dealType === "전세") {
    return {
      ...base,
      dealType: "전세",
      jeonseDeposit: toPriceRange(form.jeonseDepositMin, form.jeonseDepositMax),
    };
  }

  if (form.dealType === "월세") {
    return {
      ...base,
      dealType: "월세",
      monthlyDeposit: toPriceRange(form.monthlyDepositMin, form.monthlyDepositMax),
      monthlyRent: toPriceRange(form.monthlyRentMin, form.monthlyRentMax),
    };
  }

  throw new Error("거래 종류를 선택해 주세요.");
}

function PriceRangeInputs({
  label,
  minValue,
  maxValue,
  minPlaceholder = "최소 금액",
  maxPlaceholder = "최대 금액",
  error,
  minInputRef,
  onMinChange,
  onMaxChange,
}: {
  label: string;
  minValue: string;
  maxValue: string;
  minPlaceholder?: string;
  maxPlaceholder?: string;
  error?: string;
  minInputRef?: RefObject<HTMLInputElement | null>;
  onMinChange: (value: string) => void;
  onMaxChange: (value: string) => void;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-gray-900">{label}</label>
      <div className="flex items-center gap-2">
        <input
          ref={minInputRef}
          type="text"
          inputMode="numeric"
          placeholder={minPlaceholder}
          value={minValue}
          aria-invalid={!!error}
          onChange={(e) => onMinChange(formatNumber(e.target.value))}
          className={`w-full rounded-lg border px-4 py-3 text-sm focus:border-blue-500 focus:outline-none ${
            error ? "border-red-300 bg-red-50/40" : "border-gray-200"
          }`}
        />
        <span className="text-gray-400">~</span>
        <input
          type="text"
          inputMode="numeric"
          placeholder={maxPlaceholder}
          value={maxValue}
          aria-invalid={!!error}
          onChange={(e) => onMaxChange(formatNumber(e.target.value))}
          className={`w-full rounded-lg border px-4 py-3 text-sm focus:border-blue-500 focus:outline-none ${
            error ? "border-red-300 bg-red-50/40" : "border-gray-200"
          }`}
        />
      </div>
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}

/* ═══════════════════════════════════════════════
 * 메인 페이지 컴포넌트
 * ═══════════════════════════════════════════════ */
export default function OfferPage() {
  const router = useRouter();
  const [form, setForm] = useState<OfferFormData>({
    dealType: "",
    purchasePriceMin: "",
    purchasePriceMax: "",
    jeonseDepositMin: "",
    jeonseDepositMax: "",
    monthlyDepositMin: "",
    monthlyDepositMax: "",
    monthlyRentMin: "",
    monthlyRentMax: "",
    region: "",
    areaUnit: "pyeong",
    areaMin: "",
    areaMax: "",
    buildingTypes: [],
    moveInTimeline: "",
    elevatorRequired: null,
    note: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const dealTypeRef = useRef<HTMLButtonElement>(null);
  const purchasePriceRef = useRef<HTMLInputElement>(null);
  const jeonseDepositRef = useRef<HTMLInputElement>(null);
  const monthlyDepositRef = useRef<HTMLInputElement>(null);
  const monthlyRentRef = useRef<HTMLInputElement>(null);
  const regionRef = useRef<HTMLSelectElement>(null);
  const areaRef = useRef<HTMLInputElement>(null);
  const buildingTypeRef = useRef<HTMLButtonElement>(null);
  const moveInTimelineRef = useRef<HTMLSelectElement>(null);
  const elevatorRef = useRef<HTMLButtonElement>(null);

  const focusTargets: Partial<Record<keyof FormErrors, RefObject<FocusableElement | null>>> = {
    dealType: dealTypeRef,
    purchasePrice: purchasePriceRef,
    jeonseDeposit: jeonseDepositRef,
    monthlyDeposit: monthlyDepositRef,
    monthlyRent: monthlyRentRef,
    region: regionRef,
    area: areaRef,
    buildingTypes: buildingTypeRef,
    moveInTimeline: moveInTimelineRef,
    elevatorRequired: elevatorRef,
  };

  function updateField<K extends keyof OfferFormData>(key: K, value: OfferFormData[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (key === "dealType") {
      setErrors((p) => ({
        ...p,
        dealType: undefined,
        purchasePrice: undefined,
        jeonseDeposit: undefined,
        monthlyDeposit: undefined,
        monthlyRent: undefined,
        submit: undefined,
      }));
    }
    if (key in BUDGET_ERROR_BY_FIELD) {
      const errorKey = BUDGET_ERROR_BY_FIELD[key as BudgetFieldKey];
      setErrors((p) => ({ ...p, [errorKey]: undefined, submit: undefined }));
    }
    if (key === "region") setErrors((p) => ({ ...p, region: undefined, submit: undefined }));
    if (key === "areaUnit" || key === "areaMin" || key === "areaMax") {
      setErrors((p) => ({ ...p, area: undefined, submit: undefined }));
    }
    if (key === "buildingTypes") setErrors((p) => ({ ...p, buildingTypes: undefined, submit: undefined }));
    if (key === "moveInTimeline") setErrors((p) => ({ ...p, moveInTimeline: undefined, submit: undefined }));
    if (key === "elevatorRequired") setErrors((p) => ({ ...p, elevatorRequired: undefined, submit: undefined }));
    if (key === "note") setErrors((p) => ({ ...p, submit: undefined }));
  }

  function toggleBuildingType(type: BuildingType) {
    setForm((prev) => ({
      ...prev,
      buildingTypes: prev.buildingTypes.includes(type)
        ? prev.buildingTypes.filter((item) => item !== type)
        : [...prev.buildingTypes, type],
    }));
    setErrors((p) => ({ ...p, buildingTypes: undefined, submit: undefined }));
  }

  function validate(): FormErrors {
    const e: FormErrors = {};
    if (!form.dealType) e.dealType = "거래 종류를 선택해 주세요";

    if (form.dealType === "매매") {
      const error = getRangeError(form.purchasePriceMin, form.purchasePriceMax, "매매가 범위를 모두 입력해 주세요");
      if (error) e.purchasePrice = error;
    }
    if (form.dealType === "전세") {
      const error = getRangeError(form.jeonseDepositMin, form.jeonseDepositMax, "전세 보증금 범위를 모두 입력해 주세요");
      if (error) e.jeonseDeposit = error;
    }
    if (form.dealType === "월세") {
      const depositError = getRangeError(form.monthlyDepositMin, form.monthlyDepositMax, "보증금 범위를 모두 입력해 주세요");
      const rentError = getRangeError(form.monthlyRentMin, form.monthlyRentMax, "월세 범위를 모두 입력해 주세요");
      if (depositError) e.monthlyDeposit = depositError;
      if (rentError) e.monthlyRent = rentError;
    }

    if (!form.region) e.region = "희망 지역을 선택해 주세요";
    const areaError = getAreaError(form.areaMin, form.areaMax);
    if (areaError) e.area = areaError;
    if (form.buildingTypes.length === 0) e.buildingTypes = "건물 유형을 1개 이상 선택해 주세요";
    if (!form.moveInTimeline) e.moveInTimeline = "입주 희망 시기를 선택해 주세요";
    if (form.elevatorRequired === null) e.elevatorRequired = "엘리베이터 조건을 선택해 주세요";
    return e;
  }

  function focusFirstError(errs: FormErrors) {
    const firstError = ERROR_FOCUS_ORDER.find((key) => !!errs[key]);
    if (!firstError) return;

    const target = focusTargets[firstError]?.current;
    target?.scrollIntoView({ behavior: "smooth", block: "center" });
    target?.focus({ preventScroll: true });
  }

  function handleInvalidSubmit(errs: FormErrors) {
    setSubmitAttempted(true);
    setErrors(errs);
    focusFirstError(errs);
  }

  function handleSubmitButtonClick(e: React.MouseEvent<HTMLButtonElement>) {
    if (submitting || isValid) return;
    e.preventDefault();
    handleInvalidSubmit(validate());
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      handleInvalidSubmit(errs);
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch("/api/offers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(buildOfferRequestDto(form)),
      });
      const result = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(result?.message ?? "조건 접수에 실패했습니다.");
      }

      setSubmitted(true);
    } catch (error) {
      const message = error instanceof Error ? error.message : "조건 접수에 실패했습니다.";
      setErrors((prev) => ({ ...prev, submit: message }));
    } finally {
      setSubmitting(false);
    }
  }

  const hasValidBudget =
    (form.dealType === "매매" && isValidRange(form.purchasePriceMin, form.purchasePriceMax)) ||
    (form.dealType === "전세" && isValidRange(form.jeonseDepositMin, form.jeonseDepositMax)) ||
    (form.dealType === "월세" &&
      isValidRange(form.monthlyDepositMin, form.monthlyDepositMax) &&
      isValidRange(form.monthlyRentMin, form.monthlyRentMax));
  const hasCoreNeeds =
    isValidArea(form.areaMin, form.areaMax) &&
    form.buildingTypes.length > 0 &&
    !!form.moveInTimeline &&
    form.elevatorRequired !== null;
  const isValid = !!form.dealType && hasValidBudget && !!form.region && hasCoreNeeds;
  const completionChecks = [
    !!form.dealType,
    hasValidBudget,
    !!form.region,
    isValidArea(form.areaMin, form.areaMax),
    form.buildingTypes.length > 0,
    !!form.moveInTimeline,
    form.elevatorRequired !== null,
  ];
  const completedCount = completionChecks.filter(Boolean).length;
  const completionPercent = Math.round((completedCount / completionChecks.length) * 100);
  const missingLabels = getMissingLabels(form);
  const blockingMessage = isValid
    ? "모든 필수 조건이 입력되었습니다."
    : `${joinKoreanList(missingLabels)} 항목을 입력해 주세요`;
  const submitButtonStyle = submitting
    ? undefined
    : {
        background: isValid
          ? "#2563eb"
          : `linear-gradient(90deg, #60a5fa 0%, #60a5fa ${completionPercent}%, #d1d5db ${completionPercent}%, #d1d5db 100%)`,
      };

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
        <button
          type="button"
          onClick={() => router.push("/")}
          className="mb-6 inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900"
        >
          <ArrowLeft className="h-4 w-4" /> 홈으로 돌아가기
        </button>

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
                  ref={dt.value === "매매" ? dealTypeRef : undefined}
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
          <div className="space-y-4">
            {!form.dealType && (
              <div className="rounded-lg border border-dashed border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-500">
                거래 종류를 선택하면 예산 입력 항목이 표시됩니다.
              </div>
            )}

            {form.dealType === "매매" && (
              <PriceRangeInputs
                label="매매가 범위 (만원) *"
                minValue={form.purchasePriceMin}
                maxValue={form.purchasePriceMax}
                error={errors.purchasePrice}
                minInputRef={purchasePriceRef}
                onMinChange={(value) => updateField("purchasePriceMin", value)}
                onMaxChange={(value) => updateField("purchasePriceMax", value)}
              />
            )}

            {form.dealType === "전세" && (
              <PriceRangeInputs
                label="전세 보증금 범위 (만원) *"
                minValue={form.jeonseDepositMin}
                maxValue={form.jeonseDepositMax}
                error={errors.jeonseDeposit}
                minInputRef={jeonseDepositRef}
                onMinChange={(value) => updateField("jeonseDepositMin", value)}
                onMaxChange={(value) => updateField("jeonseDepositMax", value)}
              />
            )}

            {form.dealType === "월세" && (
              <>
                <PriceRangeInputs
                  label="보증금 범위 (만원) *"
                  minValue={form.monthlyDepositMin}
                  maxValue={form.monthlyDepositMax}
                  error={errors.monthlyDeposit}
                  minInputRef={monthlyDepositRef}
                  onMinChange={(value) => updateField("monthlyDepositMin", value)}
                  onMaxChange={(value) => updateField("monthlyDepositMax", value)}
                />
                <PriceRangeInputs
                  label="월세 범위 (만원) *"
                  minValue={form.monthlyRentMin}
                  maxValue={form.monthlyRentMax}
                  minPlaceholder="최소 월세"
                  maxPlaceholder="최대 월세"
                  error={errors.monthlyRent}
                  minInputRef={monthlyRentRef}
                  onMinChange={(value) => updateField("monthlyRentMin", value)}
                  onMaxChange={(value) => updateField("monthlyRentMax", value)}
                />
              </>
            )}
          </div>

          {/* 희망 지역 */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-900">희망 지역 *</label>
            <div className="relative">
              <select
                ref={regionRef}
                value={form.region}
                onChange={(e) => updateField("region", e.target.value)}
                aria-invalid={!!errors.region}
                className={`w-full appearance-none rounded-lg border px-4 py-3 pr-10 text-sm focus:border-blue-500 focus:outline-none ${
                  errors.region ? "border-red-300 bg-red-50/40" : "border-gray-200"
                }`}
              >
                <option value="">지역 선택</option>
                {REGIONS.map((r) => <option key={r} value={r}>{r}</option>)}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
            {errors.region && <p className="mt-1 text-xs text-red-500">{errors.region}</p>}
          </div>

          {/* 핵심 니즈 */}
          <div className="space-y-5">
            <div>
              <div className="mb-2 flex items-center justify-between gap-3">
                <label className="flex items-center gap-1.5 text-sm font-semibold text-gray-900">
                  <Ruler className="h-4 w-4 text-gray-500" />
                  희망 전용면적 *
                </label>
                <div className="grid grid-cols-2 rounded-lg bg-gray-100 p-1 text-xs font-bold text-gray-500">
                  {[
                    { value: "pyeong" as AreaUnit, label: "평" },
                    { value: "sqm" as AreaUnit, label: "㎡" },
                  ].map((unit) => (
                    <button
                      key={unit.value}
                      type="button"
                      onClick={() => updateField("areaUnit", unit.value)}
                      className={`rounded-md px-3 py-1.5 transition ${
                        form.areaUnit === unit.value ? "bg-white text-blue-600 shadow-sm" : "hover:text-gray-800"
                      }`}
                    >
                      {unit.label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <input
                  ref={areaRef}
                  type="text"
                  inputMode="numeric"
                  placeholder="최소 면적"
                  value={form.areaMin}
                  aria-invalid={!!errors.area}
                  onChange={(e) => updateField("areaMin", formatNumber(e.target.value))}
                  className={`w-full rounded-lg border px-4 py-3 text-sm focus:border-blue-500 focus:outline-none ${
                    errors.area ? "border-red-300 bg-red-50/40" : "border-gray-200"
                  }`}
                />
                <span className="text-gray-400">~</span>
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="최대 면적"
                  value={form.areaMax}
                  aria-invalid={!!errors.area}
                  onChange={(e) => updateField("areaMax", formatNumber(e.target.value))}
                  className={`w-full rounded-lg border px-4 py-3 text-sm focus:border-blue-500 focus:outline-none ${
                    errors.area ? "border-red-300 bg-red-50/40" : "border-gray-200"
                  }`}
                />
              </div>
              {errors.area && <p className="mt-1 text-xs text-red-500">{errors.area}</p>}
            </div>

            <fieldset>
              <legend className="mb-2 text-sm font-semibold text-gray-900">건물 유형 *</legend>
              <div className="grid grid-cols-2 gap-2">
                {BUILDING_TYPE_OPTIONS.map((option) => {
                  const selected = form.buildingTypes.includes(option.value);
                  return (
                    <button
                      key={option.value}
                      ref={option.value === "medical_building" ? buildingTypeRef : undefined}
                      type="button"
                      onClick={() => toggleBuildingType(option.value)}
                      className={`rounded-lg border px-3 py-2.5 text-left text-sm font-semibold transition ${
                        selected
                          ? "border-blue-500 bg-blue-50 text-blue-700"
                          : "border-gray-200 text-gray-700 hover:border-gray-300"
                      }`}
                    >
                      {option.label}
                    </button>
                  );
                })}
              </div>
              {errors.buildingTypes && <p className="mt-1 text-xs text-red-500">{errors.buildingTypes}</p>}
            </fieldset>

            <div>
              <label className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-gray-900">
                <CalendarDays className="h-4 w-4 text-gray-500" />
                입주 희망 시기 *
              </label>
              <div className="relative">
                <select
                  ref={moveInTimelineRef}
                  value={form.moveInTimeline}
                  onChange={(e) => updateField("moveInTimeline", e.target.value as MoveInTimeline | "")}
                  aria-invalid={!!errors.moveInTimeline}
                  className={`w-full appearance-none rounded-lg border px-4 py-3 pr-10 text-sm focus:border-blue-500 focus:outline-none ${
                    errors.moveInTimeline ? "border-red-300 bg-red-50/40" : "border-gray-200"
                  }`}
                >
                  <option value="">시기 선택</option>
                  {MOVE_IN_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              </div>
              {errors.moveInTimeline && <p className="mt-1 text-xs text-red-500">{errors.moveInTimeline}</p>}
            </div>

            <fieldset>
              <legend className="mb-2 text-sm font-semibold text-gray-900">엘리베이터 유무 *</legend>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { value: true, label: "엘리베이터 필수" },
                  { value: false, label: "상관없음" },
                ].map((option) => (
                  <button
                    key={String(option.value)}
                    ref={option.value ? elevatorRef : undefined}
                    type="button"
                    onClick={() => updateField("elevatorRequired", option.value)}
                    className={`rounded-lg border px-3 py-2.5 text-sm font-semibold transition ${
                      form.elevatorRequired === option.value
                        ? "border-blue-500 bg-blue-50 text-blue-700"
                        : "border-gray-200 text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
              {errors.elevatorRequired && <p className="mt-1 text-xs text-red-500">{errors.elevatorRequired}</p>}
            </fieldset>
          </div>

          {/* 기타 추가 요청사항 */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-900">기타 추가 요청사항</label>
            <textarea
              rows={2}
              maxLength={NOTE_MAX}
              value={form.note}
              onChange={(e) => updateField("note", e.target.value)}
              placeholder="위 항목에 없는 조건만 간단히 적어주세요"
              className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm focus:border-blue-500 focus:outline-none"
            />
          </div>

          {/* 제출 버튼 */}
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-3 text-xs">
              <p
                id="offer-submit-feedback"
                className={`font-semibold ${
                  isValid ? "text-blue-600" : submitAttempted ? "text-red-500" : "text-gray-500"
                }`}
              >
                {blockingMessage}
              </p>
              <span className="shrink-0 font-bold text-gray-400">{completedCount}/{completionChecks.length}</span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-gray-100">
              <div
                className={`h-full rounded-full transition-all duration-300 ${isValid ? "bg-blue-600" : "bg-blue-400"}`}
                style={{ width: `${completionPercent}%` }}
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={submitting}
            data-disabled={!isValid || submitting}
            aria-describedby="offer-submit-feedback"
            onClick={handleSubmitButtonClick}
            style={submitButtonStyle}
            className={`flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-bold text-white transition-all duration-300 ${
              isValid
                ? "shadow-sm hover:brightness-95"
                : "cursor-not-allowed hover:brightness-100"
            } disabled:cursor-wait disabled:opacity-70`}
          >
            {submitting ? <><Loader2 className="h-4 w-4 animate-spin" /> 제출 중...</> : <><Send className="h-4 w-4" /> 제출하기</>}
          </button>
          {errors.submit && <p className="text-center text-xs text-red-500">{errors.submit}</p>}
        </form>
      </div>
    </div>
  );
}
