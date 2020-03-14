const setlistsRouter = require('express').Router()
const Setlist = require('../models/setlist')
const jwt = require('jsonwebtoken')
const helpers = require('../utils/helpers')

setlistsRouter.get('/all', async (req, res, next) => {
  try {
    const token = helpers.getTokenFrom(req)
    const decodedToken = jwt.verify(token, process.env.SECRET)

    if (!token || !decodedToken.id) {
      return res.status(401).json({ error: 'token missing or invalid' })
    }

    const allSetlists = await Setlist.find({
      user: decodedToken.id
    }).populate('songs', [])
    res.json(allSetlists)
  } catch (exception) {
    next(exception)
  }
})

setlistsRouter.post('/', async (req, res, next) => {
  try {
    const token = helpers.getTokenFrom(req)
    const decodedToken = jwt.verify(token, process.env.SECRET)

    if (!token || !decodedToken.id) {
      return res.status(401).json({ error: 'token missing or invalid' })
    }

    const body = req.body
    if (body.name === undefined || body.songs === undefined) {
      res.status(400).json({ error: 'name or songs undefined' })
    } else {
      const setlist = new Setlist({
        songs: body.songs,
        name: body.name,
        user: decodedToken.id
      })
      const savedSetlist = await setlist.save()
      res.status(201).json(savedSetlist)
    }
  } catch (exception) {
    next(exception)
  }
})

module.exports = setlistsRouter
