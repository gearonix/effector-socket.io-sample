import { createEffect }             from 'effector'
import { restore }                  from 'effector'
import { sample }                   from 'effector'
import { createGate }               from 'effector-react'
import { io }                       from 'socket.io-client'

import { createPublisher }          from './publisher'
import { NoUriOrInstanceException } from './shared/exceptions'
import { createLogger }             from './shared/lib'
import { ConnectedInstance }        from './shared/types'
import { ConnectOptions }           from './shared/types'
import { ContextProps }             from './shared/types'
import { createSubscriber }         from './subscribe'

export const connect = <Methods extends Record<string, string>>(
  opts: ConnectOptions<Methods>
): ConnectedInstance<Methods> => {
  if (!opts.uri && !opts.instance) {
    throw new NoUriOrInstanceException()
  }

  const WebsocketGate = createGate<unknown>()

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

  const log = createLogger(opts.logger)

  const preparedProps: ContextProps<Methods> = {
    $instance,
    Gate: WebsocketGate,
    log,
    opts
  }

  return {
    $instance,
    Gate: WebsocketGate,
    event: createSubscriber(preparedProps, 'event'),
    publisher: createPublisher(preparedProps),
    restore: createSubscriber(preparedProps, 'restore'),
    subscribe: createSubscriber(preparedProps)
  }
}
