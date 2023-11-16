import { useCallback } from 'react'
import { useEffect }   from 'react'
import { useState }    from 'react'

export const useIsMounted = () => {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)

    return () => {
      setIsLoaded(false)
    }
  }, [])

  return useCallback(() => isLoaded, [isLoaded])
}
