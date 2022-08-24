const { statusCodes } = require('./constants')

class Source {
  constructor(pointer, parameter) {
    this.pointer = pointer && '/' + pointer
    this.parameter = parameter
  }
}

class ErrorResponse extends Error {
  constructor({ title, status, code, detail, pointer, parameter }) {
    super()
    this.status = status || statusCodes.INTERNAL_SERVER_ERROR
    this.code = code
    this.detail = detail
    this.source = new Source(pointer, parameter)
    this.title = title || 'Server Error ocurred'
  }
}

module.exports = ErrorResponse
