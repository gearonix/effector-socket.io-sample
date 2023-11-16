import { useGate }   from 'effector-react'
import { useUnit }   from 'effector-react'
import { useState }  from 'react'

import { Child }     from './child/child.tsx'
import { homeModel } from './model.ts'
import { Message }   from './shared/interfaces.ts'

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
      {messages?.map((msg: Message) => <div>{msg.message}</div>)}

      <button onClick={toggleChild}>toggleChild</button>
      {isChildOpen && <Child />}
    </div>
  )
}
