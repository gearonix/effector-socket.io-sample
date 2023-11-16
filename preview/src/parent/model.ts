import { connect }     from '@core'
import { createStore } from 'effector'

import { atom }        from '../shared/atom'
import { Message }     from '../shared/interfaces'
import { methods }     from './consts'

export const homeModel = atom(() => {
  const socket = connect({
    logger: true,
    methods,
    prefix: 'payload',
    uri: 'http://localhost:6868'
  })
  const messageSent = socket.event<Message>('messageSent')

  const sendMessage = socket.publisher<Pick<Message, 'message'>>('sendMessage')

  const $messages = createStore<Message[]>([])

  $messages.on(messageSent, (s, message) => [...s, message])

  return {
    $messages,
    sendMessage,
    socket
  }
})
