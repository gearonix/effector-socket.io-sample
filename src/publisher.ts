import { attach }                from 'effector'
import { sample }                from 'effector'
import { createEvent }           from 'effector'

import { PreparedProps }         from './interfaces'
import { parseMethodToSend }     from './shared/helpers'
import { wrapPayloadWithPrefix } from './shared/helpers'

export const publisher = <Methods extends Record<string, string>>([
  $instance,
  { dataPrefix, methods }
]: PreparedProps<Methods>) => {
  return <P>(method: Extract<keyof Methods, string>) => {
    const sendData = createEvent<P>()

    const emitSocketFx = attach({
      effect: (socket, params: P) => {
        const dataToSend = wrapPayloadWithPrefix(dataPrefix, params)
        const parsedMethod = parseMethodToSend(methods, method)

        socket?.emit(parsedMethod, dataToSend)
      },
      source: $instance
    })

    sample({
      clock: sendData,
      target: emitSocketFx
    })

    return sendData
  }
}
