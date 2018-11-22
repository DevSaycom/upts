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

const url = 'https://www.gameinformer.com/product/artifact'
let fecha;

function dates(au, date) {
  d = date.toLowerCase()
  .replace('at', '')
  .replace('by', '')
  .replace(au, '')
  .replace('on', '')
  .replace('pm', '')
  .replace('am', '')
  .replace('sep', 'september')
  .replace('sept', 'september')
  .replace('jan', 'january')
  .replace('feb', 'february')
  .replace('mar', 'march')
  .replace('apr', 'april')
  .replace('may', 'may')
  .replace('jun', 'june')
  .replace('jul', 'july')
  .replace('aug', 'august')
  .replace('oct', 'october')
  .replace('nov', 'november')
  .replace('dec', 'december')
  .trim()

  fecha = new Date(d)
  return fecha.toISOString()
}


const gameinformer = () => {
  x(url, 'div.views-row', [{
    link: 'a@href'
  }])
  .then(links => {

    links.forEach(element => {
      x(element.link, 'html', [{
        url: 'meta[property="og:url"]@content | trim',
        description: 'meta[name="description"]@content | trim',
        title: 'meta[property="og:title"]@content | trim',
        image: 'meta[property="og:image"]@content | trim',
        author: 'meta[property="article:author"]@content | trim',
        publishedAt: 'div.author-details | trim'
      }])
      .then(resu => {

        let article = new Article()

        Article.find({title: resu[0].title}, (err, res) => {
          if (err) {
            throw err
          } else {
            if (res < 1) {
              article.source = 'Game Informer'
              article._id = new mongoose.Types.ObjectId()
              article.author = resu[0].author
              article.title = resu[0].title
              article.description = resu[0].description || ''
              article.url = resu[0].url
              article.urlToImage = resu[0].image
              article.publishedAt = dates(resu[0].author, resu[0].publishedAt)

              article.save(err => {
                if (err) {
                  throw err
                } else {
                  console.log('Game Informer ' + resu[0].title + ' guardado!')
                }
              })
            } else {
              console.log('Game Informer ' + resu[0].title + ' Ya está guardado!')
            }
          }
        })
      })
    })
  })
}


module.exports = gameinformer
