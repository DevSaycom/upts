const Article = require('../models/article.model')
const mongoose = require('mongoose')
const Xray = require('x-ray')
const x = Xray({
  filters: {
    trim: function (value) {
      return typeof value === 'string' ? value.trim() : value
    }
  }
}).throttle(1, '7s').delay('7s', '20s')


const url = 'https://artifaction.gg/news'

const artifaction = () => {
  x(url, 'div.sc-kUaPvJ.fLBShM', [{
    link: 'a.sc-giadOv.cwdIws@href'
  }])
  .then(links => {
    console.log(links)
  })
}