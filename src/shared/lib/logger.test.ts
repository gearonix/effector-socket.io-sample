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
    expect(result).toMatchSnapshot()
  })

  test('returns default styles without color', () => {
    const result = highlight()

    expect(result).toMatchSnapshot()
  })

  test('logs messages when isEnabled is true', () => {
    const logger = createLogger(true)

    logger('hello', 'event')

    expect(mockConsoleLog).toMatchSnapshot()

    mockConsoleLog.mockRestore()
  })

  test('does not log messages when isEnabled is false', () => {
    const logger = createLogger(false)
    logger('Hello', 'Event', 'log')

    expect(mockConsoleLog).not.toHaveBeenCalled()

    mockConsoleLog.mockRestore()
  })
})
