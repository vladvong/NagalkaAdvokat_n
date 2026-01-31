"use client";

import React, { createContext, useState, useEffect } from 'react';
import translations from '../constants/translations';

export const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('uk');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    // Спробуємо отримати мову з localStorage
    const savedLanguage = localStorage.getItem('selectedLanguage');
    if (savedLanguage) {
      setLanguage(savedLanguage);
    }
  }, []);

  useEffect(() => {
    if (isClient) {
      // Зберігаємо вибрану мову в localStorage
      localStorage.setItem('selectedLanguage', language);
    }
  }, [language, isClient]);

  const t = (key) => {
    const keys = key.split('.');
    const safeLanguage = translations[language] ? language : 'uk';
    let value = translations[safeLanguage];
    
    for (const k of keys) {
      if (value && typeof value === 'object') {
        value = value[k];
      } else {
        return key; // Повертаємо ключ, якщо переклад не знайдено
      }
    }
    
    return value || key;
  };

  const value = {
    language,
    setLanguage,
    t,
    translations,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};
