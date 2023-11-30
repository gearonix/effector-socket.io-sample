import { ContextProps }            from '@core'

import { SubscribeMapper }         from './interfaces'
import { SubscriberReturnMappers } from './interfaces'
import { subscribe }               from './subscribe'

export const applySubscriber = <
  Mapper extends SubscriberReturnMappers | void = void
>(
  mapper?: Mapper
) => {
  return <Methods extends Record<string, string>>(
    contextProps: ContextProps<Methods>
  ) => {
    subscribe(contextProps, mapper)
  }
}

export const subscribeMapper: SubscribeMapper = {
  default: applySubscriber(),
  event: applySubscriber('event'),
  restore: applySubscriber('restore')
}
