const jwt = require('jsonwebtoken')

const signToken = (text) =>
  jwt.sign({ text }, process.env.JWT_SECRET, {
    expiresIn: 3600,
  })

module.exports = { signToken }
