import { connect } from '@core'

import { atom }    from '../shared/atom'
import { Message } from '../shared/interfaces'
import { methods } from './consts'

export const homeModel = atom(() => {
  const socket = connect({
    logger: true,
    methods,
    prefix: 'payload',
    uri: 'http://localhost:6868'
  })

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [messageSent, $messages] = socket.subscribe<Message[]>('messageSent')
  const sendMessage = socket.publisher<Pick<Message, 'message'>>('sendMessage')

  return {
    $messages,
    sendMessage,
    socket
  }
})
