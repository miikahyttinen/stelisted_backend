const songsRouter = require('express').Router()
const Song = require('../models/song')
// TODO const User = require('../models/user')
// TODO const jwt = require('jsonwebtoken')

songsRouter.get('/all', async (req, res, next) => {
  try {
    const allSongs = await Song.find()
    res.json(allSongs)
  } catch (exception) {
    next(exception)
  }
})

songsRouter.post('/song', async (request, response, next) => {
  const body = request.body
  try {
    if (body.name === undefined || body.artist === undefined) {
      response.status(400).json({ error: 'song name or artist undefined' })
    } else {
      const song = new Song(body)
      const savedSong = await song.save()
      response.status(201).json(savedSong)
    }
  } catch (exception) {
    next(exception)
  }
})

songsRouter.delete('/:id', async (req, res, next) => {
  try {
    const result = await Song.findByIdAndRemove(req.params.id)
    if (result !== null) {
      res.status(200).json(result)
    } else {
      res.status(204).json({ error: 'no song with that id' })
    }
  } catch (exception) {
    next(exception)
  }
})

songsRouter.put('/', async (request, response, next) => {
  const body = request.body
  try {
    if (
      body.id === undefined ||
      body.name === undefined ||
      body.artist === undefined ||
      body.key === undefined
    ) {
      response.status(400).json({ error: 'id, name, artist or key undefined' })
    } else {
      const update = {
        name: body.name,
        artist: body.artist,
        key: body.key
      }
      const updated = await Song.findByIdAndUpdate(body.id, update, {
        new: true
      })
      response.status(201).json(updated)
    }
  } catch (exception) {
    next(exception)
  }
})

module.exports = songsRouter
