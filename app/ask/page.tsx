"use client";

import { FormEvent, useEffect, useState } from "react";
import { PageFrame } from "@/components/PageFrame";
import { useLanguage } from "@/components/LanguageProvider";
import { getSupabaseErrorMessage, saveQuestion, type SavedQuestion } from "@/lib/questions";

type RecognitionResultEvent = { results: Array<Array<{ transcript: string }>> };
type Recognition = { lang: string; onresult: ((event: RecognitionResultEvent) => void) | null; onerror: (() => void) | null; start: () => void };
type RecognitionWindow = Window & { SpeechRecognition?: new () => Recognition; webkitSpeechRecognition?: new () => Recognition };

export default function AskPage() {
  const { language, t } = useLanguage();
  const [question, setQuestion] = useState("");
  const [conversationQuestion, setConversationQuestion] = useState("");
  const [crop, setCrop] = useState("");
  const [location, setLocation] = useState("");
  const [stage, setStage] = useState("");
  const [reply, setReply] = useState("");
  const [answer, setAnswer] = useState<SavedQuestion | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const yellowQuestion = /yellow|pale|மஞ்சள/i.test(conversationQuestion);

  useEffect(() => {
    const draft = sessionStorage.getItem("ashmithra.draft-question") || "";
    if (draft) { setConversationQuestion(draft); sessionStorage.removeItem("ashmithra.draft-question"); }
  }, []);

  function submitQuestion(event: FormEvent) {
    event.preventDefault();
    if (!question.trim()) return;
    setConversationQuestion(question.trim());
    setQuestion("");
    setError("");
  }

  async function finishConversation(detail: string) {
    if (!conversationQuestion.trim()) return;
    setBusy(true); setError("");
    const context = { crop, location, stage };
    const fullQuestion = detail ? `${conversationQuestion}\n\nAdditional detail: ${detail}` : conversationQuestion;
    try {
      const result = await saveQuestion(fullQuestion, context, language === "ta" ? "தமிழ்" : "English", language);
      setAnswer(result);
    } catch (saveError) { setError(getSupabaseErrorMessage(saveError, "question", language)); }
    finally { setBusy(false); }
  }

  function startVoice() {
    const SpeechRecognition = (window as RecognitionWindow).SpeechRecognition || (window as RecognitionWindow).webkitSpeechRecognition;
    if (!SpeechRecognition) { setError(t("Voice typing is not available in this browser. You can type your question instead.")); return; }
    const recognition = new SpeechRecognition();
    recognition.lang = language === "ta" ? "ta-IN" : "en-IN";
    recognition.onresult = (event) => setReply(event.results[0][0].transcript);
    recognition.onerror = () => setError(t("We couldn’t hear that. Check microphone access or type your question."));
    recognition.start();
  }

  const pageTitle = answer ? t(answer.topic) : "Let’s work it out";
  const pageDescription = answer
    ? "First checks shaped by your crop, location, and growth stage. Confirm the cause with a local agricultural expert before treating the crop."
    : "Ask in your own words. Type or use your voice.";

  return <PageFrame eyebrow="Home / Ask a question" title={pageTitle} description={pageDescription} hideBack compactTitle>
    {!answer ? <div className="grid max-w-5xl gap-8 lg:grid-cols-[minmax(0,1fr)_380px]">
      <div className="order-2 space-y-6 lg:order-1">
        {!conversationQuestion ? <form onSubmit={submitQuestion} className="rounded-2xl border border-[var(--line)] bg-white p-4">
          <label className="visually-hidden" htmlFor="question-composer">{t("Your question")}</label>
          <textarea id="question-composer" value={question} onChange={(event) => setQuestion(event.target.value)} className="field min-h-28 resize-y border-0 text-base" placeholder={t("Type your question…")} />
          <div className="mt-3 flex flex-col gap-3 sm:flex-row"><button type="button" onClick={startVoice} className="btn-secondary flex flex-1 items-center gap-3 bg-[var(--sage)]"><img src="/icons/mic.svg" className="icon h-5 w-5" alt="" />{t("Tap to speak")}</button><button className="btn-primary flex-1" disabled={!question.trim()}>{t("Send reply →")}</button></div>
        </form> : <>
          <section className="rounded-2xl bg-[var(--green)] p-5 text-white"><p className="text-[10px] font-bold uppercase tracking-wide">{t("YOU")}</p><p className="mt-2 leading-6">{conversationQuestion}</p></section>
          {yellowQuestion && !answer && <section className="rounded-2xl border border-[var(--line)] bg-white p-5">
            <p className="text-[10px] font-bold uppercase tracking-wide text-[var(--green)]">ASHMITHRA</p>
            <h2 className="mt-3 text-lg font-bold leading-7 text-[var(--ink)]">{t("Which leaves turned yellow first — the older leaves or the new ones?")}</h2>
            <p className="mt-2 text-sm text-[var(--muted)]">{t("One small detail can help narrow down the possible causes.")}</p>
            <div className="mt-4 grid gap-2"><button className="btn-secondary bg-[var(--sage)]" disabled={busy} onClick={() => void finishConversation(t("Older leaves"))}>{t("Older leaves")}</button><button className="btn-secondary" disabled={busy} onClick={() => void finishConversation(t("New leaves"))}>{t("New leaves")}</button><button className="btn-secondary" disabled={busy} onClick={() => void finishConversation(t("I’m not sure"))}>{t("I’m not sure")}</button></div>
          </section>}
          <form onSubmit={(event) => { event.preventDefault(); void finishConversation(reply.trim()); setReply(""); }} className="rounded-2xl border border-[var(--line)] bg-white p-4">
            <textarea className="field min-h-[74px] border-0" value={reply} onChange={(event) => setReply(event.target.value)} placeholder={t("Type your reply…")} />
            <div className="mt-3 flex flex-col gap-3 sm:flex-row"><button type="button" onClick={startVoice} className="btn-secondary flex flex-1 items-center gap-3 bg-[var(--sage)]"><img src="/icons/mic.svg" className="icon h-5 w-5" alt="" />{t("Tap to speak")}</button><button className="btn-primary flex-1" disabled={busy}>{busy ? t("Saving…") : t("Send reply →")}</button></div>
            <p className="mt-3 text-[11px] leading-5 text-[var(--muted)]">{t("Voice input · English")}{language === "ta" ? " · தமிழ்" : ""}<br />{t("Review your words before sending.")}</p>
          </form>
        </>}
        {error && <p className="text-sm text-red-700" role="alert">{error}</p>}
      </div>
      <aside className="order-1 h-fit rounded-2xl bg-[var(--sage)] p-4 lg:order-2">
        <p className="text-[11px] font-bold uppercase tracking-wide text-[var(--green)]">{t("Your farm · optional")}</p>
        <div className="mt-3 space-y-2"><label className="block rounded-xl border border-[var(--line)] bg-white p-3 text-xs font-bold text-[var(--muted)]">{t("District")}<input className="mt-1 w-full border-0 bg-transparent text-base font-normal text-[var(--ink)] outline-none" value={location} onChange={(event) => setLocation(event.target.value)} placeholder={t("e.g. Thanjavur")} /></label>
          <label className="block rounded-xl border border-[var(--line)] bg-white p-3 text-xs font-bold text-[var(--muted)]">{t("Crop")}<input className="mt-1 w-full border-0 bg-transparent text-base font-normal text-[var(--ink)] outline-none" value={crop} onChange={(event) => setCrop(event.target.value)} placeholder={t("e.g. Paddy")} /></label>
          <label className="block rounded-xl border border-[var(--line)] bg-white p-3 text-xs font-bold text-[var(--muted)]">{t("Growth stage")}<input className="mt-1 w-full border-0 bg-transparent text-base font-normal text-[var(--ink)] outline-none" value={stage} onChange={(event) => setStage(event.target.value)} placeholder={t("e.g. Tillering")} /></label>
        </div><p className="mt-3 text-xs leading-5 text-[var(--muted)]">{t("These details help make the guidance relevant.")}</p>
      </aside>
    </div> : <div className="grid max-w-5xl gap-7 lg:grid-cols-[minmax(0,1fr)_300px]">
      <div className="space-y-5"><button className="text-sm font-bold text-[var(--green)] hover:underline" onClick={() => { setAnswer(null); setConversationQuestion(""); setQuestion(""); }}>{t("← Back to conversation")}</button>
        <div><p className="text-xs font-bold uppercase tracking-wide text-[var(--muted)]">{answer.contextSummary}</p><h2 className="mt-2 text-2xl font-bold text-[var(--green)]">{answer.question.split("\n")[0]}</h2></div>
        <section className="rounded-2xl border border-[var(--line)] bg-white p-5"><p className="text-xs font-bold uppercase tracking-wide text-[var(--green)]">{t("The short answer")}</p><p className="mt-3 text-lg font-bold leading-7">{answer.answer}</p></section>
        <section className="rounded-xl bg-[#fbf1d2] p-4"><p className="font-bold text-[#76540d]">{t("Not conclusive")}</p><p className="mt-1 text-sm leading-6 text-[#76540d]">{t("Several causes can look similar. This is guidance, not a diagnosis.")}</p></section>
        <section><h2 className="text-xl font-bold text-[var(--green)]">{t("What you can do next")}</h2><ol className="mt-4 space-y-4">{answer.steps.map((step, index) => <li className="flex gap-3" key={`${index}-${step}`}><span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--sage)] text-sm font-bold text-[var(--green)]">{index + 1}</span><span className="pt-1 leading-6">{step}</span></li>)}</ol></section>
      </div>
      <aside className="space-y-4"><section className="rounded-2xl bg-[var(--sage)] p-4"><h2 className="font-bold text-[var(--green)]">{t("Is the damage spreading quickly?")}</h2><p className="mt-2 text-sm leading-6">{t("Contact your local agricultural officer or KVK promptly. Avoid spraying before the cause is assessed.")}</p></section><section><h2 className="font-bold text-[var(--green)]">{t("Where this guidance comes from")}</h2><div className="mt-3 space-y-2">{answer.sources?.map((source) => <a key={source.url} className="block rounded-xl border border-[var(--line)] bg-white p-4 text-sm font-bold text-[var(--green)] underline" href={source.url} target="_blank" rel="noreferrer">{source.label} ↗</a>)}</div></section><button className="btn-primary w-full" onClick={() => window.speechSynthesis?.speak(new SpeechSynthesisUtterance(answer.answer))}>{t("Listen in English")}</button><button className="btn-secondary w-full" onClick={() => { setAnswer(null); setConversationQuestion(""); }}>{t("Ask another question")}</button><p className="text-xs text-[var(--muted)]">{t("Answer language: English · Change it anytime above")}</p></aside>
    </div>}
  </PageFrame>;
}
