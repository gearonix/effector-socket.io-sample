import { AnyObject }               from '@grnx-utils/types'
import { Nullable }                from '@grnx-utils/types'
import { Undefinable }             from '@grnx-utils/types'
import { createStore }             from 'effector'
import { createEffect }            from 'effector'
import { createEvent }             from 'effector'
import { restore }                 from 'effector'
import { sample }                  from 'effector'
import { Store }                   from 'effector'
import { createGate }              from 'effector-react'
import { Gate }                    from 'effector-react'
import { io }                      from 'socket.io-client'
import { ManagerOptions }          from 'socket.io-client'
import { Socket }                  from 'socket.io-client'
import { SocketOptions }           from 'socket.io-client'
import { z }                       from 'zod'

import { createSocket as PREVIEW } from './create-socket'

export { PREVIEW }

export type Wrap<Target, Wrapper> = Wrapper extends string
  ? {
      [Key in Wrapper]: Target
    }
  : Target

interface RestoreMethodOptions<Default> {
  // TODO: refactor this
  default?: Default
  validate?: z.ZodSchema
}

export interface CreateSocketProps<Methods extends Record<string, string>> {
  uri?: string
  instance?: Socket
  methods: Methods
  options?: Undefinable<Partial<ManagerOptions & SocketOptions>>
  dataPrefix?: string
}

export interface WebsocketInstance<Methods> {
  gate: Gate<unknown>
  $instance: Store<Nullable<Socket>>
  // TODO: refactor this
  restore: (
    method: keyof Methods,
    opts: RestoreMethodOptions<unknown>
  ) => Store<unknown>
  emit: (...args: any[]) => unknown
}

export const createSocket = <Methods extends Record<string, string>>({
  dataPrefix,
  instance,
  methods,
  options,
  uri
}: CreateSocketProps<Methods>): WebsocketInstance<Methods> => {
  if (!uri && !instance) {
    throw new Error('error')
  }

  const WebsocketGate = createGate()

  const getSocketInstanceFx = createEffect(() => instance ?? io(uri!, options))

  const $instance = restore(getSocketInstanceFx, null).on(
    WebsocketGate.close,
    (ins) => ins?.disconnect() ?? null
  )

  sample({
    clock: WebsocketGate.open,
    target: getSocketInstanceFx
  })

  const restoreMethod = <Result extends AnyObject, Default = null>(
    currentMethod: keyof Methods,
    options: RestoreMethodOptions<Default>
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

  const emitMethod = (currentMethod: keyof Methods) => {
    const methodToSend: string = methods[currentMethod]

    return createEffect(async (data) => {
      $instance.watch((instance) => {
        if (!instance) return

        const dataToSend = dataPrefix ? { [dataPrefix]: data } : data

        instance.emit(methodToSend, dataToSend)
      })
    })
  }

  return {
    $instance,
    emit: emitMethod,
    gate: WebsocketGate,
    restore: restoreMethod
  }
}

export const scope = (parent: WebsocketInstance) => {
  const ChildGate = createGate()

  const enabledEvents: string[] = []

  ChildGate.close.watch(() => {
    enabledEvents.forEach((event) => {
      parent.$instance.off(event)
    })
  })

  const restoreMethod = (...args: any[]) => {
    const doneData = createEvent()

    ChildGate.status.watch((isMounted) => {
      if (!isMounted) return createStore(null)

      enabledEvents.push(args[0]) // <<< this is method

      doneData(parent.restore(...args))
    })

    return restore(doneData, null)
  }

  return {
    $instance: parent.$instance,
    emit: parent.emit,
    gate: ChildGate,
    restore: restoreMethod
  }
}

export const atom = <T>(factory: () => T) => factory()
