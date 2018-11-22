'use strict'

const http = require('http')
const app = require('./app.js')

const port = process.env.PORT || 3211

const server = http.createServer(app)

server.listen(port, () => console.log(`Scraper Corriendo En El Puerto ${port}`))