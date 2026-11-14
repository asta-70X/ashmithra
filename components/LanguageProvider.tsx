"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { translate, type Language } from "@/lib/translations";

type LanguageContextValue = { language: Language; setLanguage: (language: Language) => void; t: (text: string) => string };
const LanguageContext = createContext<LanguageContextValue>({ language: "en", setLanguage: () => {}, t: (text) => text });
const STORAGE_KEY = "ashmithra.language";

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en");
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === "ta" || saved === "en") setLanguageState(saved);
    document.documentElement.lang = saved === "ta" ? "ta" : "en";
  }, []);
  function setLanguage(next: Language) {
    setLanguageState(next);
    localStorage.setItem(STORAGE_KEY, next);
    document.documentElement.lang = next === "ta" ? "ta" : "en";
  }
  return <LanguageContext.Provider value={{ language, setLanguage, t: (text) => translate(text, language) }}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  return useContext(LanguageContext);
}
