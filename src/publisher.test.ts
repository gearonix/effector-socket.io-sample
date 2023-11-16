import { Nullable }        from '@grnx-utils/types'
import { attach }          from 'effector'
import { createStore }     from 'effector'
import { sample }          from 'effector'
import { Store }           from 'effector'
import { createGate }      from 'effector-react'
import { Gate }            from 'effector-react'
import { Socket }          from 'socket.io-client'

import { publisherMapper } from './publisher'
import { ConnectOptions }  from './shared/types'

jest.mock('effector', () => ({
  ...jest.requireActual('effector'),
  attach: jest.fn(),
  sample: jest.fn()
}))

describe('publisher', () => {
  let MockGate: Gate<unknown>
  let $instance: Store<Nullable<Socket>>
  let log: jest.Mock
  let opts: ConnectOptions<Record<string, string>>
  let publisher: ReturnType<typeof publisherMapper>

  beforeEach(() => {
    MockGate = createGate()
    $instance = createStore({} as Nullable<Socket>)
    log = jest.fn()
    opts = {
      methods: {
        someMethod: 'some.method'
      }
    }
    publisher = publisherMapper({ $instance, Gate: MockGate, log, opts })
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should create a publisher function', () => {
    const sendData = publisher('someMethod')

    expect(sendData).toBeDefined()
    expect(typeof sendData).toBe('function')
  })

  it('should be called with right parameters', () => {
    const mockParams = { some: 'data' }

    const sendData = publisher<typeof mockParams>('someMethod')

    sendData(mockParams)

    expect(attach).toHaveBeenCalledTimes(1)

    expect(sample).toHaveBeenCalledTimes(2)

    const mockSocket = { emit: jest.fn() }

    const expectedCall = (attach as jest.Mock).mock.calls[0][0]

    expect(expectedCall).toEqual({
      effect: expect.any(Function),
      source: $instance
    })

    expectedCall.effect(mockSocket, mockParams)

    expect(mockSocket.emit).toHaveBeenCalledWith('some.method', {
      some: 'data'
    })

    expect(log).toHaveBeenCalledWith(
      'sent a request to the server',
      'someMethod'
    )
  })
})
