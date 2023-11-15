import { createEffect }             from 'effector'
import { restore }                  from 'effector'
import { sample }                   from 'effector'
import { createGate }               from 'effector-react'
import { io }                       from 'socket.io-client'
import { Socket }                   from 'socket.io-client'

import { createBox }                from './box'
import { CreateSocketOptions }      from './interfaces'
import { PreparedProps }            from './interfaces'
import { publisher }                from './publisher'
import { NoUriOrInstanceException } from './shared/exceptions'
import { createLogger }             from './shared/helpers'

export const createSocket = <Methods extends Record<string, string>>(
  opts: CreateSocketOptions<Methods>
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

  const logger = createLogger(opts.logger)

  const preparedProps: PreparedProps<Methods> = {
    Gate: WebsocketGate,
    logger,
    opts
  }

  return {
    $instance,
    Gate: WebsocketGate,
    box: createBox(preparedProps),
    publisher: publisher(preparedProps)
  }
}
