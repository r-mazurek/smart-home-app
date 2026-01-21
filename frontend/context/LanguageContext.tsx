"use client"

import React, { createContext, useContext, useState, ReactNode } from "react";
import { pl } from '@/locales/pl'
import { en } from '@/locales/en'

type Translations = typeof pl;

interface LanguageContextType {
    language: string;
    t: Translations;
    toggleLanguage: () => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
    const [language, setLanguage] = useState('pl');

    const t = language === 'pl' ? pl : en;

    const toggleLanguage = () => {
        setLanguage((prev) => (prev === "pl" ? "en" : "pl"));
    };

    return (
        <LanguageContext.Provider value = {{ language, t, toggleLanguage }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error("useLanguage must be used within a LanguageProvider");
    }
    return context;
}