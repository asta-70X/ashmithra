import { ensureGuest, getSupabase } from "@/lib/supabase";
import { getGuidance } from "@/lib/guidance";

export type FarmContext = { crop?: string; location?: string; stage?: string };
export type SavedQuestion = { id: string; question: string; createdAt: string; answer: string; topic: string; steps: string[]; followUp: string; contextSummary: string; locationNote: string; cropNote?: string; sources: { label: string; url: string }[] };

const STORAGE_KEY = "ashmithra.questions.v1";

export function getSupabaseErrorMessage(error: unknown, action: "question" | "photo", language: "en" | "ta" = "en") {
  const code = typeof error === "object" && error !== null && "code" in error ? String(error.code) : "";
  if (code === "anonymous_provider_disabled") {
    return language === "ta" ? "Supabase அநாமதேய உள்நுழைவு முடக்கப்பட்டுள்ளது. Supabase-இல் Authentication → Sign In / Providers → Anonymous Sign-Ins என்பதைத் திறந்து இயக்கி, செயலியை மீண்டும் தொடங்கி முயற்சிக்கவும்." : "Supabase anonymous sign-ins are disabled. In your Supabase dashboard, open Authentication → Sign In / Providers → Anonymous Sign-Ins and enable it, then restart the app and try again.";
  }
  if (code === "42501") return language === "ta" ? "Supabase இந்தக் கோரிக்கையை அனுமதிக்கவில்லை. Ashmithra தரவுத்தள மாற்றமும் வரிசை-நிலை பாதுகாப்பு கொள்கைகளும் பயன்படுத்தப்பட்டுள்ளனவா சரிபார்க்கவும்." : "Supabase denied this request. Check that the latest Ashmithra migration and row-level security policies are applied.";
  if (code === "PGRST205") return language === "ta" ? "Supabase-இல் கேள்விகள் அட்டவணை கிடைக்கவில்லை. Ashmithra தரவுத்தள மாற்றத்தைப் பயன்படுத்தி API schema-வைப் புதுப்பிக்கவும்." : "Supabase cannot find the questions table. Apply the Ashmithra database migration and refresh the API schema.";
  if (language === "ta") return action === "photo" ? "புகைப்பட விவரங்களைச் சேமிக்க முடியவில்லை. இணைப்பைச் சரிபார்த்து மீண்டும் முயற்சிக்கவும்." : "உங்கள் கேள்வியைச் சேமிக்க முடியவில்லை. இணைப்பைச் சரிபார்த்து மீண்டும் முயற்சிக்கவும்.";
  const message = error instanceof Error ? error.message : "Unknown error";
  return `We couldn’t save your ${action}. ${message}`;
}

export function localQuestions(): SavedQuestion[] {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]") as SavedQuestion[]; } catch { return []; }
}

export async function saveQuestion(question: string, context: FarmContext, language: string, locale: "en" | "ta" = "en") {
  const supabase = getSupabase();
  const guidance = getGuidance(question, context, locale);
  const saved = { answer: guidance.answer, topic: guidance.topic, steps: guidance.steps, followUp: guidance.followUp, contextSummary: guidance.contextSummary, locationNote: guidance.locationNote, cropNote: guidance.cropNote, sources: guidance.sources };
  if (supabase) {
    const userId = await ensureGuest();
    const { data, error } = await supabase.from("questions").insert({ user_id: userId, question, farm_context: context, language }).select("id, created_at").single();
    if (error) throw error;
    const row: SavedQuestion = { id: data.id, question, createdAt: data.created_at, ...saved };
    localStorage.setItem(STORAGE_KEY, JSON.stringify([row, ...localQuestions()]));
    return row;
  }
  const row: SavedQuestion = { id: crypto.randomUUID(), question, createdAt: new Date().toISOString(), ...saved };
  localStorage.setItem(STORAGE_KEY, JSON.stringify([row, ...localQuestions()]));
  return row;
}

export async function savePhotoRecord(file: File, context: FarmContext, language = "English") {
  const supabase = getSupabase();
  if (!supabase) return { stored: false as const, message: "Photo details are ready. Add Supabase settings to enable secure uploads." };
  const userId = await ensureGuest();
  if (!userId) throw new Error("Could not start a secure session.");
  const path = `${userId}/${crypto.randomUUID()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "-")}`;
  const { error: uploadError } = await supabase.storage.from("crop-photos").upload(path, file, { upsert: false, contentType: file.type });
  if (uploadError) throw uploadError;
  const { error } = await supabase.from("questions").insert({ user_id: userId, question: "Crop photo review", farm_context: context, photo_path: path, language });
  if (error) throw error;
  return { stored: true as const, message: "Your photo was saved securely. A photo can offer clues, not a diagnosis." };
}
