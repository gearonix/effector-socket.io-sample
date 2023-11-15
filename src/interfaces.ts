import { Nullable }       from '@grnx-utils/types'
import { Undefinable }    from '@grnx-utils/types'
import { Store }          from 'effector'
import { Gate }           from 'effector-react'
import { ManagerOptions } from 'socket.io-client'
import { Socket }         from 'socket.io-client'
import { SocketOptions }  from 'socket.io-client'
import { z }              from 'zod'

import { createBox }      from './box'
import { createLogger }   from './shared/helpers'

export interface CreateSocketOptions<Methods extends Record<string, string>> {
  uri?: string
  instance?: Socket
  methods: Methods
  options?: Undefinable<Partial<ManagerOptions & SocketOptions>>
  dataPrefix?: string
  logger?: boolean
}

export interface PreparedProps<Methods extends Record<string, string>> {
  $instance: Store<Nullable<Socket>>
  opts: CreateSocketOptions<Methods>
  logger: ReturnType<typeof createLogger>
  Gate: Gate<Socket>
}

export type Box<Methods extends Record<string, string>> = ReturnType<
  typeof createBox<Methods>
>
