import { useEffect, useState } from 'react'

const useLocalStorage = (key, initialValue = null) => {
  const [value, setValue] = useState(() => {
    const localValue = localStorage.getItem(key)
    return localValue ? JSON.parse(localValue) : initialValue
  })

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value))
  }, [value, setValue])

  return [value, setValue]
}

export default useLocalStorage
