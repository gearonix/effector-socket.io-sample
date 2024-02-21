import { createEvent, createStore, sample } from 'effector'
import { createGate } from 'effector-react'
import { scope } from './scope'
import { ConnectedInstance } from './shared/types'

const actualEffector = jest.requireActual('effector')
const actualEffectorReact = jest.requireActual('effector-react')

jest.mock('effector', () => ({
  createEvent: jest.fn(() => actualEffector.createEvent()),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  createStore: jest.fn((...args: any[]) => actualEffector.createStore(args)),
  sample: jest.fn()
}))

jest.mock('effector-react', () => ({
  createGate: jest.fn(() => actualEffectorReact.createGate())
}))

describe('scope', () => {
  let parent: ConnectedInstance<Record<string, string>>

  beforeEach(() => {
    parent = {
      $instance: {},
      Gate: jest.fn(),
      publisher: jest.fn(),
      subscribe: jest.fn()
    } as unknown as ConnectedInstance<Record<string, string>>
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should call createGate, createStore, createEvent inside of function', () => {
    scope(parent)

    expect(createGate).toHaveBeenCalled()
    expect(createStore).toHaveBeenCalled()
    expect(createEvent).toHaveBeenCalled()
  })

  it('should create a subscription with the ChildGate', () => {
    const { subscribe } = scope(parent)

    const mockSubscribe = parent.subscribe as jest.MockedFunction<
      typeof parent.subscribe
    >

    subscribe('method')

    expect(mockSubscribe).toHaveBeenCalledWith('method', {
      OverrideGate: expect.anything()
    })
  })

  it('should create a publisher with the ChildGate', () => {
    const { publisher } = scope(parent)

    const mockPublisher = parent.publisher as jest.MockedFunction<
      typeof parent.publisher
    >

    publisher('method')

    expect(mockPublisher).toHaveBeenCalledWith('method', {
      OverrideGate: expect.anything()
    })
  })

  it('should unsubscribe when ChildGate is closed', () => {
    const { Gate } = scope(parent)

    Gate.close()

    expect(sample).toHaveBeenCalledWith({
      clock: Gate.close,
      fn: expect.any(Function),
      source: {
        events: expect.any(Object),
        instance: expect.any(Object)
      },
      target: expect.any(Function)
    })
  })
})
