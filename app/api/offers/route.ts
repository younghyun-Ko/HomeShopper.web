import { NextResponse, type NextRequest } from "next/server";
import type {
  AreaRangeDto,
  AreaUnit,
  BuildingType,
  DealType,
  MoveInTimeline,
  OfferRequestDto,
  PriceRangeDto,
} from "@/lib/offer-types";

const DEAL_TYPES = new Set<DealType>(["매매", "전세", "월세"]);
const AREA_UNITS = new Set<AreaUnit>(["pyeong", "sqm"]);
const BUILDING_TYPES = new Set<BuildingType>([
  "medical_building",
  "commercial",
  "mixed_use",
  "office",
  "new_building",
]);
const MOVE_IN_TIMELINES = new Set<MoveInTimeline>([
  "immediate",
  "within_1_month",
  "within_3_months",
  "within_6_months",
  "flexible",
]);

interface RawOfferRequestDto {
  dealType?: DealType;
  purchasePrice?: unknown;
  jeonseDeposit?: unknown;
  monthlyDeposit?: unknown;
  monthlyRent?: unknown;
  region?: string;
  desiredArea?: unknown;
  buildingTypes?: unknown;
  moveInTimeline?: MoveInTimeline;
  elevatorRequired?: unknown;
  note?: string;
}

function isPriceRange(value: unknown): value is PriceRangeDto {
  if (!value || typeof value !== "object") return false;
  const range = value as Partial<PriceRangeDto>;
  return (
    typeof range.min === "number" &&
    typeof range.max === "number" &&
    Number.isFinite(range.min) &&
    Number.isFinite(range.max) &&
    range.min > 0 &&
    range.max > 0 &&
    range.min <= range.max
  );
}

function isAreaRange(value: unknown): value is AreaRangeDto {
  if (!value || typeof value !== "object") return false;
  const range = value as Partial<AreaRangeDto>;
  return (
    typeof range.unit === "string" &&
    AREA_UNITS.has(range.unit as AreaUnit) &&
    typeof range.min === "number" &&
    typeof range.max === "number" &&
    Number.isFinite(range.min) &&
    Number.isFinite(range.max) &&
    range.min > 0 &&
    range.max > 0 &&
    range.min <= range.max
  );
}

function isBuildingTypes(value: unknown): value is BuildingType[] {
  return (
    Array.isArray(value) &&
    value.length > 0 &&
    value.every((type) => typeof type === "string" && BUILDING_TYPES.has(type as BuildingType))
  );
}

function validateOfferRequestDto(body: unknown): OfferRequestDto | string {
  if (!body || typeof body !== "object") return "요청 본문을 확인해 주세요.";

  const dto = body as RawOfferRequestDto;
  if (!dto.dealType || !DEAL_TYPES.has(dto.dealType)) return "거래 종류를 선택해 주세요.";
  if (typeof dto.region !== "string" || !dto.region.trim()) return "희망 지역을 선택해 주세요.";
  if (!isAreaRange(dto.desiredArea)) return "희망 전용면적을 확인해 주세요.";
  if (!isBuildingTypes(dto.buildingTypes)) return "건물 유형을 1개 이상 선택해 주세요.";
  if (!dto.moveInTimeline || !MOVE_IN_TIMELINES.has(dto.moveInTimeline)) return "입주 희망 시기를 선택해 주세요.";
  if (typeof dto.elevatorRequired !== "boolean") return "엘리베이터 조건을 선택해 주세요.";

  const region = dto.region.trim();
  const base = {
    region,
    desiredArea: dto.desiredArea,
    buildingTypes: dto.buildingTypes,
    moveInTimeline: dto.moveInTimeline,
    elevatorRequired: dto.elevatorRequired,
    note: typeof dto.note === "string" ? dto.note : "",
  };

  if (dto.dealType === "매매") {
    if (!isPriceRange(dto.purchasePrice)) return "매매가 범위를 확인해 주세요.";
    return { ...base, dealType: "매매", purchasePrice: dto.purchasePrice };
  }

  if (dto.dealType === "전세") {
    if (!isPriceRange(dto.jeonseDeposit)) return "전세 보증금 범위를 확인해 주세요.";
    return { ...base, dealType: "전세", jeonseDeposit: dto.jeonseDeposit };
  }

  if (!isPriceRange(dto.monthlyDeposit)) return "월세 보증금 범위를 확인해 주세요.";
  if (!isPriceRange(dto.monthlyRent)) return "월세 범위를 확인해 주세요.";
  return {
    ...base,
    dealType: "월세",
    monthlyDeposit: dto.monthlyDeposit,
    monthlyRent: dto.monthlyRent,
  };
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const result = validateOfferRequestDto(body);

  if (typeof result === "string") {
    return NextResponse.json({ message: result }, { status: 400 });
  }

  return NextResponse.json(
    {
      offerRequest: result,
      requestId: `REQ-${Date.now()}`,
    },
    { status: 201 }
  );
}
