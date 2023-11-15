import { Nullable }                from '@grnx-utils/types'
import { createEvent }             from 'effector'
import { createStore }             from 'effector'
import { sample }                  from 'effector'
import { Gate }                    from 'effector-react'
import { condition }               from 'patronum'
import { or }                      from 'patronum'
import { Socket }                  from 'socket.io-client'
import { z }                       from 'zod'

import { PreparedProps }           from './interfaces'
import { parseMethodToSend }       from './shared/helpers'
import { unwrapPayloadWithPrefix } from './shared/helpers'
import { validateZodSchema }       from './shared/helpers'
import { Wrap }                    from './shared/utils/types'

export interface BoxOptions<Default, Result> {
  default?: Default
  validate?: z.ZodSchema<Result>
  override?: {
    Gate: Gate<unknown>
  }
}

export const createBox = <Methods extends Record<string, string>>({
  $instance,
  Gate,
  logger,
  opts
}: PreparedProps<Methods>) => {
  return <Result, Default = null>(
    currentMethod: Extract<keyof Methods, string>,
    options: BoxOptions<Default, Result>
  ) => {
    const doneData = createEvent<Result | Nullable<Default>>()

    const $result = createStore<Result | Nullable<Default>>(
      options.default ?? null
    )

    const subscribe = (instance: Socket) => {
      const methodToSend = parseMethodToSend(opts.methods, currentMethod)

      instance.off(methodToSend).on(methodToSend, (
        data: Wrap<Result> | Result
      ) => {
        logger(`received response from server (${methodToSend})`)
        const payload = unwrapPayloadWithPrefix<Result>(opts.dataPrefix, data)

        if (!payload) {
          console.warn('Empty response from the server.')
          return
        }

        if (options.validate) {
          const transformed = validateZodSchema<Result>(
            options.validate,
            payload
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
      filter: options.override?.Gate.status ?? Gate.status,
      target: $result
    })

    return [doneData, $result]
  }
}
