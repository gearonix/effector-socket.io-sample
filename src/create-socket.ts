import { createEffect }             from 'effector'
import { restore }                  from 'effector'
import { sample }                   from 'effector'
import { createGate }               from 'effector-react'
import { io }                       from 'socket.io-client'
import { Socket }                   from 'socket.io-client'

import { box }                      from './box'
import { CreateSocketProps }        from './interfaces'
import { PreparedProps }            from './interfaces'
import { publisher }                from './publisher'
import { NoUriOrInstanceException } from './shared/exceptions'

export const createSocket = <Methods extends Record<string, string>>(
  opts: CreateSocketProps<Methods>
) => {
  if (!opts.uri && !opts.instance) {
    throw new NoUriOrInstanceException()
  }

  const WebsocketGate = createGate<Socket>()

  const getSocketInstanceFx = createEffect(
    () => opts.instance ?? io(opts.uri!, opts.options)
  )

  const $instance = restore(getSocketInstanceFx, null).on(
    WebsocketGate.close,
    (ins) => ins?.disconnect() ?? null
  )

  sample({
    clock: WebsocketGate.open,
    target: getSocketInstanceFx
  })

  const preparedProps: PreparedProps<Methods> = [$instance, opts]

  return {
    $instance,
    Gate: WebsocketGate,
    box: box(preparedProps),
    publisher: publisher(preparedProps)
  }
}
