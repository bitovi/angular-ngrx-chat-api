const build = require('./app')

const server = build()

server.listen({ port: process.env.PORT, host: '::' }, async (err, address) => {
  try {
    // await tempMigration()
    // await generateSocketDocs()

    if (err) throw err

    console.log(`Server listening at ${address}`)
  } catch (error) {
    console.error('Server Error =>', error)
    process.exit(1)
  }
})
