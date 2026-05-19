import { createContext, useContext, useState, type ReactNode } from "react";
import translations, { type Lang } from "@/i18n/translations";

type Translations = typeof translations["en"];

interface LangContextValue {
  lang: Lang;
  setLang: (l: Lang) => void;
  T: Translations;
}

const LangContext = createContext<LangContextValue>({
  lang: "en",
  setLang: () => {},
  T: translations.en,
});

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => {
    return (localStorage.getItem("dpbg-lang") as Lang) || "en";
  });

  const setLang = (l: Lang) => {
    setLangState(l);
    localStorage.setItem("dpbg-lang", l);
  };

  return (
    <LangContext.Provider value={{ lang, setLang, T: translations[lang] }}>
      {children}
    </LangContext.Provider>
  );
}

export const useLang = () => useContext(LangContext);
