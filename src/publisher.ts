import { attach }                from 'effector'
import { createEvent }           from 'effector'
import { sample }                from 'effector'
import { Gate }                  from 'effector-react'

import { parseMethodToSend }     from './shared/lib'
import { wrapPayloadWithPrefix } from './shared/lib'
import { createArrayStore }      from './shared/lib/effector'
import { ContextProps }          from './shared/types'

export interface PublisherOptions {
  OverrideGate?: Gate<unknown>
}

export const publisherMapper = <Methods extends Record<string, string>>({
  $instance,
  Gate,
  log,
  opts
}: ContextProps<Methods>) => {
  return <P = void>(
    method: Extract<keyof Methods, string>,
    methodOptions: PublisherOptions = { OverrideGate: Gate }
  ) => {
    const sendData = createEvent<P>()

    const publishers = createArrayStore<P>()

    const emitSocketFx = attach({
      effect: (socket, params: P) => {
        if (!socket) {
          return publishers.add(params)
        }

        socket.emit(
          parseMethodToSend(opts.methods, method),
          wrapPayloadWithPrefix(opts.prefix, params)
        )

        log('sent a request to the server', method)
      },
      source: $instance
    })

    sample({
      clock: sendData,
      target: emitSocketFx
    })

    sample({
      clock: [$instance, methodOptions.OverrideGate?.status],
      fn: (publishers) => {
        publishers.forEach(sendData)
      },
      source: publishers.$items
    })

    return sendData
  }
}
