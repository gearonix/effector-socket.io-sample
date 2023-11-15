import { attach }                from 'effector'
import { sample }                from 'effector'
import { createEvent }           from 'effector'

import { PreparedProps }         from './interfaces'
import { parseMethodToSend }     from './shared/helpers'
import { wrapPayloadWithPrefix } from './shared/helpers'

export const publisher = <Methods extends Record<string, string>>({
  $instance,
  logger,
  opts
}: PreparedProps<Methods>) => {
  return <P>(method: Extract<keyof Methods, string>) => {
    const sendData = createEvent<P>()

    const emitSocketFx = attach({
      effect: (socket, params: P) => {
        if (!socket) return

        socket.emit(
          parseMethodToSend(opts.methods, method),
          wrapPayloadWithPrefix(opts.dataPrefix, params)
        )

        logger(`sent a request to the server (${method})`)
      },
      source: $instance
    })

    sample({
      clock: sendData,
      target: emitSocketFx
    })

    return sendData
  }
}
