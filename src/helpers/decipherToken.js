const jwt = require('jsonwebtoken')

const decipherToken = (token) => {
  // Make sure token exists
  if (token && token.startsWith('Bearer')) {
    token = token.split(' ')[1]
  } else {
    throw new Error('Unauthorized access.')
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET)

  return [decoded.text, token]
}

module.exports = { decipherToken }
