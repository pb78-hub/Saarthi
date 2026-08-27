"use client";

import { ChangeEvent, useEffect, useState } from "react";

const languages = [
  ["en", "English"],
  ["hi", "हिंदी (Hindi)"],
  ["gu", "ગુજરાતી (Gujarati)"],
  ["mr", "मराठी (Marathi)"],
  ["bn", "বাংলা (Bangla)"],
  ["te", "తెలుగు (Telugu)"],
  ["as", "অসমীয়া (Assamese)"],
  ["or", "ଓଡ଼ିଆ (Odia)"],
  ["ta", "தமிழ் (Tamil)"],
  ["ml", "മലയാളം (Malayalam)"],
  ["ur", "اردو (Urdu)"],
  ["sd", "Sindhi"],
  ["brx", "बड़ो (Bodo)"],
  ["kok", "कोंकणी (Konkani)"],
  ["ne", "नेपाली (Nepali)"],
  ["mni", "Manipuri"],
  ["pa", "ਪੰਜਾਬੀ (Punjabi)"],
  ["kn", "ಕನ್ನಡ (Kannada)"],
  ["doi", "डोगरी (Dogri)"],
  ["mai", "मैथिली (Maithili)"],
] as const;

export function LanguagePicker() {
  const [language, setLanguage] = useState("en");

  useEffect(() => {
    const savedLanguage = window.localStorage.getItem("saarthi-language");
    if (savedLanguage && languages.some(([code]) => code === savedLanguage)) {
      setLanguage(savedLanguage);
      document.documentElement.lang = savedLanguage;
    }
  }, []);

  const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const selectedLanguage = event.target.value;
    setLanguage(selectedLanguage);
    window.localStorage.setItem("saarthi-language", selectedLanguage);
    document.documentElement.lang = selectedLanguage;
  };

  return (
    <label className="language-picker">
      <span>Language</span>
      <select value={language} onChange={handleChange} aria-label="Choose a preferred language">
        {languages.map(([code, label]) => <option key={code} value={code}>{label}</option>)}
      </select>
    </label>
  );
}
