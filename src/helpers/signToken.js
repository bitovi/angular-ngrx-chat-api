const jwt = require('jsonwebtoken')

const signToken = (text) =>
  jwt.sign({ text }, process.env.JWT_SECRET, {
    expiresIn: 3600000000000000000,
  })

module.exports = { signToken }
