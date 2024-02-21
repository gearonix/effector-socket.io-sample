import { z } from 'zod'
import { validateZodSchema } from './validate-zod-schema'

describe('validate-zod-schema', () => {
  const successSchema = z.object({
    age: z.number(),
    name: z.string()
  })

  const successPayload = {
    age: 25,
    name: 'John Doe'
  }

  const failureSchema = z.object({
    email: z.string().email(),
    username: z.string()
  })

  const failurePayload = {
    email: 'invalid_email',
    username: 'john_doe'
  }

  const failureMethod = 'exampleMethod'

  it('should validate successfully and return the payload for a valid schema', () => {
    const result = validateZodSchema(
      successSchema,
      successPayload,
      'successMethod'
    )
    expect(result).toEqual(successPayload)
  })

  it('should log an error and return undefined for an invalid schema', () => {
    console.error = jest.fn()
    console.info = jest.fn()

    const result = validateZodSchema(
      failureSchema,
      failurePayload,
      failureMethod
    )

    expect(console.error).toHaveBeenCalled()
    expect(console.info).toHaveBeenCalled()

    expect(result).toBeUndefined()
  })
})
