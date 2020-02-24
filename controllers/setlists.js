const setlistsRouter = require('express').Router()
const Setlist = require('../models/setlist')
// TODO const User = require('../models/user')
// TODO const jwt = require('jsonwebtoken')

setlistsRouter.get('/all', async (req, res, next) => {
  try {
    const allSetlists = await Setlist.find({}).populate('songs', [])
    res.json(allSetlists)
  } catch (exception) {
    next(exception)
  }
})

setlistsRouter.post('/', async (request, response, next) => {
  const body = request.body
  try {
    if (body.name === undefined || body.songs === undefined) {
      response.status(400).json({ error: 'name or songs undefined' })
    } else {
      const setlist = new Setlist({
        songs: body.songs,
        name: body.name
      })
      const savedSetlist = await setlist.save()
      response.status(201).json(savedSetlist)
    }
  } catch (exception) {
    next(exception)
  }
})

module.exports = setlistsRouter
