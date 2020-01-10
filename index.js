require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
const middleware = require('./utils/middleware')
const fetch = require('node-fetch')
const Song = require('./models/song')
const Setlist = require('./models/setlist')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')

const baseApiUrl = 'http://api.spotify.com/v1'
//change this to connect production DB
const mongoUrl = process.env.MONGODB_URI_DEV
mongoose.connect(mongoUrl, { useNewUrlParser: true, useFindAndModify: false })

app.use(cors())
app.use(middleware.requestLogger)
app.use(bodyParser.json())

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

app.get('/', (req, res) => {
  res.send('<h1>This is Setlisted!</h1>')
})

app.get('/setlist/all', async (req, res, next) => {
  try {
    const allSetlists = await Setlist.find({}).populate('songs', [])
    res.json(allSetlists)
  } catch (exception) {
    next(exception)
  }
})

app.get('/song/all', async (req, res, next) => {
  try {
    const allSongs = await Song.find()
    res.json(allSongs)
  } catch (exception) {
    next(exception)
  }
})

app.get('/spotify/:id', async (req, res) => {
  const playlistId = req.params.id
  const accessToken = `access_token=${req.headers.authorization}`
  let url = `${baseApiUrl}/playlists/${playlistId}/tracks?${accessToken}`
  let response = await fetch(url)
  let data = await response.json()
  let responseJson = data.items
  while (data.next !== null) {
    url = `${data.next}&${accessToken}`
    response = await fetch(url)
    data = await response.json()
    responseJson = responseJson.concat(data.items)
  }
  return res.send(responseJson)
})

app.post('/song', async (request, response, next) => {
  const body = request.body
  try {
    if (body.name === undefined || body.artist === undefined) {
      response.status(400).json({ error: 'title or url undefined' })
    } else {
      const song = new Song(body)
      const savedSong = await song.save()
      response.status(201).json(savedSong)
    }
  } catch (exception) {
    next(exception)
  }
})

app.delete('/song/:id', async (req, res, next) => {
  try {
    const result = await Song.findByIdAndRemove(req.params.id)
    console.log('RESULT OF REMOVE SONG OPERATION -->', result)
  } catch (exception) {
    next(exception)
  }
})

app.post('/setlist', async (request, response, next) => {
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
