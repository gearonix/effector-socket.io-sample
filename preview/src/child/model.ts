import { scope }       from '@core'

import { homeModel }   from '../model.ts'
import { atom }        from '../shared/atom.ts'
import { Post }        from '../shared/interfaces.ts'
import { postsSchema } from './schema.ts'

export const childModel = atom(() => {
  const child = scope(homeModel.socket)

  const fetchPosts = child.publisher('fetchPosts')

  const $posts = child.restore<Post[]>('postsReceived', {
    default: [],
    schema: postsSchema
  })

  fetchPosts()

  return {
    $posts,
    fetchPosts,
    socket: child
  }
})
