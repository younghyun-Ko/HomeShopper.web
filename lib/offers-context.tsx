"use client";

/*
 * 공유 Offers Context
 * /partner (B2B) ↔ /mypage/offers (C2B) 간 실시간 상태 동기화
 */

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

/* ── 타입 ── */

export type OfferStatus =
  | "PENDING"
  | "ACCEPTED"
  | "REJECTED"
  | "COUNTER_OFFER"
  | "FINALIZED"   // 매수자가 역제안 수락 → 최종 타결
  | "WITHDRAWN";  // 매수자가 제안 철회

/** 동일 매물에 대한 다른 제안자들의 경쟁 통계 */
export interface Competition {
  totalBidders: number;        // 총 제안자 수 (본인 포함)
  highestOffer: number;        // 최고 제안가 (만원)
  averageOffer: number;        // 평균 제안가 (만원)
  lowestOffer: number;         // 최저 제안가 (만원)
}

export interface Offer {
  id: string;
  propertyId: string;
  propertyName: string;
  propertyImage: string;
  originalPrice: number;
  suggestedPrice: number;
  counterPrice?: number;
  moveInDate: string;
  message: string;
  status: OfferStatus;
  createdAt: string;
  buyerName: string;
  competition: Competition;
}

interface OffersContextValue {
  offers: Offer[];
  updateStatus: (id: string, status: OfferStatus, extra?: Partial<Offer>) => void;
}

/* ── Mock 데이터 ── */

const INITIAL_OFFERS: Offer[] = [
  {
    id: "OFR-001",
    propertyId: "P-101",
    propertyName: "에코시티 메디컬타워 3층 301호",
    propertyImage: "",
    originalPrice: 5000,
    suggestedPrice: 4500,
    moveInDate: "2026-07-01",
    message: "도배 장판 새로 해주시면 바로 계약하겠습니다.",
    status: "PENDING",
    createdAt: "2026-04-28",
    buyerName: "김의사",
    competition: { totalBidders: 4, highestOffer: 4800, averageOffer: 4550, lowestOffer: 4200 },
  },
  {
    id: "OFR-002",
    propertyId: "P-102",
    propertyName: "서신동 대로변 1층 상가 A",
    propertyImage: "",
    originalPrice: 7000,
    suggestedPrice: 6200,
    moveInDate: "2026-08-15",
    message: "약국 개업 예정이라 간판 설치 가능 여부 확인 부탁드립니다.",
    status: "PENDING",
    createdAt: "2026-04-30",
    buyerName: "박약사",
    competition: { totalBidders: 3, highestOffer: 6800, averageOffer: 6400, lowestOffer: 6100 },
  },
  {
    id: "OFR-003",
    propertyId: "P-103",
    propertyName: "효자동 단지내 상가 2층 205호",
    propertyImage: "",
    originalPrice: 3000,
    suggestedPrice: 2800,
    moveInDate: "2026-06-01",
    message: "소아과 개원 예정입니다.",
    status: "ACCEPTED",
    createdAt: "2026-04-15",
    buyerName: "이소아",
    competition: { totalBidders: 2, highestOffer: 2800, averageOffer: 2650, lowestOffer: 2500 },
  },
  {
    id: "OFR-004",
    propertyId: "P-101",
    propertyName: "에코시티 메디컬타워 3층 302호",
    propertyImage: "",
    originalPrice: 5000,
    suggestedPrice: 3800,
    moveInDate: "2026-09-01",
    message: "예산이 빠듯합니다.",
    status: "REJECTED",
    createdAt: "2026-04-10",
    buyerName: "최내과",
    competition: { totalBidders: 5, highestOffer: 4900, averageOffer: 4400, lowestOffer: 3800 },
  },
  {
    id: "OFR-005",
    propertyId: "P-104",
    propertyName: "금암동 메디컬프라자 4층 401호",
    propertyImage: "",
    originalPrice: 4500,
    suggestedPrice: 4200,
    counterPrice: 4350,
    moveInDate: "2026-07-15",
    message: "내과 개원 예정이며 CT 장비 반입 가능 여부가 중요합니다.",
    status: "COUNTER_OFFER",
    createdAt: "2026-04-22",
    buyerName: "김의사",
    competition: { totalBidders: 3, highestOffer: 4400, averageOffer: 4200, lowestOffer: 4000 },
  },
  {
    id: "OFR-006",
    propertyId: "P-105",
    propertyName: "송천동 코너 상가 1층",
    propertyImage: "",
    originalPrice: 6000,
    suggestedPrice: 5500,
    moveInDate: "2026-08-01",
    message: "치과 개원 예정입니다. 급배수 시설 확인 부탁드립니다.",
    status: "PENDING",
    createdAt: "2026-05-01",
    buyerName: "정치과",
    competition: { totalBidders: 6, highestOffer: 5800, averageOffer: 5400, lowestOffer: 5000 },
  },
  {
    id: "OFR-007",
    propertyId: "P-102",
    propertyName: "서신동 대로변 1층 상가 B",
    propertyImage: "",
    originalPrice: 7000,
    suggestedPrice: 7000,
    counterPrice: 7200,
    moveInDate: "2026-06-15",
    message: "빠른 계약 희망합니다.",
    status: "COUNTER_OFFER",
    createdAt: "2026-04-18",
    buyerName: "박약사",
    competition: { totalBidders: 2, highestOffer: 7000, averageOffer: 6800, lowestOffer: 6600 },
  },
];

/* ── Context ── */

const OffersContext = createContext<OffersContextValue | null>(null);

export function OffersProvider({ children }: { children: ReactNode }) {
  const [offers, setOffers] = useState<Offer[]>(INITIAL_OFFERS);

  const updateStatus = useCallback(
    (id: string, status: OfferStatus, extra?: Partial<Offer>) => {
      setOffers((prev) =>
        prev.map((o) =>
          o.id === id ? { ...o, status, ...extra } : o
        )
      );
    },
    []
  );

  return (
    <OffersContext.Provider value={{ offers, updateStatus }}>
      {children}
    </OffersContext.Provider>
  );
}

export function useOffers() {
  const ctx = useContext(OffersContext);
  if (!ctx) throw new Error("useOffers must be used within OffersProvider");
  return ctx;
}