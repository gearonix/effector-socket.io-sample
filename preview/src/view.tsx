import { useGate } from 'effector-react'

import { model }   from './model.ts'

export const View = () => {
  useGate(model.socket.gate)

  return null
}

// export const Child = () => {
//   useGate(model.child.gate)
//
//   return null
// }
