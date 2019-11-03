const mongoose = require('mongoose')

const setlistSchema = mongoose.Schema({
  name: String,
  songs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Song', required: true }]
})

setlistSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

const Setlist = mongoose.model('Setlist', setlistSchema)

module.exports = Setlist
