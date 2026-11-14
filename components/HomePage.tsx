"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Footer, Header, MobileNavigation } from "@/components/Header";
import { useLanguage } from "@/components/LanguageProvider";

type RecognitionResultEvent = { results: Array<Array<{ transcript: string }>> };
type Recognition = { lang: string; onresult: ((event: RecognitionResultEvent) => void) | null; onerror: (() => void) | null; start: () => void };
type RecognitionWindow = Window & { SpeechRecognition?: new () => Recognition; webkitSpeechRecognition?: new () => Recognition };

const topics = [
  { name: "Crops", detail: "Sowing to harvest", icon: "sprout", prompt: "How can I improve my crop health?" },
  { name: "Pests", detail: "Know what to look for", icon: "bug", prompt: "How can I identify pests in my crop?" },
  { name: "Soil", detail: "Healthier foundations", icon: "soil", prompt: "How can I check my soil health?" },
  { name: "Weather", detail: "Plan around the skies", icon: "cloud", prompt: "How should I plan farm work around the weather?" },
  { name: "Seeds", detail: "A better beginning", icon: "seed", prompt: "How do I choose seeds for my farm?" },
  { name: "Farming practices", detail: "Everyday know-how", icon: "book", prompt: "What farming practice should I try next?" },
];

export function HomePage() {
  const { language, t } = useLanguage();
  const [question, setQuestion] = useState("");
  const [voiceMessage, setVoiceMessage] = useState("");
  const router = useRouter();
  const ask = (value = question) => {
    if (!value.trim()) return;
    sessionStorage.setItem("ashmithra.draft-question", value.trim());
    router.push("/ask");
  };
  const startVoice = () => {
    const SpeechRecognition = (window as RecognitionWindow).SpeechRecognition || (window as RecognitionWindow).webkitSpeechRecognition;
    if (!SpeechRecognition) { setVoiceMessage(t("Voice typing is not available in this browser. You can type your question instead.")); return; }
    const recognition = new SpeechRecognition();
    recognition.lang = language === "ta" ? "ta-IN" : "en-IN"; recognition.onresult = (event) => setQuestion(event.results[0][0].transcript); recognition.onerror = () => setVoiceMessage(t("We couldn’t hear that. Check microphone access or type your question.")); recognition.start(); setVoiceMessage(t("Listening…"));
  };

  return <><Header /><main>
    <section className="page-shell grid gap-12 pb-16 pt-6 md:min-h-[595px] md:grid-cols-[1fr_1fr] md:items-center md:gap-[72px] md:pb-20 md:pt-16">
      <div className="max-w-[590px]">
        <p className="mb-7 text-[12px] font-bold uppercase tracking-[.06em] text-[var(--green)]">{t("Your everyday farm companion")}</p>
        <h1 className="max-w-[580px] text-[42px] font-bold leading-[1.18] tracking-[-.035em] text-[var(--green)] sm:text-[50px] lg:text-[58px]">{t("How can I help with your farm today?")}</h1>
        <p className="mt-6 max-w-[590px] text-[17px] leading-7 text-[var(--muted)]">{t("From sowing to harvest, practical guidance in your language. Backed by sources, clear about uncertainty.")}</p>
        <p className="mt-6 flex items-center gap-3 text-[14px] font-bold text-[var(--green)]"><span className="text-xl" aria-hidden="true">◖))</span>{t("Type it. Say it. Listen in your language.")}</p>
      </div>
      <div className="flex w-full flex-col gap-4">
        <form className="rounded-[20px] border-[1.5px] border-[var(--green)] bg-white p-5 sm:p-7 md:p-8" onSubmit={(event) => { event.preventDefault(); ask(); }}>
          <label htmlFor="home-question" className="mb-3 block text-[11px] font-bold uppercase tracking-[.04em] text-[var(--muted)]">{t("Your question")}</label>
          <textarea id="home-question" value={question} onChange={(event) => setQuestion(event.target.value)} placeholder={t("Why are my paddy leaves turning yellow?")} rows={2} className="min-h-[82px] w-full resize-y border-0 bg-transparent text-[17px] leading-7 text-[var(--muted)] outline-none placeholder:text-[#617064] md:min-h-[132px]" />
          <button type="button" onClick={startVoice} className="flex min-h-[52px] w-full items-center gap-3 rounded-xl bg-[var(--sage)] px-4 text-left text-[14px] font-bold text-[var(--green)] hover:bg-[#e0e9d7]"><img src="/icons/mic.svg" className="icon h-5 w-5" alt="" />{t(language === "ta" ? "Type or speak in Tamil" : "Type or speak in English")}</button>
          {voiceMessage && <p className="mt-2 text-xs text-[var(--muted)]" role="status">{voiceMessage}</p>}
          <button type="submit" className="btn-primary mt-5 w-full">{t("Ask Ashmithra")}&nbsp; →</button>
        </form>
        <div>
          <Link href="/photo" className="btn-secondary flex w-full items-center justify-center">Upload a crop photo</Link>
          <p className="mt-3 text-[12px] text-[var(--muted)]">A photo can offer clues, never a confirmed diagnosis.</p>
        </div>
      </div>
    </section>

    <section className="page-shell pb-10 md:pb-14">
      <h2 className="mb-7 text-[24px] font-bold text-[var(--green)] sm:text-[27px]">{t("A little guidance for every growing day")}</h2>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6 lg:gap-4">
        {topics.map((topic) => <button key={topic.name} onClick={() => ask(topic.prompt)} className="soft-card min-h-[142px] p-4 text-left transition hover:-translate-y-0.5 hover:border-[#9eaf9e] hover:shadow-sm sm:min-h-[166px] sm:p-5">
          <img src={`/icons/${topic.icon}.svg`} className="icon mb-3" alt="" /><span className="block font-bold text-[var(--green)]">{t(topic.name)}</span><span className="mt-2 block text-[13px] leading-5 text-[var(--muted)]">{t(topic.detail)}</span>
        </button>)}
      </div>
    </section>

    <section className="page-shell grid gap-4 pb-10 md:grid-cols-2 md:pb-8">
      <Link href="/weather" className="rounded-2xl bg-[var(--sage)] p-6 transition hover:brightness-[.98] sm:p-7">
        <div className="flex items-start justify-between"><p className="text-[11px] font-bold uppercase tracking-[.04em] text-[var(--green)]">{t("Thanjavur · Sample")}</p><img src="/icons/cloud.svg" className="icon" alt="" /></div>
        <h3 className="mt-2 text-[25px] font-bold text-[var(--green)]">{t("29° · Light rain")}</h3><p className="mt-3 text-[14px]">{t("Check soil moisture before irrigating.")} <span className="font-bold">{t("Weather & advisories →")}</span></p><p className="mt-3 text-[11px] text-[var(--muted)]">{t("Illustrative data, not live weather.")}</p>
      </Link>
      <Link href="/help" className="rounded-2xl bg-[var(--green)] p-6 text-white transition hover:bg-[var(--green-dark)] sm:p-7">
        <h3 className="text-[23px] font-bold">{t("Guidance, with care built in")}</h3><p className="mt-3 text-[15px]">{t("Curated sources. Clear uncertainty labels. Local expert support for serious or unclear problems.")}</p><p className="mt-3 font-bold text-[var(--gold)]">{t("How Ashmithra helps →")}</p>
      </Link>
    </section>
  </main><Footer /><MobileNavigation /></>;
}
