const mongoose = require('mongoose')

const articleScheme = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  source: {
    type: String,
    required: true
  },
  author: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  url: {
    type: String,
    required: true
  },
  urlToImage: {
    type: String,
    required: true
  },
  publishedAt: {
    type: String,
    required: true
  }
})

module.exports = mongoose.model('Article', articleScheme)