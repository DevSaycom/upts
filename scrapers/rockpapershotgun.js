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

const url = 'https://www.rockpapershotgun.com/game/artifact/'
let fecha

function validate (d) {
  let va = d.toLowerCase()
  .replace('/', '')
  .replace('th', '')
  .replace('st', '')
  .replace('nd', '')
  .replace('rd', '')
  .replace('pm', '')
  .replace('am', '')
  .trim()
  fecha = new Date(va)
  return fecha.toISOString()
}

const rockpapershotgun = () => {
  x(url, 'article.archive-item', [{
    link: 'p.title a@href'
  }])
  .then(links => {
    links.forEach(element => {
      x(element.link, 'html', [{
        description: "meta[name='description']@content | trim",
        image: "meta[property='og:image']@content | trim",
        url: "meta[property='og:url']@content | trim",
        author: 'p.author-name a | trim',
        publishedAt: 'p.publication-date | trim',
        title: "meta[property='og:title']@content | trim"
      }])
      .then(resu => {

        let article = new Article()

        Article.find({title: resu[0].title}, (err, res) => {
          if (err) {
            throw err
          } else {
            if (res < 1) {
              article.source = 'Rock Paper Shotgun'
              article._id = new mongoose.Types.ObjectId()
              article.author = resu[0].author
              article.title = resu[0].title
              article.description = resu[0].description || ''
              article.url = resu[0].url
              article.urlToImage = resu[0].image
              article.publishedAt = validate(resu[0].publishedAt)

              article.save(err => {
                if (err) {
                  throw err
                } else {
                  console.log('Rock Paper Shotgun ' + resu[0].title + ' guardado!')
                }
              })
            } else {
              console.log('Rock Paper Shotgun ' + resu[0].title + ' Ya está guardado!')
            }
          }
        })
      })
    })
  })
}

module.exports = rockpapershotgun