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
let fecha

function trimAuthor(a) {
  p = a.replace('by', '')
  .trim()
  return cleanAuthor = p
}

function dt(t) {
  f = t.replace('- DrawTwo', '')
  .trim()
  return nodraw = f
}


function validate (d) {
  let va = d.toLowerCase()
  fecha = new Date(va)
  return fecha.toISOString()
}

const url = 'https://drawtwo.gg/articles'

const drawTwo = () => {
  x(url, 'article', [{
    link: 'a@href | trim'
  }])
  .then(links => {
    links.forEach(element => {
      x(element.link, 'html', [{
        url: 'meta[property="og:url"]@content | trim',
        description: 'meta[property="og:description"]@content | trim',
        title: 'meta[property="og:title"]@content | trim',
        image: 'meta[property="og:image"]@content | trim',
        author: 'div.article_meta span:nth-child(1)',
        publishedAt: 'div.article_meta span:nth-child(2)'
      }])
      .then(resu => {

        let article = new Article()
        let tut = dt(resu[0].title)


        Article.find({title: tut}, (err, res) => {
          if (err) {
            throw err
          } else {
            if (res < 1) {
              article.source = 'DrawTwo'
              article._id = new mongoose.Types.ObjectId()
              article.author = trimAuthor(resu[0].author)
              article.title = tut
              article.description = resu[0].description || ''
              article.url = resu[0].url
              article.urlToImage = resu[0].image
              article.publishedAt = validate(resu[0].publishedAt)

              article.save(err => {
                if (err) {
                  throw err
                } else {
                  console.log('DrawTwo ' + resu[0].title + ' guardado!')
                }
              })
            } else {
              console.log('DrawTwo ' + resu[0].title + ' Ya está guardado!')
            }
          }
        })
      })
    })
  })
}

module.exports = drawTwo
