class Err extends Error {
  constructor(message, code, constraint) {
    super(message)
    this.message = message
    this.code = code
    this.constraint = constraint
  }
}

module.exports = Err
