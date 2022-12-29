const app = require('./app') // varsinainen Express-sovellus
const http = require('http')
const logger = require('./utils/logger')

/**
 * creates a server and runs the application in app.js
 */
const server = http.createServer(app)

const PORT = process.env.PORT || 8080
server.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`)
})
