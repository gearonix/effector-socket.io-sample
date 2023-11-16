import { useGate }    from 'effector-react'
import { useUnit }    from 'effector-react'

import { childModel } from './model'

export const Child = () => {
  useGate(childModel.socket.Gate)

  const posts = useUnit(childModel.$posts)

  return <div>234{posts?.map((post) => <div>post {post.title}</div>)}</div>
}
