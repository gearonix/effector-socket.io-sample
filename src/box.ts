import { AnyObject }     from '@grnx-utils/types'
import { createEvent }   from 'effector'
import { restore }       from 'effector/compat'
import { z }             from 'zod'

import { PreparedProps } from './interfaces'
import { BoxOptions }    from './interfaces'
import { Wrap }          from './interfaces'

export const box = <Methods extends Record<string, string>>([
  $instance,
  { dataPrefix, methods }
]: PreparedProps<Methods>) => {
  return <Result extends AnyObject, Default = null>(
    currentMethod: keyof Methods,
    options: BoxOptions<Default>
  ) => {
    const doneData = createEvent<
      Default | Result | z.infer<NonNullable<typeof options.validate>>
    >()

    // eslint-disable-next-line effector/no-watch
    $instance.watch((instance) => {
      const methodToSend: string = methods[currentMethod]

      if (!instance) return

      if (!methodToSend) {
        // TODO: refactor this
        throw new Error('error')
      }

      instance.off(methodToSend)

      instance.on(methodToSend, (data: Wrap<Result, typeof dataPrefix>) => {
        const payload = dataPrefix ? data[dataPrefix] : data

        if (!payload) {
          throw new Error('error')
        }

        if (options.validate) {
          try {
            const zodSchema = options.validate

            const transformedValues = zodSchema.parse(payload) as z.infer<
              typeof zodSchema
            >

            doneData(transformedValues)
          } catch (error) {
            const isZodError = error instanceof z.ZodError

            if (!isZodError) {
              // TODO: refactor this
              throw new Error(error as string)
            }

            return console.error('zod error')
          }
        }

        doneData(payload as Result)
      })
    })
    return restore<
      Default | Result | z.infer<NonNullable<typeof options.validate>>
    >(doneData, options.default ?? null)
  }
}
