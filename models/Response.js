class Response {
  constructor(status, code, message, data, page) {
    this.code = code
    this.status = status
    this.message = message
    this.data = data
    this.page = page
  }
}

module.exports = Response
