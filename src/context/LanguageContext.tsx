import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'

type SupportedLang = 'en' | 'hi' | 'mr'

type Messages = Record<string, string>

const dictionaries: Record<SupportedLang, Messages> = {
  en: {
    'nav.dashboard': 'Overview Dashboard',
    'nav.crowd': 'Crowd Analytics',
    'nav.sales': 'Sales & Insights',
    'nav.competitors': 'Competitor Intel',
    'nav.predictions': 'Predictions',
    'nav.dataset': 'Dataset & Analysis',
    'nav.settings': 'Settings',

    'settings.title': 'Settings',
    'settings.subtitle': 'Configure your store type, notifications, and platform preferences',

    'pred.title': 'Predictions & Recommendations',
    'pred.subtitle': 'AI-powered forecasting, predictions, and smart business recommendations'
  },
  hi: {
    'nav.dashboard': 'सारांश डैशबोर्ड',
    'nav.crowd': 'भीड़ विश्लेषण',
    'nav.sales': 'बिक्री व इनसाइट्स',
    'nav.competitors': 'प्रतिद्वंद्वी विश्लेषण',
    'nav.predictions': 'पूर्वानुमान',
    'nav.dataset': 'डेटासेट व विश्लेषण',
    'nav.settings': 'सेटिंग्स',

    'settings.title': 'सेटिंग्स',
    'settings.subtitle': 'स्टोर प्रकार, सूचनाएं और प्लेटफ़ॉर्म वरीयताएँ कॉन्फ़िगर करें',

    'pred.title': 'पूर्वानुमान और सिफारिशें',
    'pred.subtitle': 'एआई-संचालित पूर्वानुमान, भविष्यवाणियाँ और स्मार्ट व्यावसायिक सिफारिशें'
  },
  mr: {
    'nav.dashboard': 'आढावा डॅशबोर्ड',
    'nav.crowd': 'गर्दी विश्लेषण',
    'nav.sales': 'विक्री व इनसाइट्स',
    'nav.competitors': 'स्पर्धक विश्लेषण',
    'nav.predictions': 'भविष्यवाणी',
    'nav.dataset': 'डेटासेट व विश्लेषण',
    'nav.settings': 'सेटिंग्ज',

    'settings.title': 'सेटिंग्ज',
    'settings.subtitle': 'स्टोअर प्रकार, सूचना आणि प्लॅटफॉर्म प्राधान्ये कॉन्फिगर करा',

    'pred.title': 'पूर्वानुमान आणि शिफारसी',
    'pred.subtitle': 'एआय-आधारित पूर्वानुमान, भविष्यवाणी आणि स्मार्ट व्यावसायिक शिफारसी'
  }
}

interface LanguageContextType {
  language: SupportedLang
  setLanguage: (lang: SupportedLang) => void
  t: (key: string, fallback?: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<SupportedLang>('en')

  useEffect(() => {
    const stored = window.localStorage.getItem('vyapariq_lang')
    if (stored === 'hi' || stored === 'mr' || stored === 'en') {
      setLanguageState(stored)
    }
  }, [])

  const setLanguage = (lang: SupportedLang) => {
    setLanguageState(lang)
    window.localStorage.setItem('vyapariq_lang', lang)
  }

  const t = (key: string, fallback?: string) => {
    const dict = dictionaries[language] || dictionaries.en
    return dict[key] ?? fallback ?? dictionaries.en[key] ?? fallback ?? key
  }

  const value = useMemo(
    () => ({ language, setLanguage, t }),
    [language]
  )

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  )
}

export const useLanguage = (): LanguageContextType => {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLanguage must be used inside LanguageProvider')
  return ctx
}

