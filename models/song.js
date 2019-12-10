const mongoose = require('mongoose')

const songSchema = mongoose.Schema({
  name: String,
  artist: String,
  // here key means a key of the song like E minor
  key: String
})

songSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

const Song = mongoose.model('Song', songSchema)

module.exports = Song
