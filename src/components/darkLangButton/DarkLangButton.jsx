import Cookies from 'js-cookie'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import useLanguageMode from '../../hooks/useLanguageMode'
import useThemeMode from '../../hooks/useThemeMode'
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
  const { language, toggleLanguage } = useLanguageMode()
  const { isDark, toggleThemeMode } = useThemeMode()
  const [paletteId, setPaletteId] = useState(
    () => getThemePalette(Cookies.get(THEME_PALETTE_COOKIE) || DEFAULT_THEME_PALETTE).id
  )

  /** @param {{ target: { value: string } }} event */
  const setThemePalette = (event) => {
    const nextPalette = getThemePalette(event.target.value).id
    setPaletteId(nextPalette)
    Cookies.set(THEME_PALETTE_COOKIE, nextPalette, { expires: 30 })
    applyThemePalette(nextPalette, isDark ? 'dark' : 'light')
  }

  /** @param {{ id: string, label: string }} palette */
  const getPaletteLabel = (palette) => {
    const key = `theme_palette.options.${palette.id}`
    const translated = t(key)
    return translated === key ? palette.label : translated
  }

  return (
    <>
      <div className="DarkLangButton d-flex align-items-center">
        <div className="palette-select-wrap">
          <select
            value={paletteId}
            onChange={setThemePalette}
            className="form-select form-select-sm palette-select"
            aria-label={t('theme_palette.template')}>
            {THEME_PALETTES.map((palette) => (
              <option value={palette.id} key={palette.id}>
                {getPaletteLabel(palette)}
              </option>
            ))}
          </select>
        </div>
        <Button
          type="button"
          name={language === 'en' ? 'Eng' : 'বাংলা'}
          disabled={false}
          loading={false}
          onclick={toggleLanguage}
          style={{}}
          endIcon={null}
          className={`topbar-lang-btn d-none d-md-inline-flex ${
            language === 'bn' ? 'is-bn' : 'is-en'
          }`}
        />
        <Button
          type="button"
          name={isDark ? <Moon /> : <Sun />}
          disabled={false}
          loading={false}
          onclick={toggleThemeMode}
          style={{}}
          endIcon={null}
          className="topbar-theme-btn d-none d-md-inline-flex"
        />
      </div>
    </>
  )
}
