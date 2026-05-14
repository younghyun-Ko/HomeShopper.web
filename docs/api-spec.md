# HomeShopper API Specification

Last updated: 2026-05-15

This document describes the API contract needed by the HomeShopper web MVP.

## Scope

- Base URL: same origin as the web app in local development, e.g. `http://localhost:3000`.
- Content type: `application/json` for all request and response bodies.
- Authentication: cookie-based session using `homeshopper_session`.
- Currency units:
  - Offer negotiation prices are in `만원`.
  - Listing/filter prices currently shown in the UI are in `억원`.
  - Request-budget ranges should use the numeric unit agreed by backend and frontend before production. The current `/api/offers` mock accepts plain numbers without converting display units.

## Common Response Shapes

### Error

```json
{
  "message": "로그인이 필요합니다."
}
```

### Auth User

```ts
type UserRole = "GENERAL" | "AGENT";

interface AuthUser {
  id: string;
  email: string;
  name: string;
  user_role: UserRole;
  agencyName?: string;
  licenseNumber?: string;
}
```

## Enums

```ts
type DealType = "매매" | "전세" | "월세";
type AreaUnit = "pyeong" | "sqm";

type BuildingType =
  | "medical_building"
  | "commercial"
  | "mixed_use"
  | "office"
  | "new_building";

type MoveInTimeline =
  | "immediate"
  | "within_1_month"
  | "within_3_months"
  | "within_6_months"
  | "flexible";

type OfferStatus =
  | "PENDING"
  | "ACCEPTED"
  | "REJECTED"
  | "COUNTER_OFFER"
  | "FINALIZED"
  | "WITHDRAWN";
```

## Implemented API

These routes already exist in the Next.js app and can be used as the baseline contract for a real backend.

### POST `/api/auth/signup`

Creates a user account and starts a session.

Request:

```json
{
  "email": "agent@homeshopper.kr",
  "password": "password123",
  "name": "전주파트너",
  "user_role": "AGENT",
  "agencyName": "홈쇼퍼 제휴공인중개사",
  "licenseNumber": "45113-2026-00001"
}
```

Rules:

- `user_role` must be `GENERAL` or `AGENT`.
- `email`, `password`, and `name` are required.
- `password` must be at least 8 characters.
- `AGENT` users require `agencyName` and `licenseNumber`.
- Duplicate email returns `400`.

Success `201`:

```json
{
  "user": {
    "id": "usr_agent_2",
    "email": "agent@homeshopper.kr",
    "name": "전주파트너",
    "user_role": "AGENT",
    "agencyName": "홈쇼퍼 제휴공인중개사",
    "licenseNumber": "45113-2026-00001"
  }
}
```

Side effect:

- Sets `Set-Cookie: homeshopper_session=...; HttpOnly; SameSite=Lax; Path=/`.

Error statuses:

- `400` invalid role, invalid required fields, short password, duplicate email.

### POST `/api/auth/login`

Logs in an existing user and starts a session.

Request:

```json
{
  "email": "general@homeshopper.kr",
  "password": "password123",
  "user_role": "GENERAL"
}
```

Notes:

- `user_role` is optional, but the frontend sends it.
- If `user_role` is present and does not match the account role, return `403`.

Success `200`:

```json
{
  "user": {
    "id": "usr_general_1",
    "email": "general@homeshopper.kr",
    "name": "김의사",
    "user_role": "GENERAL"
  }
}
```

Side effect:

- Sets `Set-Cookie: homeshopper_session=...; HttpOnly; SameSite=Lax; Path=/`.

Error statuses:

- `401` invalid email or password.
- `403` selected role does not match the account role.

### GET `/api/auth/me`

Returns the current authenticated user.

Authentication:

- Requires `homeshopper_session` cookie.

Success `200`:

```json
{
  "user": {
    "id": "usr_general_1",
    "email": "general@homeshopper.kr",
    "name": "김의사",
    "user_role": "GENERAL"
  }
}
```

Error statuses:

- `401` missing or invalid session.

### POST `/api/auth/logout`

Ends the current session.

Authentication:

- Works with or without a valid session.

Success `200`:

```json
{
  "ok": true
}
```

Side effect:

- Deletes `homeshopper_session`.

### POST `/api/auth/authorize`

Checks whether the current user has one of the allowed roles.

Authentication:

- Requires `homeshopper_session` cookie.

Request:

```json
{
  "allowedRoles": ["AGENT"]
}
```

Success `200`:

```json
{
  "allowed": true,
  "user": {
    "id": "usr_agent_2",
    "email": "agent@homeshopper.kr",
    "name": "전주파트너",
    "user_role": "AGENT",
    "agencyName": "홈쇼퍼 제휴공인중개사",
    "licenseNumber": "45113-2026-00001"
  },
  "requiredRoles": ["AGENT"]
}
```

Error statuses:

- `400` no valid roles provided.
- `401` missing or invalid session.
- `403` authenticated but not authorized. Response body still includes `allowed: false`, `user`, and `requiredRoles`.

### POST `/api/offers`

Submits a property-request form based on desired deal conditions.

Request variants:

```ts
interface PriceRangeDto {
  min: number;
  max: number;
}

interface AreaRangeDto {
  unit: "pyeong" | "sqm";
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

type OfferRequestDto =
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
```

Example request:

```json
{
  "dealType": "월세",
  "monthlyDeposit": {
    "min": 3000,
    "max": 5000
  },
  "monthlyRent": {
    "min": 200,
    "max": 350
  },
  "region": "전주시 덕진구 에코시티",
  "desiredArea": {
    "unit": "pyeong",
    "min": 30,
    "max": 50
  },
  "buildingTypes": ["medical_building", "new_building"],
  "moveInTimeline": "within_3_months",
  "elevatorRequired": true,
  "note": "내과 개원 예정입니다."
}
```

Validation:

- `dealType` must be one of `매매`, `전세`, `월세`.
- `region` must be a non-empty string.
- `desiredArea.min` and `desiredArea.max` must be positive finite numbers, and `min <= max`.
- `desiredArea.unit` must be `pyeong` or `sqm`.
- `buildingTypes` must contain at least one valid building type.
- `moveInTimeline` must be a valid timeline.
- `elevatorRequired` must be boolean.
- Required price range depends on `dealType`.
- All price ranges must use positive finite numbers, and `min <= max`.

Success `201`:

```json
{
  "offerRequest": {
    "dealType": "월세",
    "monthlyDeposit": {
      "min": 3000,
      "max": 5000
    },
    "monthlyRent": {
      "min": 200,
      "max": 350
    },
    "region": "전주시 덕진구 에코시티",
    "desiredArea": {
      "unit": "pyeong",
      "min": 30,
      "max": 50
    },
    "buildingTypes": ["medical_building", "new_building"],
    "moveInTimeline": "within_3_months",
    "elevatorRequired": true,
    "note": "내과 개원 예정입니다."
  },
  "requestId": "REQ-1778770000000"
}
```

Error statuses:

- `400` validation error.

## Proposed API For Mocked Frontend Flows

The following routes are not implemented yet, but the current UI has mocked flows that should connect to backend APIs.

### POST `/api/leads`

Used by the homepage consultation form.

Request:

```json
{
  "name": "홍길동",
  "phone": "010-1234-5678",
  "email": "hong@example.com",
  "privacyAgreed": true
}
```

Rules:

- `name`, `phone`, and `privacyAgreed: true` are required.
- `email` is optional.
- Backend should normalize phone digits and store the original submitted string if needed.

Success `201`:

```json
{
  "leadId": "LEAD-20260515-0001",
  "status": "RECEIVED"
}
```

Error statuses:

- `400` invalid required fields.

### POST `/api/partner-applications`

Used by the public partner application form for non-agent users.

Request:

```json
{
  "agencyName": "홈쇼퍼공인중개사사무소",
  "ownerName": "홍길동",
  "phone": "010-0000-0000",
  "address": "전주시 덕진구 에코시티로 00",
  "propertyTypes": ["메디컬 전문 빌딩", "일반 상가"]
}
```

Rules:

- All string fields are required.
- `propertyTypes` must contain at least one item.

Success `201`:

```json
{
  "applicationId": "PARTNER-20260515-0001",
  "status": "RECEIVED"
}
```

Error statuses:

- `400` invalid required fields.

### GET `/api/listings`

Returns property listings for `/offer`.

Query parameters:

```text
dealType=매매
region=서울시 강남구
areaUnit=pyeong
areaMin=30
areaMax=50
buildingTypes=medical_building,new_building
moveInTimeline=within_3_months
elevatorRequired=true
budgetMin=30
budgetMax=40
```

Response `200`:

```json
{
  "items": [
    {
      "id": "hs-101",
      "image": "/prop-1.png",
      "title": "강남역 인근 메디컬 타워 3층",
      "location": "서울시 강남구 역삼동",
      "region": "서울시 강남구",
      "specialty": "피부과 / 성형외과 추천",
      "status": "상담가능",
      "dealType": "매매",
      "buildingType": "medical_building",
      "moveInTimeline": "within_3_months",
      "elevatorRequired": true,
      "currentPrice": 38,
      "officialPrice": 28.4,
      "marketPrice": 35.2,
      "areaPyeong": 52,
      "deposit": 1,
      "detail": "강남역 도보권에 위치한 메디컬 전문 건물입니다.",
      "features": ["역세권", "전용 52평", "엘리베이터 3대", "주차 60대"]
    }
  ],
  "total": 1
}
```

### POST `/api/listings/{listingId}/offers`

Creates a buyer offer on a listed property.

Authentication:

- Requires `GENERAL` user.

Request:

```json
{
  "minPrice": 30,
  "maxPrice": 40,
  "message": "해당 조건으로 제안합니다."
}
```

Success `201`:

```json
{
  "offer": {
    "id": "OFR-008",
    "propertyId": "hs-101",
    "propertyName": "강남역 인근 메디컬 타워 3층",
    "propertyImage": "/prop-1.png",
    "originalPrice": 380000,
    "suggestedPrice": 350000,
    "moveInDate": "2026-07-01",
    "message": "해당 조건으로 제안합니다.",
    "status": "PENDING",
    "createdAt": "2026-05-15",
    "buyerName": "김의사",
    "competition": {
      "totalBidders": 1,
      "highestOffer": 350000,
      "averageOffer": 350000,
      "lowestOffer": 350000
    }
  }
}
```

Open question:

- The current listing modal collects a min/max range, while the negotiation dashboard uses a single `suggestedPrice`. Backend and frontend should agree whether the server stores `minPrice` and `maxPrice`, derives `suggestedPrice`, or changes the UI to collect one number.

### GET `/api/my/offers`

Returns offers made by the current buyer.

Authentication:

- Requires `GENERAL` user.

Success `200`:

```json
{
  "items": [
    {
      "id": "OFR-001",
      "propertyId": "P-101",
      "propertyName": "에코시티 메디컬타워 3층 301호",
      "propertyImage": "",
      "originalPrice": 5000,
      "suggestedPrice": 4500,
      "counterPrice": null,
      "moveInDate": "2026-07-01",
      "message": "도배 장판 새로 해주시면 바로 계약하겠습니다.",
      "status": "PENDING",
      "createdAt": "2026-04-28",
      "buyerName": "김의사",
      "competition": {
        "totalBidders": 4,
        "highestOffer": 4800,
        "averageOffer": 4550,
        "lowestOffer": 4200
      }
    }
  ]
}
```

### GET `/api/agent/offers`

Returns offers visible to the current agent.

Authentication:

- Requires `AGENT` user.

Query parameters:

```text
status=PENDING
```

Success `200`:

```json
{
  "items": [
    {
      "id": "OFR-001",
      "propertyId": "P-101",
      "propertyName": "에코시티 메디컬타워 3층 301호",
      "propertyImage": "",
      "originalPrice": 5000,
      "suggestedPrice": 4500,
      "counterPrice": null,
      "moveInDate": "2026-07-01",
      "message": "도배 장판 새로 해주시면 바로 계약하겠습니다.",
      "status": "PENDING",
      "createdAt": "2026-04-28",
      "buyerName": "김의사",
      "competition": {
        "totalBidders": 4,
        "highestOffer": 4800,
        "averageOffer": 4550,
        "lowestOffer": 4200
      }
    }
  ]
}
```

### PATCH `/api/offers/{offerId}`

Updates an offer status or price during negotiation.

Authentication:

- `AGENT` may set `ACCEPTED`, `REJECTED`, or `COUNTER_OFFER`.
- `GENERAL` owner of the offer may set `PENDING`, `FINALIZED`, or `WITHDRAWN`.

Request examples:

Agent accepts:

```json
{
  "status": "ACCEPTED"
}
```

Agent counters:

```json
{
  "status": "COUNTER_OFFER",
  "counterPrice": 4350
}
```

Buyer raises offer:

```json
{
  "status": "PENDING",
  "suggestedPrice": 4700
}
```

Buyer accepts counter-offer:

```json
{
  "status": "FINALIZED"
}
```

Buyer withdraws:

```json
{
  "status": "WITHDRAWN"
}
```

Success `200`:

```json
{
  "offer": {
    "id": "OFR-005",
    "propertyId": "P-104",
    "propertyName": "금암동 메디컬프라자 4층 401호",
    "propertyImage": "",
    "originalPrice": 4500,
    "suggestedPrice": 4200,
    "counterPrice": 4350,
    "moveInDate": "2026-07-15",
    "message": "내과 개원 예정이며 CT 장비 반입 가능 여부가 중요합니다.",
    "status": "COUNTER_OFFER",
    "createdAt": "2026-04-22",
    "buyerName": "김의사",
    "competition": {
      "totalBidders": 3,
      "highestOffer": 4400,
      "averageOffer": 4200,
      "lowestOffer": 4000
    }
  }
}
```

Error statuses:

- `400` invalid status transition or missing required price field.
- `401` missing or invalid session.
- `403` role cannot perform this action.
- `404` offer not found.

Recommended status transitions:

```text
PENDING -> ACCEPTED        by AGENT
PENDING -> REJECTED        by AGENT
PENDING -> COUNTER_OFFER   by AGENT, requires counterPrice
PENDING -> WITHDRAWN       by GENERAL
COUNTER_OFFER -> FINALIZED by GENERAL
COUNTER_OFFER -> WITHDRAWN by GENERAL
COUNTER_OFFER -> PENDING   by GENERAL, requires suggestedPrice
```

## Frontend Integration Notes

- The current auth frontend expects `credentials: "same-origin"` default cookie behavior and parses `{ user }` responses.
- The current `/api/offers` route is a condition-request endpoint. If backend wants negotiation offers under the same path, consider renaming the current route to `/api/offer-requests` or keeping negotiation updates at `/api/negotiation-offers`.
- Current mock demo users:
  - General user: `general@homeshopper.kr` / `password123`
  - Agent user: `agent@homeshopper.kr` / `password123`
- For production, set cookie attributes with `Secure` on HTTPS and a real expiration policy.
