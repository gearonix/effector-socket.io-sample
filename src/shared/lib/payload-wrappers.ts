import { Undefinable }       from '@grnx-utils/types'

import { isWrappedResponse } from '../type-guards'
import { Wrap }              from '../types/lib'

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
