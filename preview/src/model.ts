import { connect }          from '@core'

import { websocketMethods } from './consts.ts'
import { atom }             from './shared/atom.ts'
import { Message }          from './shared/interfaces.ts'

export const homeModel = atom(() => {
  const socket = connect({
    logger: true,
    methods: websocketMethods,
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
