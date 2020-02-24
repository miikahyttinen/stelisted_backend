const mongoose = require('mongoose')

const songSchema = mongoose.Schema({
  name: String,
  artist: String,
  // here key means a key of the song e.g. E minor
  key: String,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
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
