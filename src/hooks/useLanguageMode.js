import { changeLanguage } from 'i18next'
import Cookies from 'js-cookie'
import { useCallback, useEffect, useState } from 'react'

const LANGUAGE_CHANGE_EVENT = 'ngo-language-change'

const getStoredLanguage = () => Cookies.get('i18next') || 'en'

export default function useLanguageMode() {
  const [language, setLanguage] = useState(getStoredLanguage)

  useEffect(() => {
    const syncLanguage = (event) => setLanguage(event.detail.language)
    window.addEventListener(LANGUAGE_CHANGE_EVENT, syncLanguage)
    return () => window.removeEventListener(LANGUAGE_CHANGE_EVENT, syncLanguage)
  }, [])

  const toggleLanguage = useCallback(() => {
    const nextLanguage = language === 'en' ? 'bn' : 'en'

    changeLanguage(nextLanguage)
    document.documentElement.lang = nextLanguage
    Cookies.set('i18next', nextLanguage, { expires: 30 })
    setLanguage(nextLanguage)
    window.dispatchEvent(
      new CustomEvent(LANGUAGE_CHANGE_EVENT, { detail: { language: nextLanguage } })
    )
  }, [language])

  return { language, toggleLanguage }
}
