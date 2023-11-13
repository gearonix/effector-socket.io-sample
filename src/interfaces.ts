import { Nullable }       from '@grnx-utils/types'
import { Undefinable }    from '@grnx-utils/types'
import { Effect }         from 'effector'
import { Store }          from 'effector'
import { Gate }           from 'effector-react'
import { ManagerOptions } from 'socket.io-client'
import { Socket }         from 'socket.io-client'
import { SocketOptions }  from 'socket.io-client'
import { z }              from 'zod'

export interface BoxOptions<Default, Result> {
  default?: Default
  validate?: z.ZodSchema<Result>
}

export interface CreateSocketProps<Methods extends Record<string, string>> {
  uri?: string
  instance?: Socket
  methods: Methods
  options?: Undefinable<Partial<ManagerOptions & SocketOptions>>
  dataPrefix?: string
}

export type PreparedProps<Methods extends Record<string, string>> = [
  Store<Nullable<Socket>>,
  CreateSocketProps<Methods>
]
