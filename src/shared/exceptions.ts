export class MethodNotAllowedException extends Error {
  name = 'MethodNotAllowedException'

  constructor() {
    super('This method is not specified in the allowed methods')
  }
}

export class ValidateSchemaUnknownException extends Error {
  name = 'JsconfigNotFoundException'

  constructor() {
    super('Unknown error when validating a response from the server')
  }
}
