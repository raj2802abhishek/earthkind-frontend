import { useState, useEffect } from "react";
import { getLanguage, setLanguage, dictionary } from "./translations";

export function useTranslation() {
  const [lang, setLangState] = useState(getLanguage());

  useEffect(() => {
    const handleLanguageChange = () => {
      setLangState(getLanguage());
    };

    window.addEventListener("languageChanged", handleLanguageChange);
    window.addEventListener("storage", handleLanguageChange);

    return () => {
      window.removeEventListener("languageChanged", handleLanguageChange);
      window.removeEventListener("storage", handleLanguageChange);
    };
  }, []);

  const changeLanguage = (newLang) => {
    setLanguage(newLang);
  };

  const t = (key, fallback) => {
    return dictionary[lang]?.[key] || fallback || dictionary.en[key] || key;
  };

  return {
    lang,
    t,
    setLanguage: changeLanguage
  };
}
