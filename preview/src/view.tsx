import { useGate }   from 'effector-react'
import { useEvent }  from 'effector-react'
import { useEffect } from 'react'

import { model }     from './model.ts'

export const View = () => {
  useGate(model.Gate)
  const sendStrings = useEvent(model.sendStrings)

  useEffect(() => {
    sendStrings(2)
  }, [])

  return null
}

// export const Child = () => {
//   useGate(model.child.gate)
//
//   return null
// }
