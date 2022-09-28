const widdershins = require('widdershins')
const path = require('path')
const fs = require('fs')
const util = require('util')

const readFile = util.promisify(fs.readFile)
const writeFile = util.promisify(fs.writeFile)

const generateSocketDocs = async () => {
  const options = {
    language_tabs: [{ 'javascript--node': 'Node.JS' }],
  }

  const fileData = await readFile(
    path.resolve(__dirname, '../docs/ws.json'),
    'utf8'
  )
  const asyncApiFile = JSON.parse(fileData)

  const markdownOutput = await widdershins.convert(asyncApiFile, options)

  await writeFile(
    path.resolve(__dirname, '../docs/ws.md'),
    markdownOutput,
    'utf8'
  )

  console.log('Docs generated.')
}

module.exports = generateSocketDocs
