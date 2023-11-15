import { Undefinable }                    from '@grnx-utils/types'
import { z }                              from 'zod'
import { ZodSchema }                      from 'zod'

import { ValidateSchemaUnknownException } from '../exceptions'

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
