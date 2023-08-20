import { useEffect, useState } from 'react'

const useSessionStorage = (key, initialValue = null) => {
  const [value, setValue] = useState(() => {
    const localValue = sessionStorage.getItem(key)
    return localValue ? JSON.parse(localValue) : initialValue
  })

  useEffect(() => {
    sessionStorage.setItem(key, JSON.stringify(value))
  }, [value, setValue])

  return [value, setValue]
}

export default useSessionStorage
