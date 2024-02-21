import { useGate, useUnit } from 'effector-react'
import { childModel } from './model'

export const Child = () => {
  useGate(childModel.socket.Gate)

  const posts = useUnit(childModel.$posts)

  return (
    <div className="message-list">
      {posts.map((post) => (
        <div key={post.id}>{post.title.slice(0, 20)}</div>
      ))}
    </div>
  )
}
