import { createEvent }           from 'effector'
import { createStore }           from 'effector'
import { sample }                from 'effector'
import { createGate }            from 'effector-react'

import { ConnectedInstanceKeys } from './shared/types'
import { Event }                 from './shared/types'
import { Restore }               from './shared/types'
import { Publisher }             from './shared/types'
import { Subscriber }            from './shared/types'
import { ConnectedInstance }     from './shared/types'
import { ConnectedScope }        from './shared/types'
import { SubscribeOptions }      from './subscribe'

export const scope = <Methods extends Record<string, string>>(
  parent: ConnectedInstance<Methods>
): ConnectedScope<Methods> => {
  const ChildGate = createGate<unknown>()

  const addSubscribedEvent = createEvent<string>()
  const clearSubscriberEvents = createEvent<void>()

  const $subscribedEvents = createStore<string[]>([])
    .on(addSubscribedEvent, (events, method) => [...events, method])
    .reset(clearSubscriberEvents)

  sample({
    clock: ChildGate.close,
    fn: ({ events, instance }) => {
      events.forEach((method) => {
        instance?.off(method)
      })
    },
    source: {
      events: $subscribedEvents,
      instance: parent.$instance
    },
    target: clearSubscriberEvents
  })

  const subscribeMapper = (
      mapperMethod: Extract<
        ConnectedInstanceKeys,
        'restore' | 'event' | 'subscribe'
      >
    ) =>
    <Result, Default = null>(...args: Parameters<Subscriber<Methods>>) => {
      const [method, options = {}] = args

      addSubscribedEvent(method)

      return parent[mapperMethod]<Result, Default>(method, {
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
    event: subscribeMapper('event') as Event<Methods>,
    publisher,
    restore: subscribeMapper('restore') as Restore<Methods>,
    subscribe: subscribeMapper('subscribe') as Subscriber<Methods>
  }
}
