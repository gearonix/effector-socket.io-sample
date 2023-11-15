/* eslint-disable max-len */

import { createLogger } from './logger'
import { highlight }    from './logger'

describe('highlight function', () => {
  let mockConsoleLog: jest.SpyInstance

  beforeEach(() => {
    mockConsoleLog = jest.spyOn(console, 'log').mockImplementation(() => {})
  })

  test('returns styles with provided color', () => {
    const result = highlight('#ff0000')
    expect(result).toBe(
      'background-color: #ff0000; color: #000; padding-left: 4px; padding-right: 4px; font-weight: normal;'
    )
  })

  test('returns default styles without color', () => {
    const result = highlight()

    expect(result).toBe(
      'background-color: none; color: #000; padding-left: 4px; padding-right: 4px; font-weight: normal;'
    )
  })

  test('logs messages when isEnabled is true', () => {
    const logger = createLogger(true)

    logger('hello', 'event')

    expect(mockConsoleLog).toHaveBeenCalledWith(
      '%ceffector-socket.io%chello%c[event]',
      'background-color: #4fb6ed; color: #000; padding-left: 4px; padding-right: 4px; font-weight: normal;',
      'background-color: none; color: #000; padding-left: 4px; padding-right: 4px; font-weight: normal;',
      'color: #4fedde;'
    )

    mockConsoleLog.mockRestore()
  })

  test('does not log messages when isEnabled is false', () => {
    const logger = createLogger(false)
    logger('Hello', 'Event', 'log')

    expect(mockConsoleLog).not.toHaveBeenCalled()

    mockConsoleLog.mockRestore()
  })
})
