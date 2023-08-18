import { changeLanguage } from 'i18next'
import Cookies from 'js-cookie'
import { useState } from 'react'
import Moon from '../../icons/Moon'
import Sun from '../../icons/Sun'
import Button from '../util/Button'

export default function DarkLangButton() {
  const [isDark, setIsDark] = useState(() => JSON.parse(Cookies.get('isDark')) || false)
  const [lang, setLang] = useState(() => Cookies.get('i18next') || 'en')

  const setDarkMood = () =>
    setIsDark((prevState) => {
      document.body.className = prevState ? 'light' : 'dark'
      Cookies.set('isDark', !prevState, { expires: 30 })
      return !prevState
    })

  const setLanguage = () => {
    changeLanguage(lang === 'en' ? 'bn' : 'en')
    setLang((prevState) => {
      const ln = prevState === 'en' ? 'bn' : 'en'
      document.querySelector('html').lang = ln
      Cookies.set('i18next', ln, { expires: 30 })
      return ln
    })
  }

  return (
    <>
      <div className="DarkLangButton me-5 d-flex justify-content-between" style={{ width: '80px' }}>
        <Button
          type="button"
          name={lang === 'en' ? 'Eng' : 'বাংলা'}
          disabled={false}
          loading={false}
          onclick={setLanguage}
          style={{
            backgroundColor: 'transparent',
            padding: '0',
            fontSize: '14px',
            fontWeight: '300'
          }}
        />
        <Button
          type="button"
          name={isDark ? <Moon /> : <Sun />}
          disabled={false}
          loading={false}
          onclick={setDarkMood}
          style={{
            backgroundColor: 'transparent',
            padding: '0',
            fontSize: '14px',
            fontWeight: '300'
          }}
        />
      </div>
    </>
  )
}
