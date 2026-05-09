"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const NAV_LINKS = [
  { label: "서비스 소개", href: "/#service-intro", sectionId: "service-intro" },
  { label: "매물 보기", href: "/offer", pathname: "/offer" },
  { label: "AI 분석", href: "/#ai-analysis", sectionId: "ai-analysis" },
  { label: "상담 신청", href: "/#contact", sectionId: "contact" },
] as const;

const PAGE_LINKS = [
  { label: "내 제안", href: "/mypage/offers" },
  { label: "중개사 제휴", href: "/partner" },
] as const;

export default function Navbar() {
  const pathname = usePathname();
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    const sections = NAV_LINKS.map((link) =>
      "sectionId" in link ? document.getElementById(link.sectionId) : null,
    ).filter((section): section is HTMLElement => Boolean(section));

    if (sections.length === 0) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleSection = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visibleSection) {
          setActiveSection(visibleSection.target.id);
        }
      },
      {
        rootMargin: "-20% 0px -45% 0px",
        threshold: [0, 0.25, 0.5, 0.75],
      },
    );

    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, [pathname]);

  return (
    <nav className="sticky top-0 z-50 border-b border-primary/10 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-content items-center gap-5 px-6 py-4">
        <Link
          href="/"
          className="shrink-0 text-lg font-extrabold tracking-tight text-primary"
        >
          HomeShopper
        </Link>

        <div className="flex flex-1 items-center justify-end gap-5 overflow-x-auto">
          {NAV_LINKS.map((link) => {
            const isActive =
              ("sectionId" in link &&
                pathname === "/" &&
                activeSection === link.sectionId) ||
              ("pathname" in link && pathname === link.pathname);

            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={isActive ? "page" : undefined}
                className={`shrink-0 text-sm transition-colors hover:text-primary ${
                  isActive
                    ? "font-bold text-accent underline decoration-2 underline-offset-8"
                    : "font-medium text-text-muted"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
          {PAGE_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="shrink-0 text-sm font-medium text-text-muted transition-colors hover:text-primary"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
