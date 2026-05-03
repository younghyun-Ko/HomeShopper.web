import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";
import { OffersProvider } from "@/lib/offers-context";
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

function Navbar() {
  return (
    <nav className="sticky top-0 z-50 border-b border-primary/10 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-content items-center justify-between px-6 py-4">
        <Link
          href="/"
          className="text-lg font-extrabold tracking-tight text-primary"
        >
          HomeShopper
        </Link>

        <div className="flex items-center gap-5">
          <Link
            href="/mypage/offers"
            className="text-sm font-medium text-text-muted transition-colors hover:text-primary"
          >
            내 제안
          </Link>
          <Link
            href="/partner"
            className="text-sm font-medium text-text-muted transition-colors hover:text-primary"
          >
            중개사 제휴
          </Link>
        </div>
      </div>
    </nav>
  );
}

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
        <OffersProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </OffersProvider>
      </body>
    </html>
  );
}