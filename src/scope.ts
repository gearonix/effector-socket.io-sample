import { createEvent }  from 'effector'
import { createStore }  from 'effector'
import { sample }       from 'effector'
import { createGate }   from 'effector-react'

import { createSocket } from './create-socket'
import { Box }          from './interfaces'

export const scope = <Methods extends Record<string, string>>(
  parent: ReturnType<typeof createSocket<Methods>>
) => {
  const ChildGate = createGate()

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

  const box = ([method, options]: Parameters<Box<Methods>>) => {
    addEnabledEvent(method)

    return parent.box(method, {
      ...options,
      override: {
        Gate: ChildGate
      }
    })
  }

  return {
    ...parent,
    box,
    gate: ChildGate
  }
}
