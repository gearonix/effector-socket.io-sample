import { scope }       from '@core'

import { homeModel }   from '../parent/model'
import { atom }        from '../shared/atom'
import { Post }        from '../shared/interfaces'
import { postsSchema } from './schema'

export const childModel = atom(() => {
  const child = scope(homeModel.socket)

  const $posts = child.restore<Post[]>('postsReceived', {
    default: [],
    publish: {
      method: 'fetchPosts'
    },
    schema: postsSchema
  })

  return {
    $posts,
    socket: child
  }
})
