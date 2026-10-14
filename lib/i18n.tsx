'use client'

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'

export type Language = 'en' | 'te' | 'hi'

export const languages: { value: Language; label: string; nativeLabel: string }[] = [
  { value: 'en', label: 'English', nativeLabel: 'English' },
  { value: 'te', label: 'Telugu', nativeLabel: 'తెలుగు' },
  { value: 'hi', label: 'Hindi', nativeLabel: 'हिन्दी' },
]

const dictionary = {
  en: { dashboard: 'Virtual Lab', courses: 'My Courses', achievements: 'Achievements', settings: 'Settings', workspace: 'Workspace', language: 'Language', openExperiment: 'Open Experiment', tutor: 'AI Lab Tutor', send: 'Send', close: 'Close', askTutor: 'Ask about your practical...', tutorReady: 'I’m ready to help with your LabX experiments.', labSupport: 'LabX experiment support', tutorThinking: 'Tutor is thinking...', tutorUnavailable: 'Tutor unavailable. Please try again.', setup: 'Setup & calibration', runTrials: 'Run Trials & Readings', analysis: 'Analysis & Assessment', simulated: 'SIMULATED', virtualApparatus: 'Virtual apparatus', readingsSimulated: 'Readings are simulated', saveChanges: 'Save Changes', logOut: 'Log Out' },
  te: { dashboard: 'వర్చువల్ ల్యాబ్', courses: 'నా కోర్సులు', achievements: 'విజయాలు', settings: 'సెట్టింగ్‌లు', workspace: 'వర్క్‌స్పేస్', language: 'భాష', openExperiment: 'ప్రయోగం తెరవండి', tutor: 'AI ల్యాబ్ ట్యూటర్', send: 'పంపు', close: 'మూసివేయి', askTutor: 'మీ ప్రాక్టికల్ గురించి అడగండి...', tutorReady: 'మీ LabX ప్రయోగాలకు సహాయం చేయడానికి సిద్ధంగా ఉన్నాను.', labSupport: 'LabX ప్రయోగాల సహాయం', tutorThinking: 'ట్యూటర్ ఆలోచిస్తోంది...', tutorUnavailable: 'ట్యూటర్ అందుబాటులో లేదు. దయచేసి మళ్లీ ప్రయత్నించండి.', setup: 'సెటప్ & క్రమాంకనం', runTrials: 'ట్రయల్స్ & రీడింగ్స్', analysis: 'విశ్లేషణ & అంచనా', simulated: 'సిమ్యులేషన్', virtualApparatus: 'వర్చువల్ పరికరం', readingsSimulated: 'రీడింగ్స్ సిమ్యులేటెడ్', saveChanges: 'మార్పులను సేవ్ చేయండి', logOut: 'లాగ్ అవుట్' },
  hi: { dashboard: 'वर्चुअल लैब', courses: 'मेरे कोर्स', achievements: 'उपलब्धियां', settings: 'सेटिंग्स', workspace: 'वर्कस्पेस', language: 'भाषा', openExperiment: 'प्रयोग खोलें', tutor: 'AI लैब ट्यूटर', send: 'भेजें', close: 'बंद करें', askTutor: 'अपने प्रैक्टिकल के बारे में पूछें...', tutorReady: 'मैं आपके LabX प्रयोगों में मदद करने के लिए तैयार हूं।', labSupport: 'LabX प्रयोग सहायता', tutorThinking: 'ट्यूटर सोच रहा है...', tutorUnavailable: 'ट्यूटर उपलब्ध नहीं है। कृपया फिर प्रयास करें।', setup: 'सेटअप और कैलिब्रेशन', runTrials: 'ट्रायल और रीडिंग', analysis: 'विश्लेषण और आकलन', simulated: 'सिमुलेशन', virtualApparatus: 'वर्चुअल उपकरण', readingsSimulated: 'रीडिंग सिम्युलेटेड हैं', saveChanges: 'बदलाव सेव करें', logOut: 'लॉग आउट' },
} as const

type TranslationKey = keyof typeof dictionary.en
const LanguageContext = createContext<{ language: Language; setLanguage: (language: Language) => void; t: (key: TranslationKey) => string }>({ language: 'en', setLanguage: () => undefined, t: (key) => dictionary.en[key] })

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en')
  useEffect(() => { const saved = window.localStorage.getItem('labx-language'); if (saved === 'te' || saved === 'hi' || saved === 'en') setLanguageState(saved) }, [])
  useEffect(() => { document.documentElement.lang = language; window.localStorage.setItem('labx-language', language) }, [language])
  const setLanguage = (next: Language) => setLanguageState(next)
  const value = useMemo(() => ({ language, setLanguage, t: (key: TranslationKey) => dictionary[language][key] ?? dictionary.en[key] }), [language])
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLanguage() { return useContext(LanguageContext) }
export type { TranslationKey }
export const getTutorLanguageInstruction = (language: Language) => language === 'te' ? 'Respond only in Telugu (తెలుగు).' : language === 'hi' ? 'Respond only in Hindi (हिन्दी).' : 'Respond only in English.'
export const dictionaryForTesting = dictionary
