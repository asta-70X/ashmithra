"use client";

import { PageFrame } from "@/components/PageFrame";
import { useLanguage } from "@/components/LanguageProvider";

const days = [{ day: "Today", icon: "cloud", high: "29°", low: "24°", note: "Light rain" }, { day: "Tomorrow", icon: "cloud", high: "30°", low: "24°", note: "Cloudy" }, { day: "Saturday", icon: "seed", high: "31°", low: "25°", note: "Partly cloudy" }, { day: "Sunday", icon: "cloud", high: "30°", low: "24°", note: "Light rain" }];

export default function WeatherPage() {
  const { t } = useLanguage();
  return <PageFrame eyebrow="For your field" title="Weather & advisories" description="Plan farm work with local conditions in mind.">
    <div className="max-w-4xl"><label className="block max-w-sm text-sm font-bold text-[var(--muted)]">{t("Location")}<input className="field mt-2" defaultValue="Thanjavur" /></label><div className="mt-5 rounded-xl border border-[#e6d9ac] bg-[#fbf4d9] p-4"><p className="font-bold">{t("Sample data · Not a live forecast")}</p><p className="mt-1 text-sm">{t("Check the official forecast before making field decisions.")}</p></div><section className="mt-5 rounded-2xl border border-[var(--line)] bg-white p-6"><p className="text-xs font-bold uppercase tracking-wide text-[var(--muted)]">{t("Today · 14 Nov")}</p><div className="mt-3 flex items-baseline gap-4"><span className="text-6xl font-bold text-[var(--green)]">29°</span><span className="text-[var(--muted)]">{t("Light rain · Low 24°")}</span></div><div className="mt-4 grid gap-3 border-t border-[var(--line)] pt-4 text-sm sm:grid-cols-2"><span>{t("Rain chance")}&nbsp; 70%</span><span>{t("Wind")}&nbsp; 12 km/h · {t("East")}</span></div></section><div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">{days.map((day) => <div key={day.day} className="rounded-xl border border-[var(--line)] bg-white p-4"><p className="font-bold text-[var(--green)]">{t(day.day)}</p><img src={`/icons/${day.icon}.svg`} className="icon my-3" alt="" /><p className="font-bold">{day.high} <span className="font-normal text-[var(--muted)]">{day.low}</span></p><p className="mt-1 text-sm text-[var(--muted)]">{t(day.note)}</p></div>)}</div><section className="mt-5 rounded-2xl bg-[var(--sage)] p-5"><h2 className="font-bold text-[var(--green)]">{t("Field note")}</h2><p className="mt-2 leading-6">{t("Before irrigating, check soil moisture. Rainfall can vary across nearby fields, so use local observations alongside an official forecast.")}</p></section></div>
  </PageFrame>;
}
