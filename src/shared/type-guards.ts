import { AnyObject }   from '@grnx-utils/types'
import { Undefinable } from '@grnx-utils/types'

import { Wrap }        from './types/lib'

export const isObject = (value: unknown): value is AnyObject => {
  return typeof value === 'object' && value !== null
}

export const isWrappedResponse = <Result>(
  data: Result | Wrap<Result>,
  prefix: Undefinable<string>
): data is Wrap<Result> => {
  return typeof prefix === 'string' && isObject(data) && prefix in data
}
