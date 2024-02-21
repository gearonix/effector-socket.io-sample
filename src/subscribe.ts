import { Nullable } from '@grnx-utils/types'
import { createEvent, createStore, Event, sample, Store } from 'effector'
import { Gate } from 'effector-react'
import { Socket } from 'socket.io-client'
import { z } from 'zod'
import { publisherMapper } from './publisher'
import {
  parseMethodToSend,
  unwrapPayloadWithPrefix,
  validateZodSchema,
  Wrap
} from './shared/lib'
import { ContextProps } from './shared/types'

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

type SubscriberReturnMappers = 'restore' | 'event'

type SubscriberResult<T, R> = T extends 'restore'
  ? Store<R>
  : T extends 'event'
    ? Event<R>
    : [Event<R>, Store<R>]

export const subscriberMapper = <
  Methods extends Record<string, string>,
  Mapper extends SubscriberReturnMappers | void = void
>(
  { $instance, Gate, log, opts }: ContextProps<Methods>,
  resultMapper?: Mapper
) => {
  return <Result, Default = Result>(
    currentMethod: Extract<keyof Methods, string>,
    options?: SubscribeOptions<Default, Result, Methods>
  ): SubscriberResult<Mapper, Result> => {
    const doneData = createEvent<Result>()
    const $isMounted = options?.OverrideGate?.status ?? Gate.status

    const $result = createStore<Result | Nullable<Default>>(
      options?.default ?? null
    )

    const subscribe = (instance: Socket) => {
      const methodToSend = parseMethodToSend(opts.methods, currentMethod)

      if (options?.publish) {
        const { method, params } = options.publish

        // TODO: refactor this
        const mapper = publisherMapper({ $instance, Gate, log, opts })
        const publish = mapper<unknown>(method)

        publish(params)
      }

      instance
        .off(methodToSend)
        .on(methodToSend, (data: Wrap<Result> | Result) => {
          log('received response from server', currentMethod)
          const payload = unwrapPayloadWithPrefix<Result>(opts.prefix, data)

          if (!payload) {
            return log('empty response from the server', currentMethod, 'warn')
          }

          if (options?.schema) {
            const parsedSchema = validateZodSchema<Result>(
              options.schema,
              payload,
              currentMethod
            )

            return parsedSchema && doneData(parsedSchema)
          }

          doneData(payload)
        })
    }

    sample({
      clock: [$isMounted, $instance],
      filter: ({ instance, isMounted }) => Boolean(isMounted && instance),
      fn: ({ instance }) => subscribe(instance!),
      source: {
        instance: $instance,
        isMounted: $isMounted
      }
    })

    sample({
      clock: doneData,
      filter: $isMounted,
      target: $result
    })

    if (!resultMapper) {
      return [doneData, $result] as SubscriberResult<Mapper, Result>
    }

    const resultToReturn = resultMapper === 'restore' ? $result : doneData

    return resultToReturn as SubscriberResult<Mapper, Result>
  }
}
