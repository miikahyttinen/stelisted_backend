const songsRouter = require('express').Router()
const Song = require('../models/song')
const jwt = require('jsonwebtoken')
const helpers = require('../utils/helpers')

songsRouter.get('/all', async (req, res, next) => {
  try {
    const token = helpers.getTokenFrom(req)
    const decodedToken = jwt.verify(token, process.env.SECRET)
    if (!token || !decodedToken.id) {
      return res.status(401).json({ error: 'token missing or invalid' })
    }

    const allSongs = await Song.find({ user: decodedToken.id })
    res.json(allSongs)
  } catch (exception) {
    next(exception)
  }
})

songsRouter.post('/', async (req, res, next) => {
  try {
    const token = helpers.getTokenFrom(req)
    const decodedToken = jwt.verify(token, process.env.SECRET)
    if (!token || !decodedToken.id) {
      return res.status(401).json({ error: 'token missing or invalid' })
    }

    const body = req.body
    if (body.name === undefined || body.artist === undefined) {
      res.status(400).json({ error: 'song name or artist undefined' })
    } else {
      const song = new Song({
        artist: body.artist,
        key: body.key,
        name: body.name,
        user: decodedToken.id
      })
      const savedSong = await song.save()
      res.status(201).json(savedSong)
    }
  } catch (exception) {
    next(exception)
  }
})

songsRouter.delete('/:id', async (req, res, next) => {
  const token = helpers.getTokenFrom(req)
  const decodedToken = jwt.verify(token, process.env.SECRET)
  if (!token || !decodedToken.id) {
    return res.status(401).json({ error: 'token missing or invalid' })
  }
  const song = await Song.findOne({ _id: req.params.id })
  if (song.user.toString() !== decodedToken.id.toString()) {
    return res.status(401).json({ error: 'user cannot edit this song' })
  }
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

songsRouter.put('/', async (req, res, next) => {
  try {
    const token = helpers.getTokenFrom(req)
    const decodedToken = jwt.verify(token, process.env.SECRET)
    if (!token || !decodedToken.id) {
      return res.status(401).json({ error: 'token missing or invalid' })
    }
    const body = req.body
    const song = await Song.findOne({ _id: body.id })
    if (song.user.toString() !== decodedToken.id.toString()) {
      return res.status(401).json({ error: 'user cannot edit this song' })
    }

    if (
      body.id === undefined ||
      body.name === undefined ||
      body.artist === undefined ||
      body.key === undefined
    ) {
      res.status(400).json({ error: 'id, name, artist or key undefined' })
    } else {
      const update = {
        name: body.name,
        artist: body.artist,
        key: body.key
      }
      const updated = await Song.findByIdAndUpdate(body.id, update, {
        new: true
      })
      res.status(201).json(updated)
    }
  } catch (exception) {
    next(exception)
  }
})

module.exports = songsRouter
