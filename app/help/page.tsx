"use client";

import Link from "next/link";
import { PageFrame } from "@/components/PageFrame";
import { useLanguage } from "@/components/LanguageProvider";

const topics = [
  ["Sources you can check", "Answers draw from agricultural knowledge and should include sources you can follow up on."],
  ["Honest about uncertainty", "If details are missing, we ask a short follow-up question. General guidance is not a diagnosis."],
  ["A photo is only a starting point", "Photos offer possible clues, never a confirmed diagnosis."],
  ["Your language, your pace", "Switch language in the header anytime. Navigation stays simple and readable."],
  ["Having trouble with voice?", "Check microphone permission. If voice input is unavailable, typing works just as well."],
];

export default function HelpPage() {
  const { t } = useLanguage();
  return <PageFrame eyebrow="Here for every growing season" title="A little help, a little clarity" description="Understand what Ashmithra can help with—and when it’s best to ask a local expert.">
    <div className="grid max-w-5xl gap-5 lg:grid-cols-[minmax(0,1fr)_380px]"><div className="space-y-3">{topics.map(([title, text]) => <article key={title} className="rounded-xl border border-[var(--line)] bg-white p-5"><h2 className="font-bold text-[var(--green)]">{t(title)}</h2><p className="mt-2 leading-6 text-[var(--muted)]">{t(text)}</p></article>)}</div><aside className="h-fit rounded-2xl border border-[var(--line)] bg-white p-5"><h2 className="text-lg font-bold text-[var(--green)]">{t("When should I contact an expert?")}</h2><p className="mt-3 leading-6">{t("For rapidly spreading damage, serious crop loss, or unclear symptoms, contact your local agricultural officer or Krishi Vigyan Kendra.")}</p><a className="mt-4 inline-flex font-bold text-[var(--green)] underline" href="https://kvk.icar.gov.in/" target="_blank" rel="noreferrer">{t("ICAR · KVK directory ↗")}</a><Link className="btn-secondary mt-5 flex items-center justify-center" href="/ask">{t("Ask Ashmithra")}</Link><p className="mt-4 text-xs text-[var(--muted)]">{t("Keep personal details out of questions and photos.")}</p></aside></div>
  </PageFrame>;
}
