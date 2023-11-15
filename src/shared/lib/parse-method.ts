import { AnyObject }                 from '@grnx-utils/types'

import { MethodNotAllowedException } from '../exceptions'

export const parseMethodToSend = <Methods extends AnyObject>(
  methods: Methods,
  currentMethod: string
) => {
  if (currentMethod in methods) {
    return methods[currentMethod] as string
  }

  throw new MethodNotAllowedException()
}
