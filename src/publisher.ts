import { attach }                from 'effector'
import { sample }                from 'effector'
import { createEvent }           from 'effector'
import { Gate }                  from 'effector-react'
import { Socket }                from 'socket.io-client'

import { parseMethodToSend }     from './shared/helpers'
import { wrapPayloadWithPrefix } from './shared/helpers'
import { PreparedProps }         from './shared/interfaces'

export interface PublisherOptions {
  OverrideGate?: Gate<Socket>
}

export const createPublisher = <Methods extends Record<string, string>>({
  $instance,
  Gate,
  logger,
  opts
}: PreparedProps<Methods>) => {
  return <P = void>(
    method: Extract<keyof Methods, string>,
    methodOptions?: PublisherOptions
  ) => {
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

    const $isMounted = methodOptions?.OverrideGate.status ?? Gate.status

    sample({
      clock: sendData,
      filter: $isMounted,
      target: emitSocketFx
    })

    return sendData
  }
}
