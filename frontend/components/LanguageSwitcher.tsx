"use client";
import { useLanguage } from "@/context/LanguageContext";

export default function LanguageSwitcher() {
    const { language, toggleLanguage } = useLanguage();

    return (
        <button
            onClick={toggleLanguage}
            className="fixed bottom-6 right-6 z-50 bg-white border border-gray-200 shadow-xl px-4 py-2 rounded-full font-bold text-sm hover:bg-gray-50 transition flex items-center gap-2 transform hover:scale-105"
        >
            <span className="text-xl">{language === 'pl' ? '🇺🇸' : '🇵🇱'}</span>
            <span className="text-gray-700">{language === 'pl' ? 'English' : 'Polski'}</span>
        </button>
    );
}