import { sample }                from 'effector'
import { createGate }            from 'effector-react'

import { createArrayStore }      from './shared/lib/effector'
import { ConnectedInstance }     from './shared/types'
import { ConnectedInstanceKeys } from './shared/types'
import { ConnectedScope }        from './shared/types'
import { Event }                 from './shared/types'
import { Publisher }             from './shared/types'
import { Restore }               from './shared/types'
import { Subscriber }            from './shared/types'
import { SubscribeOptions }      from './subscribe'

export const scope = <Methods extends Record<string, string>>(
  parent: ConnectedInstance<Methods>
): ConnectedScope<Methods> => {
  const ChildGate = createGate<unknown>()

  const subscribedEvents = createArrayStore<string>()

  sample({
    clock: ChildGate.close,
    fn: ({ events, instance }) => {
      events.forEach((method) => {
        instance?.off(method)
      })
    },
    source: {
      events: subscribedEvents.$items,
      instance: parent.$instance
    },
    target: subscribedEvents.reset
  })

  const subscribeMapper = (
      mapperMethod: Extract<
        ConnectedInstanceKeys,
        'restore' | 'event' | 'subscribe'
      >
    ) =>
    <Result, Default = null>(...args: Parameters<Subscriber<Methods>>) => {
      const [method, options = {}] = args

      subscribedEvents.add(method)

      return parent[mapperMethod]<Result, Default>(method, {
        ...(options as SubscribeOptions<Default, Result, Methods>),
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
