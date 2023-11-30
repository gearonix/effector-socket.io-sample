import { ContextProps } from '@core'
import { Event }        from 'effector'
import { Store }        from 'effector'
import { Gate }         from 'effector-react'
import { z }            from 'zod'

export interface SubscribeOptions<
  Default,
  Result,
  Methods = Record<string, string>
> {
  default?: Default
  schema?: z.ZodSchema<Result>
  publish?: {
    method: Extract<keyof Methods, string>
    params?: unknown
  }
  OverrideGate?: Gate<unknown>
}

export type SubscriberReturnMappers = 'restore' | 'event'

export type SubscriberResult<T, R> = T extends 'restore'
  ? Store<R>
  : T extends 'event'
  ? Event<R>
  : [Event<R>, Store<R>]

export type SubscribeMapper = {
  [K in SubscriberReturnMappers | 'default']: (
    mapper: ContextProps<any>
  ) => unknown
}
