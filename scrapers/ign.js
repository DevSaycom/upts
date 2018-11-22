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

const url = 'https://www.ign.com/games/artifact'

const ign = () => {
  x(url, 'article', [{
    url: 'a.anchor@href'
  }])
  .then(links => {
    links.forEach(element => {
      x(element.url, 'html', [{
        description: "meta[name='description']@content | trim",
        image:"meta[property='og:image']@content | trim",
        title:"meta[property='og:title']@content | trim",
        publishedAt:"span.article-publish-date meta[itemprop='datePublished']@content | trim",
        publishedAt2: 'span.publish-date meta[itemprop="datePublished"]@content',
        author: 'span[itemprop="name"] a',
        url: "meta[property='og:url']@content | trim"
      }])
      .then(resu => {

        let article = new Article()

        Article.find({title: resu[0].title}, (err, res) => {
          if (err) {
            throw err
          } else {
            if (res < 1) {
              article.source = 'Ign'
              article._id = new mongoose.Types.ObjectId()
              article.author = resu[0].author || 'Artifact'
              article.title = resu[0].title
              article.description = resu[0].description || ''
              article.url = resu[0].url
              article.urlToImage = resu[0].image
              article.publishedAt = resu[0].publishedAt || resu[0].publishedAt2

              article.save(err => {
                if (err) {
                  throw err
                } else {
                  console.log('ign ' + resu[0].title + ' guardado!')
                }
              })
            } else {
              console.log('ign ' + resu[0].title + ' Ya está guardado!')
            }
          }
        })
      })
    })
  })
}

module.exports = ign