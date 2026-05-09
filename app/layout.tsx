import type { Metadata } from "next";
import { Inter } from "next/font/google";
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
      <div className="mx-auto max-w-content px-6 py-8 text-center text-xs text-text-muted">
        © {new Date().getFullYear()} HomeShopper. All rights reserved.
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
    <html lang="ko" className={inter.variable}>
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
