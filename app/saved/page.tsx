"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { PageFrame } from "@/components/PageFrame";
import { localQuestions, type SavedQuestion } from "@/lib/questions";
import { useLanguage } from "@/components/LanguageProvider";

export default function SavedPage() {
  const { language, t } = useLanguage();
  const [items, setItems] = useState<SavedQuestion[]>([]);
  useEffect(() => setItems(localQuestions()), []);
  return <PageFrame eyebrow="Your library" title="Saved answers" description="Keep useful guidance close at hand.">
    <div className="max-w-3xl space-y-3">{items.length ? items.map((item) => <article key={item.id} className="rounded-2xl border border-[var(--line)] bg-white p-5"><p className="text-xs text-[var(--muted)]">{new Date(item.createdAt).toLocaleDateString(language === "ta" ? "ta-IN" : "en-IN")} · {t(item.topic)}</p>{item.contextSummary && <p className="mt-2 text-xs text-[var(--muted)]">{item.contextSummary}</p>}<h2 className="mt-2 font-bold text-[var(--green)]">{item.question}</h2><p className="mt-3 leading-6">{item.answer}</p>{item.steps?.length > 0 && <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-6">{item.steps.map((step) => <li key={step}>{step}</li>)}</ol>}{item.sources?.map((source) => <a key={source.url} className="mt-3 mr-4 inline-block text-sm font-bold text-[var(--green)] underline" href={source.url} target="_blank" rel="noreferrer">{source.label} ↗</a>)}</article>) : <div className="rounded-2xl border border-[var(--line)] bg-white p-8"><p className="font-bold text-[var(--green)]">{t("No saved answers yet")}</p><p className="mt-2 text-[var(--muted)]">{t("Ask a question and your recent guidance will appear here on this device.")}</p><Link href="/ask" className="btn-primary mt-5 inline-flex items-center">{t("Ask a question →")}</Link></div>}</div>
  </PageFrame>;
}
