import useLocalStorage from '../../hooks/useLocalStorage'
import Moon from '../../icons/Moon'
import Sun from '../../icons/Sun'
import Button from '../util/Button'

export default function DarkLangButton() {
  const [isDark, setIsDark] = useLocalStorage('dark')
  const setDarkMood = () =>
    setIsDark((prevState) => {
      document.body.className = prevState ? 'light' : 'dark'
      return !prevState
    })

  return (
    <>
      <div className="DarkLangButton me-5 d-flex justify-content-between" style={{ width: '80px' }}>
        <Button
          type="button"
          name="Eng"
          disabled={false}
          loading={false}
          style={{
            backgroundColor: 'transparent',
            padding: '0',
            fontSize: '14px',
            fontWeight: '300'
          }}
        />
        <Button
          type="button"
          name={isDark ? <Sun /> : <Moon />}
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
