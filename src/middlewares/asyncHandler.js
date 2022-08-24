const asyncHandler = (fn) => (request, reply, next) =>
  Promise.resolve(fn(request, reply, next)).catch(next)

module.exports = asyncHandler
