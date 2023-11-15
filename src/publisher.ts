import { attach }                from 'effector'
import { createEvent }           from 'effector'
import { sample }                from 'effector'
import { Gate }                  from 'effector-react'

import { parseMethodToSend }     from './shared/lib'
import { wrapPayloadWithPrefix } from './shared/lib'
import { ContextProps }          from './shared/types'

export interface PublisherOptions {
  OverrideGate?: Gate<unknown>
}

export const createPublisher = <Methods extends Record<string, string>>({
  $instance,
  Gate,
  logger,
  opts
}: ContextProps<Methods>) => {
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
          wrapPayloadWithPrefix(opts.prefix, params)
        )

        logger('sent a request to the server', method)
      },
      source: $instance
    })

    const $isMounted = methodOptions?.OverrideGate?.status ?? Gate.status

    sample({
      clock: sendData,
      filter: $isMounted,
      target: emitSocketFx
    })

    return sendData
  }
}
