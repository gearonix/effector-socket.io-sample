import { AnyObject }                      from '@grnx-utils/types'
import { Undefinable }                    from '@grnx-utils/types'
import { z }                              from 'zod'
import { ZodSchema }                      from 'zod'

import { MethodNotAllowedException }      from './exceptions'
import { ValidateSchemaUnknownException } from './exceptions'
import { isWrappedResponse }              from './type-guards'
import { Wrap }                           from './utils/types'

export const validateZodSchema = <Result>(
  zodSchema: ZodSchema<Result>,
  payload: Result
): Undefinable<z.infer<ZodSchema<Result>>> => {
  try {
    return zodSchema.parse(payload)
  } catch (error) {
    const isZodError = error instanceof z.ZodError

    if (!isZodError) {
      throw new ValidateSchemaUnknownException()
    }

    console.error('Incorrect response from the server. [Zod]')
    console.info('\n')
    console.info(error.format())
  }
}

export const unwrapPayloadWithPrefix = <Result>(
  prefix: Undefinable<string>,
  data: Result | Wrap<Result>
): Undefinable<Result> => {
  if (isWrappedResponse(data, prefix)) {
    return data[prefix!]
  }

  return data
}

export const wrapPayloadWithPrefix = <Result>(
  prefix: Undefinable<string>,
  data: Result
): Result | Wrap<Result> => {
  return prefix ? { [prefix]: data } : data
}

export const parseMethodToSend = <Methods extends AnyObject>(
  methods: Methods,
  currentMethod: string
) => {
  if (currentMethod in methods) {
    return methods[currentMethod] as string
  }

  throw new MethodNotAllowedException()
}

export const createLogger = (isEnabled?: boolean) => {
  return (msg: string) => {
    if (isEnabled) {
      console.log(`[effector-socket.io]: ${msg}`)
    }
  }
}
