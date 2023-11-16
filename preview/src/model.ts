import { connect } from '@core'

import { atom }    from './shared/atom.ts'
import { Message } from './shared/interfaces.ts'

export const homeModel = atom(() => {
  const socket = connect({
    logger: true,
    methods: {
      fetchPosts: 'namespace.fetch-posts',
      messageSent: 'namespace.message-sent',
      postsReceived: 'namespace.posts-received',
      sendMessage: 'namespace.send-message'
    },
    prefix: 'payload',
    uri: 'http://localhost:6868'
  })

  const [messageSent, $messages] = socket.subscribe<Message[]>('messageSent')
  const sendMessage = socket.publisher<Pick<Message, 'message'>>('sendMessage')

  return {
    $messages,
    sendMessage,
    socket
  }
})
