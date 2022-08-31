const crypto = require('crypto')
const util = require('util')

const scrypt = util.promisify(crypto.scrypt)

class Password {
  static async toHash(password) {
    const salt = crypto.randomBytes(8).toString('hex')

    const buffer = await scrypt(password, salt, 64)

    return `${buffer.toString('hex')}.${salt}`
  }

  static async compare(storedPassword, suppliedPassword) {
    const [hashedPassword, salt] = storedPassword.split('.')

    const buffer = await scrypt(suppliedPassword, salt, 64)

    return buffer.toString('hex') === hashedPassword
  }
}

module.exports = Password
