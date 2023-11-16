import { MethodNotAllowedException } from '../exceptions'
import { parseMethodToSend }         from './parse-method'

describe('parseMethodToSend', () => {
  const methods = {
    correctMethod: 'correct.method'
  }

  it('should return the corresponding method if it exists in the methods object', () => {
    const result = parseMethodToSend(methods, 'correctMethod')

    expect(result).toEqual('correct.method')
  })

  it('should throw exception if the method does not exist in the methods object', () => {
    expect(() => parseMethodToSend(methods, 'invalid.method')).toThrow(
      MethodNotAllowedException
    )
  })
})
