import { atom }    from '@core'
import { PREVIEW } from '@core'
import { z }       from 'zod'

export const model = atom(() => {
  const socket = PREVIEW({
    dataPrefix: 'payload',
    methods: {
      channelsReceived: 'channels.channels-received',
      stringReceived: 'channels.string-received'
    },
    uri: 'http://localhost:6868'
  })

  // const socketChild = scope(socket)

  const testSchema = z.array(
    z.object({
      id: z.string()
    })
  )

  const $test = socket.box<number>('channelsReceived', {
    default: null,
    validate: testSchema
  })

  $test.watch($test, (val) => {
    console.log(val)
  })

  const sendStrings = socket.publisher('stringReceived')
  // const testEmit = socketChild.emit('channelsReceived')

  // testEmit()
  return {
    Gate: socket.Gate,
    sendStrings
  }
})
