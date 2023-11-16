import { useGate }   from 'effector-react'
import { useUnit }   from 'effector-react'

import { Child }     from '../child'
import { Message }   from '../shared/interfaces'
import { homeModel } from './model'

export const Parent = () => {
  useGate(homeModel.socket.Gate)

  const messages = useUnit(homeModel.$messages)
  const isChildOpen = useUnit(homeModel.$isChildOpen)

  const sendMessage = useUnit(homeModel.sendMessage)
  const toggleChild = useUnit(homeModel.toggleChild)

  const onClick = () => {
    sendMessage({ message: 'Hello world!' })
  }

  return (
    <div className="parent-container">
      <div className="parent-section">
        <h3>Example with publisher and event (parent.tsx)</h3>

        <button onClick={onClick} className="dark-button">
          Send Message
        </button>

        <div className="message-list">
          {messages.map((msg: Message) => (
            <div key={msg.id}>ID: {msg.id}</div>
          ))}
        </div>
      </div>

      <div className="parent-section">
        <h3>Example with restore and zod validation</h3>

        <button onClick={toggleChild} className="dark-button">
          {!isChildOpen ? 'Show' : 'Hide'} Posts
        </button>

        {isChildOpen && <Child />}
      </div>
    </div>
  )
}
