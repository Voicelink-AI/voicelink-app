import { useTheme } from '../contexts/ThemeContext';
import translations from '../utils/translations';

export function useTranslation() {
  const { language } = useTheme();

  const t = (key: string, variables?: Record<string, string>): string => {
    const translation = translations[key];
    if (!translation) {
      console.warn(`Translation key "${key}" not found`);
      return key;
    }

    let text = translation[language] || translation.en || key;
    
    // Replace variables in the translation
    if (variables) {
      Object.entries(variables).forEach(([variable, value]) => {
        text = text.replace(new RegExp(`{${variable}}`, 'g'), value);
      });
    }
    
    return text;
  };

  return { t };
}
