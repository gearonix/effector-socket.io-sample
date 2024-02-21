import { Nullable, Undefinable } from '@grnx-utils/types'
import { Store } from 'effector'
import { Gate } from 'effector-react'
import { ManagerOptions, Socket, SocketOptions } from 'socket.io-client'
import { createLogger } from '../lib'
import { Event, Publisher, Restore, Subscriber } from './methods'

export interface ConnectOptions<Methods extends Record<string, string>> {
  uri?: string
  instance?: Socket
  methods: Methods
  options?: Undefinable<Partial<ManagerOptions & SocketOptions>>
  prefix?: string
  logger?: boolean
  Gate?: Gate<unknown>
}

export interface ContextProps<Methods extends Record<string, string>> {
  $instance: Store<Nullable<Socket>>
  opts: ConnectOptions<Methods>
  log: ReturnType<typeof createLogger>
  Gate: Gate<unknown>
}

export interface ConnectedInstance<Methods extends Record<string, string>> {
  $instance: Store<Nullable<Socket>>
  Gate: Gate<unknown>
  subscribe: Subscriber<Methods>
  publisher: Publisher<Methods>
  restore: Restore<Methods>
  event: Event<Methods>
}

export type ConnectedInstanceKeys = keyof ConnectedInstance<
  Record<string, string>
>

export type ConnectedScope<Methods extends Record<string, string>> =
  ConnectedInstance<Methods>
