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

const url = 'https://www.artibuff.com/blog/'
let fecha
let cleanUrl

/* background-image:url(/assets/content/8dfb7fa4-0005-4d93-a140-84105b153111.jpg) */

function trimUrl(pag) {
  p = pag.replace('background-image:url(', '')
  .replace(')', '')
  .trim()

  return cleanUrl = 'https://www.artibuff.com' + p
}

function cambio(f) {
  q = f.toLowerCase()
  .replace(',', '')
  .replace('th', '')
  .replace('st', '')
  .replace('nd', '')
  .replace('rd', '')
  .trim()

  fecha = new Date(q)
  return fecha.toISOString()
}

const artibuff = () => {
  x(url, 'div.PostSummary', [{
    url: 'div.postSummary--title a@href | trim',
    title: 'div.postSummary--title a | trim',
    description: 'div.CustomP | trim',
    author: 'span a | trim',
    publishedAt: 'span:nth-child(4) | trim',
    image: 'div.postSummary--headerImage @style'
  }])
  .then(results => {
    results.forEach(element => {
      let article = new Article()

      Article.find({title: element.title}, (err, res) => {
        if (err) {
          throw err
        } else {
          if (res < 1) {
            article.source = 'Artibuff'
            article._id = new mongoose.Types.ObjectId()
            article.author = element.author
            article.title = element.title
            article.description = element.description || ''
            article.url = element.url
            article.urlToImage = trimUrl(element.image)
            article.publishedAt = cambio(element.publishedAt)

            article.save(err => {
              if (err) {
                throw err
              } else {
                console.log('Artibuff - ' + element.title + ' guardado!')
              }
            })
          } else {
            console.log('Artibuff - ' + element.title + ' ya existe!')
          }
        }
      })
    })
    })
}

module.exports = artibuff

