const express = require('express')
const app = express()
const cors = require('cors')
const dronesRouter = require('./controllers/drones')

app.use(cors())
app.use('/', dronesRouter)

module.exports = app
