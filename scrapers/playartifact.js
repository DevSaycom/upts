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

const url = 'https://playartifact.com/'
let fecha;

function cambiarFecha(date) {
  d = new Date(date)
  fecha = d
  return fecha.toISOString()
}

const playartifact = () => {
  x(url, 'div#blog_posts a', [{
    url: '@href',
    title: 'span.blog_post_title | trim',
    publishedAt: 'span.blog_post_date | trim',
    image: 'img@src'
  }])
  .then(results => {
    results.splice(-1,1)
    return results
  })
  .then(Re => {

    Re.forEach(element => {

      let article = new Article()

      Article.find({title: element.title}, (err, res) => {
        if (err) {
          throw err
        } else {
          if (res < 1) {
            article.source = 'PlayArtifact'
            article._id = new mongoose.Types.ObjectId()
            article.author = 'Valve'
            article.title = element.title
            article.description = ' '
            article.url = element.url
            article.urlToImage = element.image
            article.publishedAt = cambiarFecha(element.publishedAt)

            article.save(err => {
              if (err) {
                throw err
              } else {
                console.log('PlayArtifact - ' + element.title + ' guardado!')
              }
            })
          } else {
            console.log('PlayArtifact - ' + element.title + ' ya existe!')
          }
        }
      })
    })
  })
}


module.exports = playartifact