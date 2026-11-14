"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/components/LanguageProvider";

export function Header() {
  const { language, setLanguage, t } = useLanguage();
  return (
    <header className="border-b border-[#e5e6dc] bg-[var(--paper)]">
      <div className="page-shell flex h-[88px] items-center justify-between gap-6 md:h-[99px]">
        <Link href="/" className="flex items-center gap-3 text-[23px] font-bold tracking-[-.04em] text-[var(--green)]" aria-label="Ashmithra home">
          <img src="/icons/sprout.svg" className="icon" alt="" /><span>Ashmithra</span>
        </Link>
        <nav className="hidden items-center gap-8 text-[14px] font-bold text-[var(--green)] md:flex" aria-label="Main navigation">
          <Link href="/" className="hover:underline">{t("Home")}</Link><Link href="/weather" className="hover:underline">{t("Weather")}</Link><Link href="/saved" className="hover:underline">{t("Saved answers")}</Link><Link href="/help" className="hover:underline">{t("Help")}</Link>
        </nav>
        <label className="relative">
          <span className="visually-hidden">{t("Language")}</span>
          <select value={language} onChange={(event) => setLanguage(event.target.value as "en" | "ta")} className="h-[50px] appearance-none rounded-lg border border-[var(--line)] bg-white pl-4 pr-10 text-[14px] font-bold text-[var(--ink)] outline-none focus:border-[var(--green)]" aria-label={t("Language")}>
            <option value="en">English</option><option value="ta">தமிழ்</option>
          </select>
          <img src="/icons/chevron.svg" className="icon pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2" alt="" />
        </label>
      </div>
    </header>
  );
}

export function Footer() {
  const { t } = useLanguage();
  return <footer className="page-shell grid gap-3 border-t border-[#e5e6dc] py-6 text-[13px] text-[var(--muted)] sm:grid-cols-3 sm:items-center"><Link href="/" className="font-bold text-[var(--green)]">Ashmithra</Link><span className="sm:text-center">{t("For farmers. In your language.")}</span><span className="sm:text-right">English&nbsp; / &nbsp;தமிழ்&nbsp;&nbsp; · &nbsp; <Link href="/help" className="hover:underline">{t("Help & sources")}</Link></span></footer>;
}

export function MobileNavigation() {
  const path = usePathname();
  const { t } = useLanguage();
  const items = [{ href: "/", label: t("Home"), icon: "home" }, { href: "/weather", label: t("Weather"), icon: "cloud" }, { href: "/saved", label: t("Saved"), icon: "saved" }, { href: "/help", label: t("Help"), icon: "help" }];
  return <nav className="mobile-nav" aria-label="Mobile navigation">{items.map((item) => {
    const active = path === item.href;
    return <Link key={item.href} href={item.href} aria-current={active ? "page" : undefined} className={`flex h-[50px] flex-1 flex-col items-center justify-center gap-0.5 rounded-[10px] px-1 text-[11px] font-bold ${active ? "bg-[#eaf0e4] text-[var(--green)]" : "text-[var(--muted)]"}`}><img src={`/icons/${item.icon}.svg`} className="icon h-6 w-6" alt="" /><span>{item.label}</span></Link>;
  })}</nav>;
}
