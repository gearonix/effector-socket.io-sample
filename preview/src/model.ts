import { atom }    from '@core'
import { PREVIEW } from '@core'
import { sample }  from 'effector'
import { z }       from 'zod'

export const model = atom(() => {
  const socket = PREVIEW({
    dataPrefix: 'payload',
    logger: true,
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

  const [onChannelsReceived, $test] = socket.box('channelsReceived', {
    default: null,
    validate: testSchema
  })

  $test.watch((val) => {
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
