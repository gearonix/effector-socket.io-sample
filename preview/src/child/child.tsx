import { useGate }    from 'effector-react'
import { useUnit }    from 'effector-react'
import { useEffect }  from 'react'

import { childModel } from './model.ts'

export const Child = () => {
  useGate(childModel.socket.Gate)

  const fetchPosts = useUnit(childModel.fetchPosts)
  const posts = useUnit(childModel.$posts)

  useEffect(() => {
    fetchPosts()
  }, [])

  return <div>{posts?.map((post) => <div>post {post.title}</div>)}</div>
}
