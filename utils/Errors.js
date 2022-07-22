const {messages} = require('../common')

class GeneralError extends Error {
  constructor(message, code) {
    super()
    this.message = message
    this.code = code || 500
  }
}

class BadRequest extends GeneralError {
  constructor(message) {
    super(message, 400)
  }
}
class NotFound extends GeneralError {
  constructor(message) {
    super(message, 404)
  }
}
class Unauthorized extends GeneralError {
  constructor() {
    super(messages.auth.unauthorized, 401)
  }
}
class InvalidToken extends GeneralError {
  constructor() {
    super(messages.auth.token_invalid, 400)
  }
}
class Forbidden extends GeneralError {
  constructor() {
    super(messages.auth.forbidden, 403)
  }
}

module.exports = {
  GeneralError,
  BadRequest,
  NotFound,
  Unauthorized,
  InvalidToken,
  Forbidden
}
