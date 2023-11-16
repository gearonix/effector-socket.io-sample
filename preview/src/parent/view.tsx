import { useGate }   from 'effector-react'
import { useUnit }   from 'effector-react'
import { useState }  from 'react'

import { Child }     from '../child/view.tsx'
import { Message }   from '../shared/interfaces.ts'
import { homeModel } from './model.ts'

export const Parent = () => {
  const [isChildOpen, setChildOpen] = useState(false)

  useGate(homeModel.socket.Gate)

  const messages = useUnit(homeModel.$messages)
  const sendMessage = useUnit(homeModel.sendMessage)

  const toggleChild = () => {
    setChildOpen((val) => !val)
  }

  const onClick = () => {
    sendMessage({ message: 'Hello world!' })
  }

  return (
    <div>
      <button onClick={onClick}>send msg</button>
      {messages.map((msg: Message) => (
        <div>{msg.message}</div>
      ))}

      <button onClick={toggleChild}>toggleChild</button>
      {isChildOpen && <Child />}
    </div>
  )
}
