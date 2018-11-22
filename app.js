const express = require('express')
const mongoose = require('mongoose')
const app = express()
const morgan = require('morgan')
const cron = require('node-cron')

require('dotenv').config()

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true
})

const polygon = require('./scrapers/polygon')
const pcgamer = require('./scrapers/pcgamer')
const kotaku = require('./scrapers/kotaku')
const gameinformer = require('./scrapers/gameinformer')
const ign = require('./scrapers/ign')
const pcgamesn = require('./scrapers/pcgamesn')
const playartifact = require('./scrapers/playartifact')
const artibuff = require('./scrapers/artibuff')
const rockpapershotgun = require('./scrapers/rockpapershotgun')
const drawTwo = require('./scrapers/drawtwo')

app.use(morgan('dev'))


cron.schedule('*/10 * * * *', function() {
  polygon()
  pcgamer()
  kotaku()
  gameinformer()
  ign()
  pcgamesn()
  playartifact()
  artibuff()
  rockpapershotgun()
  drawTwo()
})

module.exports = app