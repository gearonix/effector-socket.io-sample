import { Nullable }                from '@grnx-utils/types'
import { Undefinable }             from '@grnx-utils/types'
import { createEvent }             from 'effector'
import { createStore }             from 'effector'
import { Event }                   from 'effector'
import { sample }                  from 'effector'
import { Store }                   from 'effector'
import { Gate }                    from 'effector-react'
import { Socket }                  from 'socket.io-client'
import { z }                       from 'zod'

import { parseMethodToSend }       from './shared/lib'
import { unwrapPayloadWithPrefix } from './shared/lib'
import { validateZodSchema }       from './shared/lib'
import { Wrap }                    from './shared/lib'
import { ContextProps }            from './shared/types'

export interface SubscribeOptions<Default, Result> {
  default?: Default
  schema?: z.ZodSchema<Result>
  OverrideGate?: Gate<unknown>
}

type SubscriberReturnMappers = 'restore' | 'event'

type SubscribeValue<R, D> = R | Nullable<D>

type SubscriberResult<T, R, D> = T extends 'restore'
  ? Store<SubscribeValue<R, D>>
  : T extends 'event'
  ? Event<SubscribeValue<R, D>>
  : [Event<SubscribeValue<R, D>>, Store<SubscribeValue<R, D>>]

export const subscriberMapper = <
  Methods extends Record<string, string>,
  R extends SubscriberReturnMappers | void = void
>(
  { $instance, Gate, log, opts }: ContextProps<Methods>,
  resultMapper?: R
) => {
  return <Result, Default = Result>(
    currentMethod: Extract<keyof Methods, string>,
    options?: SubscribeOptions<Default, Result>
  ): SubscriberResult<R, Result, Default> => {
    const doneData = createEvent<Result | Nullable<Default>>()

    const $result = createStore<Result | Nullable<Default>>(
      options?.default ?? null
    )

    const subscribe = (instance: Socket) => {
      const methodToSend = parseMethodToSend(opts.methods, currentMethod)

      instance.off(methodToSend).on(methodToSend, (
        data: Wrap<Result> | Result
      ) => {
        log('received response from server', currentMethod)
        const payload = unwrapPayloadWithPrefix<Result>(opts.prefix, data)

        if (!payload) {
          log('empty response from the server', currentMethod, 'warn')
          return
        }

        if (options?.schema) {
          const transformed = validateZodSchema<Result>(
            options.schema,
            payload,
            currentMethod
          )

          return transformed && doneData(transformed)
        }

        doneData(payload)
      })
    }

    sample({
      clock: $instance,
      filter: (ins) => Boolean(ins),
      fn: (instance) => subscribe(instance!),
      source: $instance
    })

    sample({
      clock: doneData,
      filter: options?.OverrideGate?.status ?? Gate.status,
      target: $result
    })

    if (!resultMapper) {
      return [doneData, $result] as SubscriberResult<R, Result, Default>
    }

    const resultToReturn = resultMapper === 'restore' ? $result : doneData

    return resultToReturn as SubscriberResult<R, Result, Default>
  }
}
