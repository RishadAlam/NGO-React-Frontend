import { changeLanguage } from 'i18next'
import Cookies from 'js-cookie'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import Moon from '../../icons/Moon'
import Sun from '../../icons/Sun'
import {
  applyThemePalette,
  DEFAULT_THEME_PALETTE,
  getThemePalette,
  THEME_PALETTE_COOKIE,
  THEME_PALETTES
} from '../../resources/staticData/themePalettes'
import Button from '../utilities/Button'

export default function DarkLangButton() {
  const { t } = useTranslation()
  const darkMood = Cookies.get('isDark')
  const [isDark, setIsDark] = useState(() => (darkMood ? JSON.parse(darkMood) : false))
  const [lang, setLang] = useState(() => Cookies.get('i18next') || 'en')
  const [paletteId, setPaletteId] = useState(() =>
    getThemePalette(Cookies.get(THEME_PALETTE_COOKIE) || DEFAULT_THEME_PALETTE).id
  )

  const setDarkMood = () =>
    setIsDark((prevState) => {
      const nextIsDark = !prevState
      const mode = nextIsDark ? 'dark' : 'light'
      document.body.className = mode
      Cookies.set('isDark', nextIsDark, { expires: 30 })
      applyThemePalette(paletteId, mode)
      return nextIsDark
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

  const setThemePalette = (event) => {
    const nextPalette = getThemePalette(event.target.value).id
    setPaletteId(nextPalette)
    Cookies.set(THEME_PALETTE_COOKIE, nextPalette, { expires: 30 })
    applyThemePalette(nextPalette, isDark ? 'dark' : 'light')
  }

  const getPaletteLabel = (palette) => {
    const key = `theme_palette.options.${palette.id}`
    const translated = t(key)
    return translated === key ? palette.label : translated
  }

  return (
    <>
      <div className="DarkLangButton me-3 me-md-5 d-flex align-items-center gap-2">
        <span className="palette-label">{t('theme_palette.template')}</span>
        <select
          value={paletteId}
          onChange={setThemePalette}
          className="form-select form-select-sm"
          aria-label={t('theme_palette.template')}
          style={{
            width: '138px',
            backgroundColor: 'var(--soft-bg)',
            color: 'var(--main-color)',
            borderColor: 'var(--border-color)',
            fontSize: '12px'
          }}>
          {THEME_PALETTES.map((palette) => (
            <option value={palette.id} key={palette.id}>
              {getPaletteLabel(palette)}
            </option>
          ))}
        </select>
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
