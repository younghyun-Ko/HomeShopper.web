export type DealType = "매매" | "전세" | "월세";

export type AreaUnit = "pyeong" | "sqm";

export type BuildingType =
  | "medical_building"
  | "commercial"
  | "mixed_use"
  | "office"
  | "new_building";

export type MoveInTimeline =
  | "immediate"
  | "within_1_month"
  | "within_3_months"
  | "within_6_months"
  | "flexible";

export interface PriceRangeDto {
  min: number;
  max: number;
}

export interface AreaRangeDto {
  unit: AreaUnit;
  min: number;
  max: number;
}

interface OfferRequestBaseDto {
  region: string;
  desiredArea: AreaRangeDto;
  buildingTypes: BuildingType[];
  moveInTimeline: MoveInTimeline;
  elevatorRequired: boolean;
  note: string;
}

export type OfferRequestDto =
  | (OfferRequestBaseDto & {
      dealType: "매매";
      purchasePrice: PriceRangeDto;
    })
  | (OfferRequestBaseDto & {
      dealType: "전세";
      jeonseDeposit: PriceRangeDto;
    })
  | (OfferRequestBaseDto & {
      dealType: "월세";
      monthlyDeposit: PriceRangeDto;
      monthlyRent: PriceRangeDto;
    });
