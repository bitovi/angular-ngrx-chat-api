const errorHandler = function (error, _, reply) {
  console.log(error)

  reply.status(error.status || 500).send({
    error,
  })
}

module.exports = errorHandler
