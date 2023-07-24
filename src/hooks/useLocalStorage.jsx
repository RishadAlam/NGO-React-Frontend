import { useEffect, useState } from 'react'

const useLocalStorage = (key, initialValue) => {
    const [value, setValue] = useState(() => {
        const localValue = window.localStorage.getItem(key)
        return localValue ? JSON.parse(localValue) : initialValue
    })

    useEffect(() => {
        window.localStorage.setItem(key, JSON.stringify(value))
    }, [value, setValue])

    return ([value, setValue])
}

export default useLocalStorage