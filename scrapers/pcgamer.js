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

function by(a) {
  let b = a.toLowerCase()
  .replace('by', '')
  .replace('         ', '')
  .replace(',', ' & ')
  .trim()
  return d = b
}

const url = 'https://www.pcgamer.com/artifact/'

const pcgamer = () => {
  x(url, 'div.listingResult.small', [{
    url: 'a@href | trim',
    title: 'h3.article-name | trim',
    description: 'p.synopsis | trim',
    author: 'span.by-author | trim',
    publishedAt: 'time.published-date.relative-date@datetime | trim',
    image : 'figure.article-lead-image-wrap@data-original | trim'
  }])
  .then(results => {
    results.forEach(element => {
      let article = new Article()

      Article.find({title: element.title}, (err, res) => {
        if (err) {
          throw err
        } else {
          if (res < 1) {
            article.source = 'Pc Gamer'
            article._id = new mongoose.Types.ObjectId()
            article.author =  by(element.author)
            article.title = element.title
            article.description = element.description || ''
            article.url = element.url
            article.urlToImage = element.image
            article.publishedAt = element.publishedAt

            article.save(err => {
              if (err) {
                throw err
              } else {
                console.log('pc gamer - ' + article.title + ' guardado!')
              }
            })
          } else {
            console.log('pc gamer - ' + 'Este ya está guardado!')
          }
        }
      })
    })
  })
}

module.exports = pcgamer