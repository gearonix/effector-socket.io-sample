import { Nullable }                  from '@grnx-utils/types'
import { createEvent }               from 'effector'
import { restore }                   from 'effector/compat'

import { BoxOptions }                from './interfaces'
import { PreparedProps }             from './interfaces'
import { MethodNotAllowedException } from './shared/exceptions'
import { transformWithPrefix }       from './shared/helpers'
import { validateZodSchema }         from './shared/helpers'
import { Wrap }                      from './shared/utils/types'

export const box = <Methods extends Record<string, string>>([
  $instance,
  { dataPrefix, methods }
]: PreparedProps<Methods>) => {
  return <Result, Default = null>(
    currentMethod: keyof Methods,
    options: BoxOptions<Default>
  ) => {
    const doneData = createEvent<Result | Nullable<Default>>()

    // eslint-disable-next-line effector/no-watch
    $instance.watch((instance) => {
      if (!instance) return

      const methodToSend: string = methods[currentMethod]

      if (!methodToSend) {
        throw new MethodNotAllowedException()
      }

      instance.off(methodToSend).on(methodToSend, (
        data: Wrap<Result> | Result
      ) => {
        const payload = transformWithPrefix<Result>(dataPrefix, data)

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
    })
    return restore<Result | Nullable<Default>>(
      doneData,
      options.default ?? null
    )
  }
}
