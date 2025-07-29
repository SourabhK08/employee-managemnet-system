import { useEffect, useState } from "react";


const useDebounce = (search,delay) => {
    const [debouncedValue, setdebouncedValue] = useState(search);

    useEffect(() => {
        const handler = setTimeout(() => {
            setdebouncedValue(search)
        },delay)

        return () => clearTimeout(handler)
    },[search,delay])

    return debouncedValue
}

export {useDebounce}