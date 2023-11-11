import { Nullable }       from '@grnx-utils/types'
import { Undefinable }    from '@grnx-utils/types'
import { Store }          from 'effector'
import { Gate }           from 'effector-react'
import { ManagerOptions } from 'socket.io-client'
import { Socket }         from 'socket.io-client'
import { SocketOptions }  from 'socket.io-client'
import { z }              from 'zod'

export interface BoxOptions<Default> {
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
  Gate: Gate<unknown>
  $instance: Store<Nullable<Socket>>
  // TODO: refactor this
  box: <Result, Default = null>(
    method: keyof Methods,
    opts: BoxOptions<Default>
  ) => Store<Result | Nullable<Default>>
  emit: (...args: any[]) => unknown
}

export type PreparedProps<Methods extends Record<string, string>> = [
  Store<Nullable<Socket>>,
  CreateSocketProps<Methods>
]

export type Wrap<Target, Wrapper> = Wrapper extends string
  ? {
      [Key in Wrapper]: Target
    }
  : Target
