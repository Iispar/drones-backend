const app = require('./app') // varsinainen Express-sovellus
const http = require('http')
const logger = require('./utils/logger')
const config = require('./utils/config')

/**
 * creates a server and runs the application in app.js
 */
const server = http.createServer(app)

const PORT = config.PORT
server.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`)
})
