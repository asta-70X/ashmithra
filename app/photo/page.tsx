"use client";

import { ChangeEvent, FormEvent, useState } from "react";
import { PageFrame } from "@/components/PageFrame";
import { getSupabaseErrorMessage, savePhotoRecord } from "@/lib/questions";
import { useLanguage } from "@/components/LanguageProvider";

export default function PhotoPage() {
  const { language, t } = useLanguage();
  const [file, setFile] = useState<File | null>(null);
  const [crop, setCrop] = useState(""); const [location, setLocation] = useState(""); const [symptoms, setSymptoms] = useState(""); const [message, setMessage] = useState(""); const [busy, setBusy] = useState(false);
  function pick(event: ChangeEvent<HTMLInputElement>) { const selected = event.target.files?.[0]; if (!selected) return; if (selected.size > 5 * 1024 * 1024) { setMessage(t("Please choose an image smaller than 5 MB.")); return; } if (!selected.type.startsWith("image/")) { setMessage(t("Choose a JPG, PNG, or other image file.")); return; } setFile(selected); setMessage(""); }
  async function submit(event: FormEvent) { event.preventDefault(); if (!file) { setMessage(t("Add a photo to continue.")); return; } setBusy(true); try { const result = await savePhotoRecord(file, { crop, location, stage: symptoms }, language === "ta" ? "தமிழ்" : "English"); setMessage(language === "ta" ? t(result.message) : result.message); } catch (saveError) { setMessage(getSupabaseErrorMessage(saveError, "photo", language)); } finally { setBusy(false); } }
  return <PageFrame eyebrow="Home / Crop photo" title="A closer look at your crop" description="Share what you see. Get help with what to check next.">
    <form onSubmit={submit} className="grid max-w-4xl gap-5 md:grid-cols-[1fr_1fr]">
      <section className="rounded-2xl border border-[#e6d9ac] bg-[#fbf4d9] p-5"><p className="font-bold text-[var(--green)]">{t("A photo is only a starting point")}</p><p className="mt-2 text-sm leading-6">{t("Images can offer possible clues, never a confirmed diagnosis. Don’t include people or personal documents in your photo.")}</p></section>
      <section className="rounded-2xl border border-dashed border-[#aab5a8] bg-white p-6"><img src="/icons/sprout.svg" className="icon" alt="" /><h2 className="mt-3 text-xl font-bold text-[var(--green)]">{t("Add a clear crop photo")}</h2><p className="mt-2 text-sm text-[var(--muted)]">{t("Use daylight. Include the affected leaf and, if possible, the whole plant.")}</p><label className="btn-primary mt-5 flex cursor-pointer items-center justify-center">{t(file ? "Choose a different photo" : "Choose a photo")}<input className="visually-hidden" type="file" accept="image/*" onChange={pick} /></label>{file && <p className="mt-3 truncate text-sm text-[var(--muted)]">{t("Selected:")} {file.name}</p>}<p className="mt-3 text-xs text-[var(--muted)]">{t("JPG, PNG · Up to 5 MB")}</p></section>
      <section className="rounded-2xl border border-[var(--line)] bg-white p-5 md:col-span-2"><h2 className="font-bold text-[var(--green)]">{t("Crop and symptom details")}</h2><div className="mt-4 grid gap-3 sm:grid-cols-3"><label className="text-sm text-[var(--muted)]">{t("Crop")}<input className="field mt-1" value={crop} onChange={(e) => setCrop(e.target.value)} placeholder={t("e.g. Paddy")} /></label><label className="text-sm text-[var(--muted)]">{t("Location")}<input className="field mt-1" value={location} onChange={(e) => setLocation(e.target.value)} placeholder={t("Village or district")} /></label><label className="text-sm text-[var(--muted)] sm:col-span-1">{t("What are you noticing?")}<input className="field mt-1" value={symptoms} onChange={(e) => setSymptoms(e.target.value)} placeholder={t("Spots, yellowing…")} /></label></div><button className="btn-primary mt-5 w-full sm:w-auto" disabled={busy}>{busy ? t("Saving…") : t("Continue →")}</button>{message && <p role="status" className="mt-3 text-sm text-[var(--muted)]">{message}</p>}</section>
    </form>
  </PageFrame>;
}
