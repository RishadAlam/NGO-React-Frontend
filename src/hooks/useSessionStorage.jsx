import { useEffect, useState } from 'react'

const useSessionStorage = (key, initialValue) => {
    const [value, setValue] = useState(() => {
        const localValue = window.sessionStorage.getItem(key)
        return localValue ? JSON.parse(localValue) : initialValue
    })

    useEffect(() => {
        window.sessionStorage.setItem(key, JSON.stringify(value))
    }, [value, setValue])

    return ([value, setValue])
}

export default useSessionStorage