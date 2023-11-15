/* eslint-disable effector/no-getState */

import { connect }                  from './connect'
import { NoUriOrInstanceException } from './shared/exceptions'
import { ConnectOptions }           from './shared/types'

jest.mock('socket.io-client', () => ({
  io: jest.fn(() => ({
    disconnect: jest.fn(),
    mockValue: 'mocked-io-callback'
  }))
}))

type ConnectValueOptions = ConnectOptions<Record<string, string>>

describe('connect', () => {
  let connectOptions: ConnectValueOptions

  beforeEach(() => {
    connectOptions = {
      methods: {},
      options: {},
      uri: 'ws://localhost:6868'
    } as ConnectValueOptions
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('throws NoUriOrInstanceException if neither uri nor instance is provided', () => {
    expect(() => connect({} as ConnectValueOptions)).toThrow(
      NoUriOrInstanceException
    )
  })

  it('should create a connected instance with the correct properties', () => {
    const connectedInstance = connect(connectOptions)

    expect(connectedInstance).toHaveProperty('$instance')

    expect(typeof connectedInstance.Gate).toBe('function')

    expect(typeof connectedInstance.subscribe).toBe('function')
    expect(typeof connectedInstance.publisher).toBe('function')
  })

  it('should not work when effector gate is closed', () => {
    const socket = connect(connectOptions)

    expect(socket.$instance.getState()).toBeNull()
    expect(socket.Gate.status.getState()).toBeFalsy()
  })

  it('should work when effector gate is opened and instance provided', async () => {
    const instance = jest.fn()

    const validOpts = {
      ...connectOptions,
      instance
    } as unknown as ConnectValueOptions

    const socket = connect(validOpts)

    socket.Gate.open()

    expect(socket.$instance.getState()).toBe(instance)
    expect(socket.Gate.status.getState()).toBeTruthy()
  })

  it('should work when effector gate is opened and instance not provided', async () => {
    const socket = connect()

    socket.Gate.open()

    expect(socket.$instance.getState()).toHaveProperty('mockValue')
    expect(socket.Gate.status.getState()).toBeTruthy()

    socket.Gate.close()

    expect(socket.$instance.getState()).toBeNull()
  })
})
