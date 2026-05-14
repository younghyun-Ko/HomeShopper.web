"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  BarChart3,
  Building,
  CalendarDays,
  Check,
  ChevronDown,
  Home,
  MapPin,
  Maximize2,
  MessageCircle,
  RefreshCw,
  RotateCcw,
  Ruler,
  Search,
  SlidersHorizontal,
  Wallet,
  X,
} from "lucide-react";
import type { AreaUnit, BuildingType, DealType, MoveInTimeline } from "@/lib/offer-types";

type SelectedDealType = DealType | "";

interface FilterState {
  dealType: SelectedDealType;
  budgetMin: string;
  budgetMax: string;
  region: string;
  areaUnit: AreaUnit;
  areaMin: string;
  areaMax: string;
  buildingTypes: BuildingType[];
  moveInTimeline: MoveInTimeline | "";
  elevatorRequired: boolean | null;
}

interface PropertyListing {
  id: string;
  image: string;
  title: string;
  location: string;
  region: string;
  specialty: string;
  status: "상담가능" | "매칭중";
  dealType: DealType;
  buildingType: BuildingType;
  moveInTimeline: MoveInTimeline;
  elevatorRequired: boolean;
  currentPrice: number;
  officialPrice: number;
  marketPrice: number;
  areaPyeong: number;
  deposit: number;
  detail: string;
  features: string[];
}

const DEAL_TYPES = [
  { value: "매매" as DealType, icon: Building, label: "매매" },
  { value: "전세" as DealType, icon: Home, label: "전세" },
  { value: "월세" as DealType, icon: Wallet, label: "월세" },
];

const REGIONS = [
  "서울시 강남구",
  "전주시 덕진구 에코시티",
  "전주시 완산구 서신동",
  "전주시 완산구 효자동",
  "경기도 성남시 분당구",
  "서울시 마포구",
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

const INITIAL_FILTERS: FilterState = {
  dealType: "",
  budgetMin: "",
  budgetMax: "",
  region: "",
  areaUnit: "pyeong",
  areaMin: "",
  areaMax: "",
  buildingTypes: [],
  moveInTimeline: "",
  elevatorRequired: null,
};

const LISTINGS: PropertyListing[] = [
  {
    id: "hs-101",
    image: "/prop-1.png",
    title: "강남역 인근 메디컬 타워 3층",
    location: "서울시 강남구 역삼동",
    region: "서울시 강남구",
    specialty: "피부과 / 성형외과 추천",
    status: "상담가능",
    dealType: "매매",
    buildingType: "medical_building",
    moveInTimeline: "within_3_months",
    elevatorRequired: true,
    currentPrice: 38,
    officialPrice: 28.4,
    marketPrice: 35.2,
    areaPyeong: 52,
    deposit: 1,
    detail:
      "강남역 도보권에 위치한 메디컬 전문 건물입니다. 유동 인구가 풍부하고, 피부과와 성형외과 1차 진료 및 확장 이전에 적합한 구조입니다.",
    features: ["역세권", "전용 52평", "엘리베이터 3대", "주차 60대"],
  },
  {
    id: "hs-102",
    image: "/hero-bg.png",
    title: "전주 에코시티 신축 메디컬 빌딩",
    location: "전북 전주시 덕진구 에코시티",
    region: "전주시 덕진구 에코시티",
    specialty: "내과 / 이비인후과 추천",
    status: "상담가능",
    dealType: "매매",
    buildingType: "new_building",
    moveInTimeline: "immediate",
    elevatorRequired: true,
    currentPrice: 11.2,
    officialPrice: 8.1,
    marketPrice: 10.5,
    areaPyeong: 45,
    deposit: 0.5,
    detail:
      "2024년 준공된 에코시티 중심 신축 메디컬 전용 건물입니다. 에코시티 핵심 상권에 위치해 유동 인구가 풍부하고, 주차장 50대 규모를 갖추고 있습니다.",
    features: ["주차 50대", "엘리베이터 2대", "장애인 편의시설 완비", "배후 세대 4,500세대"],
  },
  {
    id: "hs-103",
    image: "/prop-2.png",
    title: "서신동 대로변 1층 코너 상가",
    location: "전북 전주시 완산구 서신동",
    region: "전주시 완산구 서신동",
    specialty: "약국 / 치과 추천",
    status: "상담가능",
    dealType: "전세",
    buildingType: "commercial",
    moveInTimeline: "within_1_month",
    elevatorRequired: false,
    currentPrice: 9.5,
    officialPrice: 6.5,
    marketPrice: 8.8,
    areaPyeong: 32,
    deposit: 0.7,
    detail:
      "대로변 1층 코너 입지로 시인성이 뛰어난 상가입니다. 약국, 치과, 소형 의원처럼 접근성이 중요한 업종에 적합합니다.",
    features: ["1층 코너", "대로변", "간판 노출 우수", "전용 32평"],
  },
  {
    id: "hs-104",
    image: "/prop-3.png",
    title: "효자동 단지 내 상가 소아과 적합",
    location: "전북 전주시 완산구 효자동",
    region: "전주시 완산구 효자동",
    specialty: "소아과 추천",
    status: "매칭중",
    dealType: "월세",
    buildingType: "mixed_use",
    moveInTimeline: "within_1_month",
    elevatorRequired: true,
    currentPrice: 6,
    officialPrice: 4.2,
    marketPrice: 5.5,
    areaPyeong: 28,
    deposit: 0.3,
    detail:
      "대단지 배후 수요를 갖춘 주상복합 상가입니다. 학원, 소아과, 키즈 진료 업종과 궁합이 좋습니다.",
    features: ["단지 내 상권", "전용 28평", "유아 동선 적합", "주차 편리"],
  },
  {
    id: "hs-105",
    image: "/prop-1.png",
    title: "분당 정자동 메디컬 오피스 4층",
    location: "경기도 성남시 분당구 정자동",
    region: "경기도 성남시 분당구",
    specialty: "정신건강의학과 / 재활의학과 추천",
    status: "상담가능",
    dealType: "매매",
    buildingType: "office",
    moveInTimeline: "within_6_months",
    elevatorRequired: true,
    currentPrice: 55,
    officialPrice: 42,
    marketPrice: 52.3,
    areaPyeong: 60,
    deposit: 2,
    detail:
      "정자동 업무지구의 조용한 오피스형 매물입니다. 예약제 진료, 재활, 상담 중심 진료과에 안정적인 환경을 제공합니다.",
    features: ["전용 60평", "업무지구", "엘리베이터 4대", "보안 우수"],
  },
  {
    id: "hs-106",
    image: "/hero-bg.png",
    title: "홍대 합정 스트리트 메디컬 2층",
    location: "서울시 마포구 합정동",
    region: "서울시 마포구",
    specialty: "피부과 / 탈모클리닉 추천",
    status: "상담가능",
    dealType: "전세",
    buildingType: "commercial",
    moveInTimeline: "within_3_months",
    elevatorRequired: true,
    currentPrice: 42,
    officialPrice: 31,
    marketPrice: 39.5,
    areaPyeong: 38,
    deposit: 1.5,
    detail:
      "합정역과 홍대 상권 사이의 스트리트형 2층 매물입니다. 젊은 고객층을 대상으로 한 클리닉 브랜딩에 유리합니다.",
    features: ["전용 38평", "젊은 유동 인구", "가시성 우수", "역 접근성"],
  },
  {
    id: "hs-107",
    image: "/prop-2.png",
    title: "금암동 병원가 인접 일반 상가",
    location: "전북 전주시 덕진구 금암동",
    region: "전주시 덕진구 에코시티",
    specialty: "검진센터 / 한의원 추천",
    status: "상담가능",
    dealType: "월세",
    buildingType: "commercial",
    moveInTimeline: "flexible",
    elevatorRequired: false,
    currentPrice: 7.8,
    officialPrice: 5.4,
    marketPrice: 7.1,
    areaPyeong: 34,
    deposit: 0.4,
    detail:
      "기존 병원가와 가까운 상권의 일반 상가입니다. 초기 비용을 조절하며 개원하려는 업종에 적합합니다.",
    features: ["기존 병원가", "월세 협의", "전용 34평", "초기 비용 절감"],
  },
  {
    id: "hs-108",
    image: "/prop-3.png",
    title: "서신동 신축 복합상가 5층",
    location: "전북 전주시 완산구 서신동",
    region: "전주시 완산구 서신동",
    specialty: "재활의학과 / 통증의학과 추천",
    status: "상담가능",
    dealType: "매매",
    buildingType: "new_building",
    moveInTimeline: "within_6_months",
    elevatorRequired: true,
    currentPrice: 18.6,
    officialPrice: 13.2,
    marketPrice: 16.9,
    areaPyeong: 47,
    deposit: 0.9,
    detail:
      "서신동 핵심 생활권에 새로 공급되는 복합상가입니다. 넓은 대기 공간과 장비 배치가 필요한 진료과에 어울립니다.",
    features: ["신축 예정", "전용 47평", "장비 반입 용이", "엘리베이터 2대"],
  },
];

function formatNumber(raw: string): string {
  const nums = raw.replace(/[^\d.]/g, "");
  if (!nums) return "";
  const parts = nums.split(".");
  const integer = parts[0] ? Number(parts[0]).toLocaleString("ko-KR") : "";
  return parts.length > 1 ? `${integer}.${parts.slice(1).join("").slice(0, 1)}` : integer;
}

function parseNumber(value: string): number | null {
  const parsed = Number(value.replace(/,/g, ""));
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
}

function formatEok(value: number): string {
  return Number.isInteger(value) ? `${value}억` : `${value.toFixed(1)}억`;
}

function areaToPyeong(value: number, unit: AreaUnit) {
  return unit === "sqm" ? value / 3.3058 : value;
}

function getMoveInLabel(value: MoveInTimeline) {
  return MOVE_IN_OPTIONS.find((option) => option.value === value)?.label ?? value;
}

function matchesFilters(listing: PropertyListing, filters: FilterState) {
  if (filters.dealType && listing.dealType !== filters.dealType) return false;
  if (filters.region && listing.region !== filters.region) return false;
  if (filters.moveInTimeline && listing.moveInTimeline !== filters.moveInTimeline) return false;
  if (filters.elevatorRequired !== null && listing.elevatorRequired !== filters.elevatorRequired) return false;
  if (filters.buildingTypes.length > 0 && !filters.buildingTypes.includes(listing.buildingType)) return false;

  const areaMin = parseNumber(filters.areaMin);
  const areaMax = parseNumber(filters.areaMax);
  if (areaMin !== null && listing.areaPyeong < areaToPyeong(areaMin, filters.areaUnit)) return false;
  if (areaMax !== null && listing.areaPyeong > areaToPyeong(areaMax, filters.areaUnit)) return false;

  const budgetMin = parseNumber(filters.budgetMin);
  const budgetMax = parseNumber(filters.budgetMax);
  if (filters.dealType && budgetMin !== null && listing.currentPrice < budgetMin) return false;
  if (filters.dealType && budgetMax !== null && listing.currentPrice > budgetMax) return false;

  return true;
}

function PriceBar({ label, value, max, tone }: { label: string; value: number; max: number; tone: string }) {
  const width = Math.max(8, Math.round((value / max) * 100));

  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between text-xs">
        <span className="font-medium text-slate-400">{label}</span>
        <span className="font-black text-slate-700">{formatEok(value)}</span>
      </div>
      <div className="h-2.5 overflow-hidden rounded-full bg-slate-200">
        <div className={`h-full rounded-full ${tone}`} style={{ width: `${width}%` }} />
      </div>
    </div>
  );
}

function FilterInput({
  value,
  placeholder,
  onChange,
}: {
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
}) {
  return (
    <input
      type="text"
      inputMode="decimal"
      value={value}
      placeholder={placeholder}
      onChange={(event) => onChange(formatNumber(event.target.value))}
      className="h-12 w-full rounded-lg border border-slate-200 bg-white px-4 text-sm font-medium text-slate-800 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
    />
  );
}

export default function OfferPage() {
  const router = useRouter();
  const [filters, setFilters] = useState<FilterState>(INITIAL_FILTERS);
  const [selectedListing, setSelectedListing] = useState<PropertyListing | null>(null);
  const [offerRange, setOfferRange] = useState({ min: "", max: "" });

  const filteredListings = useMemo(
    () => LISTINGS.filter((listing) => matchesFilters(listing, filters)),
    [filters],
  );

  const activeFilterCount = [
    filters.dealType,
    filters.budgetMin || filters.budgetMax,
    filters.region,
    filters.areaMin || filters.areaMax,
    filters.buildingTypes.length > 0,
    filters.moveInTimeline,
    filters.elevatorRequired !== null,
  ].filter(Boolean).length;

  function updateFilter<K extends keyof FilterState>(key: K, value: FilterState[K]) {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }

  function toggleBuildingType(type: BuildingType) {
    setFilters((prev) => ({
      ...prev,
      buildingTypes: prev.buildingTypes.includes(type)
        ? prev.buildingTypes.filter((item) => item !== type)
        : [...prev.buildingTypes, type],
    }));
  }

  function openListing(listing: PropertyListing) {
    setSelectedListing(listing);
    setOfferRange({ min: "", max: "" });
  }

  const modalMaxPrice = selectedListing
    ? Math.max(selectedListing.currentPrice, selectedListing.marketPrice, selectedListing.officialPrice)
    : 1;
  const canSubmitOffer = !!offerRange.min && !!offerRange.max;

  return (
    <div className="min-h-screen bg-slate-50">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-[1180px] px-5 py-9 sm:px-6">
          <button
            type="button"
            onClick={() => router.push("/")}
            className="mb-5 inline-flex items-center gap-1 text-sm font-medium text-slate-400 transition hover:text-slate-700"
          >
            <ArrowLeft className="h-4 w-4" /> 홈으로 돌아가기
          </button>

          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
                현재 <span className="text-brand-gradient">HomeShopper</span>에 등록된 전체 매물
              </h1>
              <p className="mt-3 flex flex-wrap items-center gap-2 text-sm font-medium text-slate-400">
                <RefreshCw className="h-4 w-4 text-blue-500" />
                총 <span className="font-black text-slate-700">{LISTINGS.length}개</span> 매물이 등록되어 있습니다.
                카드를 클릭해 가격 분석 및 제안을 확인하세요.
              </p>
            </div>
            <div
              className="inline-flex w-fit items-center gap-2 rounded-full bg-blue-50 px-5 py-3 text-sm font-black text-blue-600"
              style={{ width: "fit-content" }}
            >
              <span className="h-2 w-2 rounded-full bg-blue-500" />
              실시간 업데이트 중
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto grid max-w-[1180px] grid-cols-1 gap-6 px-5 py-8 sm:px-6 lg:grid-cols-12">
        <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:sticky lg:top-24 lg:col-span-4 xl:col-span-3">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="h-5 w-5 text-blue-600" />
              <h2 className="text-lg font-black text-slate-900">매물 필터</h2>
            </div>
            <button
              type="button"
              onClick={() => setFilters(INITIAL_FILTERS)}
              className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-bold text-slate-400 transition hover:bg-slate-50 hover:text-slate-700"
            >
              <RotateCcw className="h-3.5 w-3.5" /> 초기화
            </button>
          </div>

          <div className="space-y-6">
            <fieldset>
              <legend className="mb-3 text-sm font-black text-slate-900">희망 거래 종류 *</legend>
              <div className="grid grid-cols-3 gap-2">
                {DEAL_TYPES.map((deal) => {
                  const Icon = deal.icon;
                  const selected = filters.dealType === deal.value;

                  return (
                    <button
                      key={deal.value}
                      type="button"
                      onClick={() =>
                        setFilters((prev) => ({
                          ...prev,
                          dealType: prev.dealType === deal.value ? "" : deal.value,
                          budgetMin: "",
                          budgetMax: "",
                        }))
                      }
                      className={`flex h-[76px] flex-col items-center justify-center gap-1.5 rounded-xl border text-sm font-black transition ${
                        selected
                          ? "border-blue-400 bg-blue-50 text-blue-600"
                          : "border-slate-200 text-slate-600 hover:border-slate-300"
                      }`}
                    >
                      <Icon className={`h-5 w-5 ${selected ? "text-blue-500" : "text-slate-400"}`} />
                      {deal.label}
                    </button>
                  );
                })}
              </div>
            </fieldset>

            {filters.dealType ? (
              <div>
                <label className="mb-3 block text-sm font-black text-slate-900">
                  {filters.dealType} 희망 금액 (억원)
                </label>
                <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
                  <FilterInput
                    value={filters.budgetMin}
                    placeholder="최소 금액"
                    onChange={(value) => updateFilter("budgetMin", value)}
                  />
                  <span className="text-slate-400">~</span>
                  <FilterInput
                    value={filters.budgetMax}
                    placeholder="최대 금액"
                    onChange={(value) => updateFilter("budgetMax", value)}
                  />
                </div>
              </div>
            ) : (
              <div className="rounded-lg border border-dashed border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-400">
                거래 종류를 선택하면 예산 입력 항목이 표시됩니다.
              </div>
            )}

            <div>
              <label className="mb-3 block text-sm font-black text-slate-900">희망 지역 *</label>
              <div className="relative">
                <select
                  value={filters.region}
                  onChange={(event) => updateFilter("region", event.target.value)}
                  className="h-12 w-full appearance-none rounded-lg border border-slate-200 bg-white px-4 pr-10 text-sm font-medium text-slate-700 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                >
                  <option value="">지역 선택</option>
                  {REGIONS.map((region) => (
                    <option key={region} value={region}>
                      {region}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              </div>
            </div>

            <div>
              <div className="mb-3 flex items-center justify-between gap-3">
                <label className="flex items-center gap-1.5 text-sm font-black text-slate-900">
                  <Ruler className="h-4 w-4 text-slate-500" />
                  희망 전용면적 *
                </label>
                <div className="grid grid-cols-2 rounded-lg bg-slate-100 p-1 text-xs font-black text-slate-500">
                  {[
                    { value: "pyeong" as AreaUnit, label: "평" },
                    { value: "sqm" as AreaUnit, label: "㎡" },
                  ].map((unit) => (
                    <button
                      key={unit.value}
                      type="button"
                      onClick={() => updateFilter("areaUnit", unit.value)}
                      className={`rounded-md px-3 py-1.5 transition ${
                        filters.areaUnit === unit.value ? "bg-white text-blue-600 shadow-sm" : "hover:text-slate-800"
                      }`}
                    >
                      {unit.label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
                <FilterInput
                  value={filters.areaMin}
                  placeholder="최소 면적"
                  onChange={(value) => updateFilter("areaMin", value)}
                />
                <span className="text-slate-400">~</span>
                <FilterInput
                  value={filters.areaMax}
                  placeholder="최대 면적"
                  onChange={(value) => updateFilter("areaMax", value)}
                />
              </div>
            </div>

            <fieldset>
              <legend className="mb-3 text-sm font-black text-slate-900">건물 유형 *</legend>
              <div className="grid grid-cols-2 gap-2">
                {BUILDING_TYPE_OPTIONS.map((option) => {
                  const selected = filters.buildingTypes.includes(option.value);

                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => toggleBuildingType(option.value)}
                      className={`min-h-11 rounded-lg border px-3 py-2.5 text-left text-sm font-bold transition ${
                        selected
                          ? "border-blue-400 bg-blue-50 text-blue-700"
                          : "border-slate-200 text-slate-700 hover:border-slate-300"
                      }`}
                    >
                      {option.label}
                    </button>
                  );
                })}
              </div>
            </fieldset>

            <div>
              <label className="mb-3 flex items-center gap-1.5 text-sm font-black text-slate-900">
                <CalendarDays className="h-4 w-4 text-slate-500" />
                입주 희망 시기 *
              </label>
              <div className="relative">
                <select
                  value={filters.moveInTimeline}
                  onChange={(event) => updateFilter("moveInTimeline", event.target.value as MoveInTimeline | "")}
                  className="h-12 w-full appearance-none rounded-lg border border-slate-200 bg-white px-4 pr-10 text-sm font-medium text-slate-700 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                >
                  <option value="">시기 선택</option>
                  {MOVE_IN_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              </div>
            </div>

            <fieldset>
              <legend className="mb-3 text-sm font-black text-slate-900">엘리베이터 유무 *</legend>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { value: true, label: "엘리베이터 필수" },
                  { value: false, label: "상관없음" },
                ].map((option) => (
                  <button
                    key={String(option.value)}
                    type="button"
                    onClick={() =>
                      updateFilter(
                        "elevatorRequired",
                        filters.elevatorRequired === option.value ? null : option.value,
                      )
                    }
                    className={`min-h-11 rounded-lg border px-3 py-2.5 text-sm font-bold transition ${
                      filters.elevatorRequired === option.value
                        ? "border-blue-400 bg-blue-50 text-blue-700"
                        : "border-slate-200 text-slate-700 hover:border-slate-300"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </fieldset>
          </div>
        </aside>

        <section className="lg:col-span-8 xl:col-span-9">
          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-bold text-blue-600">
                {activeFilterCount > 0 ? `${activeFilterCount}개 조건 적용됨` : "전체 매물 보기"}
              </p>
              <h2 className="mt-1 text-2xl font-black text-slate-900">
                조건에 맞는 매물 {filteredListings.length}개
              </h2>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-500">
              <Search className="h-4 w-4" />
              클릭하면 상세 분석을 확인합니다
            </div>
          </div>

          {filteredListings.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {filteredListings.map((listing) => (
                <button
                  key={listing.id}
                  type="button"
                  onClick={() => openListing(listing)}
                  className="group overflow-hidden rounded-2xl border border-blue-100 bg-white text-left shadow-sm transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl"
                >
                  <div className="relative overflow-hidden bg-slate-200" style={{ height: 224 }}>
                    <Image
                      src={listing.image}
                      alt={listing.title}
                      fill
                      sizes="(min-width: 1280px) 260px, (min-width: 768px) 50vw, 100vw"
                      className="object-cover transition duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/65 via-slate-950/10 to-transparent" />
                    <span
                      className={`absolute right-4 top-4 rounded-full px-3 py-1 text-xs font-black text-white ${
                        listing.status === "상담가능" ? "bg-blue-600" : "bg-slate-500"
                      }`}
                    >
                      {listing.status}
                    </span>
                    <div className="absolute bottom-4 left-4 text-white">
                      <p className="text-xs font-medium text-white/75">현재 호가</p>
                      <p className="text-2xl font-black">{formatEok(listing.currentPrice)}</p>
                    </div>
                  </div>

                  <div className="p-5">
                    <p className="text-sm font-medium text-slate-400">{listing.location}</p>
                    <h3 className="mt-1 line-clamp-2 min-h-12 text-lg font-black leading-snug text-slate-900">
                      {listing.title}
                    </h3>
                    <p className="mt-1 text-sm font-bold text-blue-600">{listing.specialty}</p>

                    <div className="mt-4 rounded-xl bg-slate-50 p-4 text-sm">
                      <div className="grid gap-2">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-slate-400">공시지가</span>
                          <span className="font-black text-slate-800">{formatEok(listing.officialPrice)}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-slate-400">유사 실거래가</span>
                          <span className="font-black text-slate-800">{formatEok(listing.marketPrice)}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-slate-400">면적 / 보증금</span>
                          <span className="font-black text-slate-800">
                            전용 {listing.areaPyeong}평 / 보증금 {formatEok(listing.deposit)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <span className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-blue-600">
                      상세 분석 & 제안하기 <ArrowRight className="h-4 w-4" />
                    </span>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
              <p className="text-lg font-black text-slate-900">조건에 맞는 매물이 없습니다.</p>
              <p className="mt-2 text-sm font-medium text-slate-400">필터를 조금 넓히면 더 많은 매물을 볼 수 있어요.</p>
              <button
                type="button"
                onClick={() => setFilters(INITIAL_FILTERS)}
                className="mt-6 rounded-xl bg-blue-600 px-5 py-3 text-sm font-black text-white transition hover:bg-blue-700"
              >
                전체 매물 다시 보기
              </button>
            </div>
          )}
        </section>
      </div>

      {selectedListing && (
        <div
          className="fixed inset-0 z-[120] flex items-end justify-center bg-slate-950/45 px-0 sm:items-center sm:px-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="listing-detail-title"
          onClick={() => setSelectedListing(null)}
        >
          <div
            className="max-h-[94vh] w-full max-w-[670px] overflow-y-auto rounded-t-3xl bg-white shadow-2xl sm:rounded-3xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="relative overflow-hidden rounded-t-3xl bg-slate-200" style={{ height: 250 }}>
              <Image
                src={selectedListing.image}
                alt={selectedListing.title}
                fill
                sizes="670px"
                priority
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-slate-950/10" />
              <span className="absolute left-5 top-5 rounded-full bg-blue-600 px-3 py-1.5 text-xs font-black text-white">
                {selectedListing.status}
              </span>
              <button
                type="button"
                onClick={() => setSelectedListing(null)}
                aria-label="상세 보기 닫기"
                className="absolute right-3 top-3 flex h-11 w-11 items-center justify-center rounded-full bg-slate-900/55 text-white transition hover:bg-slate-900/75"
              >
                <X className="h-5 w-5" />
              </button>
              <div className="absolute bottom-5 left-5 right-5 text-white">
                <p className="text-sm font-bold text-white/75">{selectedListing.location}</p>
                <h2 id="listing-detail-title" className="mt-1 text-2xl font-black leading-tight">
                  {selectedListing.title}
                </h2>
              </div>
            </div>

            <div className="space-y-7 p-6 sm:p-8">
              <div className="flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-600">
                  <Maximize2 className="h-3.5 w-3.5" /> 전용 {selectedListing.areaPyeong}평
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-600">
                  <MapPin className="h-3.5 w-3.5" /> {selectedListing.region}
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-600">
                  {selectedListing.specialty}
                </span>
              </div>

              <section className="rounded-2xl border border-blue-100 bg-slate-50 p-5">
                <h3 className="mb-5 flex items-center gap-2 text-lg font-black text-slate-900">
                  <BarChart3 className="h-5 w-5 text-blue-600" />
                  가격 참고 지표
                </h3>
                <div className="space-y-4">
                  <PriceBar
                    label="공시지가"
                    value={selectedListing.officialPrice}
                    max={modalMaxPrice}
                    tone="bg-blue-400"
                  />
                  <PriceBar
                    label="유사 실거래가"
                    value={selectedListing.marketPrice}
                    max={modalMaxPrice}
                    tone="bg-indigo-500"
                  />
                  <PriceBar
                    label="현재 호가"
                    value={selectedListing.currentPrice}
                    max={modalMaxPrice}
                    tone="bg-violet-500"
                  />
                </div>
                <p className="mt-4 text-xs font-medium text-slate-400">
                  * 공시지가/실거래가는 참고용이며 실제 가치는 다를 수 있습니다.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-black text-slate-900">매물 상세</h3>
                <p className="mt-3 text-sm font-medium leading-7 text-slate-500">{selectedListing.detail}</p>
              </section>

              <section>
                <h3 className="text-lg font-black text-slate-900">주요 특징</h3>
                <div className="mt-3 flex flex-wrap gap-2">
                  {[...selectedListing.features, getMoveInLabel(selectedListing.moveInTimeline)].map((feature) => (
                    <span
                      key={feature}
                      className="inline-flex items-center gap-1.5 rounded-full border border-blue-100 bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-700"
                    >
                      <Check className="h-3.5 w-3.5" /> {feature}
                    </span>
                  ))}
                </div>
              </section>

              <section className="rounded-2xl bg-blue-50/70 p-5">
                <h3 className="flex items-center gap-2 text-lg font-black text-slate-900">
                  <MessageCircle className="h-5 w-5 text-slate-500" />
                  매수 희망 가격 입력
                </h3>
                <p className="mt-1 text-sm font-medium text-slate-400">
                  해당 매물을 어느 정도 가격 범위에서 거래하고 싶으신가요?
                </p>

                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <label>
                    <span className="mb-2 block text-sm font-black text-slate-700">최소 금액 (억원)</span>
                    <FilterInput
                      value={offerRange.min}
                      placeholder="예: 30"
                      onChange={(value) => setOfferRange((prev) => ({ ...prev, min: value }))}
                    />
                  </label>
                  <label>
                    <span className="mb-2 block text-sm font-black text-slate-700">최대 금액 (억원)</span>
                    <FilterInput
                      value={offerRange.max}
                      placeholder="예: 40"
                      onChange={(value) => setOfferRange((prev) => ({ ...prev, max: value }))}
                    />
                  </label>
                </div>

                <button
                  type="button"
                  disabled={!canSubmitOffer}
                  className="mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-indigo-400 text-sm font-black text-white transition enabled:hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  해당 조건으로 제안하기 <ArrowRight className="h-4 w-4" />
                </button>
              </section>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
