import { useGate }   from 'effector-react'
import { useEvent }  from 'effector-react'
import { useEffect } from 'react'

import { model }     from './model.ts'

export const View = () => {
  useGate(model.Gate)
  const sendStrings = useEvent(model.sendStrings)
  const publisher = useEvent(model.publisher)

  useEffect(() => {
    sendStrings(2)
    publisher()
  }, [])

  return <Child />
}

export const Child = () => {
  useGate(model.ChildGate)

  return null
}
