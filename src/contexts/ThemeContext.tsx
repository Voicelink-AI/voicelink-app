import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

type Theme = 'light' | 'dark' | 'auto';
type Language = 'en' | 'es' | 'fr' | 'de' | 'it' | 'pt' | 'ja' | 'ko' | 'zh';

interface ThemeContextType {
  theme: Theme;
  actualTheme: 'light' | 'dark';
  language: Language;
  setTheme: (theme: Theme) => void;
  setLanguage: (language: Language) => void;
  notifications: boolean;
  setNotifications: (enabled: boolean) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>(() => {
    const savedTheme = localStorage.getItem('voicelink-theme') as Theme;
    return savedTheme || 'light';
  });
  
  const [language, setLanguageState] = useState<Language>(() => {
    const savedLanguage = localStorage.getItem('voicelink-language') as Language;
    return savedLanguage || 'en';
  });
  
  const [notifications, setNotificationsState] = useState<boolean>(() => {
    const savedNotifications = localStorage.getItem('voicelink-notifications');
    return savedNotifications ? JSON.parse(savedNotifications) : true;
  });

  const [actualTheme, setActualTheme] = useState<'light' | 'dark'>('light');

  // Determine actual theme based on user preference and system preference
  useEffect(() => {
    if (theme === 'auto') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      setActualTheme(mediaQuery.matches ? 'dark' : 'light');
      
      const handleChange = (e: MediaQueryListEvent) => {
        setActualTheme(e.matches ? 'dark' : 'light');
      };
      
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    } else {
      setActualTheme(theme);
    }
  }, [theme]);

  // Apply theme to document
  useEffect(() => {
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(actualTheme);
    document.documentElement.setAttribute('data-theme', actualTheme);
  }, [actualTheme]);

  // Apply language to document
  useEffect(() => {
    document.documentElement.setAttribute('lang', language);
  }, [language]);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem('voicelink-theme', newTheme);
  };

  const setLanguage = (newLanguage: Language) => {
    setLanguageState(newLanguage);
    localStorage.setItem('voicelink-language', newLanguage);
  };

  const setNotifications = (enabled: boolean) => {
    setNotificationsState(enabled);
    localStorage.setItem('voicelink-notifications', JSON.stringify(enabled));
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        actualTheme,
        language,
        setTheme,
        setLanguage,
        notifications,
        setNotifications,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};
