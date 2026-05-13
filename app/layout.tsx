import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Mail, MapPin, Phone, Shield } from "lucide-react";
import { AuthProvider } from "@/lib/auth-context";
import { OffersProvider } from "@/lib/offers-context";
import Navbar from "./navbar";
import "./globals.css";

/*
 * Inter 폰트 (영문/숫자). Pretendard는 globals.css CDN.
 */
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "홈쇼퍼 | 개원 부동산, 이제 안심하세요",
  description:
    "전속 중개 매칭과 AI 권리관계 분석으로 중개 수수료를 대폭 절감하는 프롭테크 플랫폼",
  openGraph: {
    title: "홈쇼퍼 | 개원 부동산, 이제 안심하세요",
    description:
      "전속 중개 매칭과 AI 권리관계 분석으로 중개 수수료를 대폭 절감하는 프롭테크 플랫폼",
    type: "website",
    locale: "ko_KR",
  },
};

function Footer() {
  return (
    <footer className="border-t border-primary/10 bg-white">
      <div className="mx-auto grid max-w-content gap-8 px-6 py-12 text-sm text-text-muted md:grid-cols-3">
        <div>
          <p className="text-base font-black text-primary">
            Home<span className="text-brand-gradient">Shopper</span>
          </p>
          <div className="mt-4 space-y-1.5 text-xs leading-relaxed">
            <p>홈쇼퍼 | 대표: 고영현</p>
            <p>사업자등록번호: 000-00-00000</p>
            <p>전북 전주시 덕진구 에코시티로 00</p>
          </div>
        </div>

        <div>
          <p className="text-xs font-extrabold text-primary/70">고객센터</p>
          <div className="mt-4 space-y-2 text-xs">
            <p className="flex items-center gap-2">
              <Mail className="h-3.5 w-3.5" />
              contact@homeshopper.kr
            </p>
            <p className="flex items-center gap-2">
              <Phone className="h-3.5 w-3.5" />
              0507-0000-0000
            </p>
            <p className="flex items-center gap-2">
              <MapPin className="h-3.5 w-3.5" />
              평일 10:00 - 18:00 (주말·공휴일 휴무)
            </p>
          </div>
        </div>

        <div>
          <p className="text-xs font-extrabold text-primary/70">약관 및 정책</p>
          <div className="mt-4 space-y-2 text-xs">
            {["이용약관", "개인정보처리방침", "분쟁해결기준"].map((item) => (
              <p key={item} className="flex items-center gap-2">
                <Shield className="h-3.5 w-3.5" />
                {item}
              </p>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-primary/5 px-6 py-8 text-center text-xs text-text-muted/70">
        © {new Date().getFullYear()} HomeShopper. All rights reserved. 홈쇼퍼는 통신판매중개자이며,
        통신판매의 당사자가 아닙니다.
      </div>
    </footer>
  );
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" className={inter.variable} data-scroll-behavior="smooth">
      <body className="flex min-h-screen flex-col font-sans">
        <AuthProvider>
          <OffersProvider>
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </OffersProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
