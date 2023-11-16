import                    './style.css'

import { useGate }   from 'effector-react'
import { useUnit }   from 'effector-react'
import { useState }  from 'react'

import { Child }     from '../child/view'
import { Message }   from '../shared/interfaces'
import { homeModel } from './model'

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
    <div className="parent-container">
      <div className="parent-section">
        <h3>Example with publisher and event (parent.tsx)</h3>
        <button onClick={onClick} className="dark-button">
          Send Message
        </button>
        <div className="message-list">
          {messages.map((msg: Message) => (
            <div>ID: {msg.id}</div>
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
