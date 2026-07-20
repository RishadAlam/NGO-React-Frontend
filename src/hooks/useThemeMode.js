import Cookies from 'js-cookie'
import { useCallback, useEffect, useState } from 'react'
import {
  applyThemePalette,
  DEFAULT_THEME_PALETTE,
  THEME_PALETTE_COOKIE
} from '../resources/staticData/themePalettes'

const THEME_MODE_CHANGE_EVENT = 'ngo-theme-mode-change'

const getStoredThemeMode = () => {
  const storedMode = Cookies.get('isDark')
  return storedMode ? JSON.parse(storedMode) === true : false
}

export default function useThemeMode() {
  const [isDark, setIsDark] = useState(getStoredThemeMode)

  useEffect(() => {
    const syncThemeMode = (event) => setIsDark(event.detail.isDark)
    window.addEventListener(THEME_MODE_CHANGE_EVENT, syncThemeMode)

    return () => window.removeEventListener(THEME_MODE_CHANGE_EVENT, syncThemeMode)
  }, [])

  const toggleThemeMode = useCallback(() => {
    setIsDark((currentMode) => {
      const nextIsDark = !currentMode
      const mode = nextIsDark ? 'dark' : 'light'
      const paletteId = Cookies.get(THEME_PALETTE_COOKIE) || DEFAULT_THEME_PALETTE

      document.body.className = mode
      Cookies.set('isDark', JSON.stringify(nextIsDark), { expires: 30 })
      applyThemePalette(paletteId, mode)
      window.dispatchEvent(
        new CustomEvent(THEME_MODE_CHANGE_EVENT, { detail: { isDark: nextIsDark } })
      )

      return nextIsDark
    })
  }, [])

  return { isDark, toggleThemeMode }
}
