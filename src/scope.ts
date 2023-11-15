import { createEvent }       from 'effector'
import { createStore }       from 'effector'
import { sample }            from 'effector'
import { createGate }        from 'effector-react'
import { Socket }            from 'socket.io-client'

import { BoxOptions }        from './box'
import { Box }               from './shared/interfaces'
import { Publisher }         from './shared/interfaces'
import { ConnectedInstance } from './shared/interfaces'
import { ConnectedScope }    from './shared/interfaces'

export const scope = <Methods extends Record<string, string>>(
  parent: ConnectedInstance<Methods>
): ConnectedScope<Methods> => {
  const ChildGate = createGate<Socket>()

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

  const box = <Result, Default = null>(...args: Parameters<Box<Methods>>) => {
    const [method, options = {}] = args

    addEnabledEvent(method)

    return parent.box<Result, Default>(method, {
      ...(options as BoxOptions<Default, Result>),
      override: {
        Gate: ChildGate
      }
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
    box,
    publisher
  }
}
