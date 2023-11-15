import { createEvent }       from 'effector'
import { createStore }       from 'effector'
import { sample }            from 'effector'
import { createGate }        from 'effector-react'

import { Publisher }         from './shared/types'
import { Subscriber }        from './shared/types'
import { ConnectedInstance } from './shared/types'
import { ConnectedScope }    from './shared/types'
import { SubscribeOptions }  from './subscribe'

export const scope = <Methods extends Record<string, string>>(
  parent: ConnectedInstance<Methods>
): ConnectedScope<Methods> => {
  const ChildGate = createGate<unknown>()

  const addEnabledEvent = createEvent<string>()
  const clearEnabledEvents = createEvent<void>()

  const $enabledEvents = createStore<string[]>([])
    .on(addEnabledEvent, (events, method) => [...events, method])
    .reset(clearEnabledEvents)

  sample({
    clock: ChildGate.close,
    fn: ({ events, instance }) => {
      events.forEach((method) => {
        instance?.off(method)
      })
    },
    source: {
      events: $enabledEvents,
      instance: parent.$instance
    },
    target: clearEnabledEvents
  })

  const subscribe = <Result, Default = null>(
    ...args: Parameters<Subscriber<Methods>>
  ) => {
    const [method, options = {}] = args

    addEnabledEvent(method)

    return parent.subscribe<Result, Default>(method, {
      ...(options as SubscribeOptions<Default, Result>),
      OverrideGate: ChildGate
    })
  }

  const publisher = <P = void>(
    ...[method, options = {}]: Parameters<Publisher<Methods>>
  ) => {
    return parent.publisher<P>(method, {
      ...options,
      OverrideGate: ChildGate
    })
  }

  return {
    ...parent,
    Gate: ChildGate,
    publisher,
    subscribe
  }
}
