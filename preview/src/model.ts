import { createSocket } from '@core'
import { scope }        from '@core'
import { z }            from 'zod'

export const atom = <T>(factory: () => T) => factory()

export const model = atom(() => {
  const socket = createSocket({
    dataPrefix: 'payload',
    logger: true,
    methods: {
      channelsReceived: 'channels.channels-received',
      childChannelsReceived: 'channels.child-channels-received',
      stringReceived: 'channels.string-received'
    },
    uri: 'http://localhost:6868'
  })

  const child = scope(socket)

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
  const [test, $store] = child.box<string>('childChannelsReceived', {
    default: null
  })

  $store.watch((val) => {
    console.log(val)
  })

  const publisher = child.publisher('childChannelsReceived')

  return {
    ChildGate: child.Gate,
    Gate: socket.Gate,
    publisher,
    sendStrings
  }
})
