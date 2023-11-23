import { createEffect }             from 'effector'
import { restore }                  from 'effector'
import { sample }                   from 'effector'
import { createGate }               from 'effector-react'
import { io }                       from 'socket.io-client'

import { publisherMapper }          from './publisher'
import { NoUriOrInstanceException } from './shared/exceptions'
import { createLogger }             from './shared/lib'
import { ConnectedInstance }        from './shared/types'
import { ConnectOptions }           from './shared/types'
import { ContextProps }             from './shared/types'
import { subscriberMapper }         from './subscribe'

export const connect = <Methods extends Record<string, string>>(
  opts: ConnectOptions<Methods>
): ConnectedInstance<Methods> => {
  if (!opts.uri && !opts.instance) {
    throw new NoUriOrInstanceException()
  }

  const WebsocketGate = opts.Gate ?? createGate<unknown>()

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

  const contextProps: ContextProps<Methods> = {
    $instance,
    Gate: WebsocketGate,
    log,
    opts
  }

  return {
    $instance,
    Gate: WebsocketGate,
    event: subscriberMapper(contextProps, 'event'),
    publisher: publisherMapper(contextProps),
    restore: subscriberMapper(contextProps, 'restore'),
    subscribe: subscriberMapper(contextProps)
  }
}
