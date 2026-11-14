"use client";

import Link from "next/link";
import { Footer, Header, MobileNavigation } from "@/components/Header";
import { useLanguage } from "@/components/LanguageProvider";

export function PageFrame({ eyebrow, title, description, children, hideBack = false, compactTitle = false }: { eyebrow: string; title: string; description?: string; children: React.ReactNode; hideBack?: boolean; compactTitle?: boolean }) {
  const { t } = useLanguage();
  const descriptionClass = compactTitle ? "mt-2 text-[15px] leading-6" : "mt-4 text-lg leading-7";
  const contentClass = compactTitle ? "mt-7" : "mt-9";
  return <><Header /><main className="page-shell min-h-[calc(100vh-190px)] py-10 sm:py-14">{!hideBack && <Link href="/" className="inline-flex items-center gap-2 text-sm font-bold text-[var(--green)] hover:underline">← {t("Back home")}</Link>}<p className={`${hideBack ? "mt-0" : "mt-8"} text-xs font-bold uppercase tracking-[.06em] text-[var(--green)]`}>{t(eyebrow)}</p><h1 className={`${compactTitle ? "mt-2 text-[28px]" : "mt-3 text-4xl sm:text-5xl"} max-w-3xl font-bold leading-tight tracking-[-.03em] text-[var(--green)]`}>{t(title)}</h1>{description && <p className={`${descriptionClass} max-w-3xl text-[var(--muted)]`}>{t(description)}</p>}<div className={contentClass}>{children}</div></main><Footer /><MobileNavigation /></>;
}
