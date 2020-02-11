const express = require('express')
const app = express()

const cors = require('cors')
const middleware = require('./utils/middleware')
const fetch = require('node-fetch')
const Setlist = require('./models/setlist')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const songsRouter = require('./controllers/songs')

const spotifyApiUrl = 'http://api.spotify.com/v1'
//change this to connect production DB
const mongoUrl = process.env.MONGODB_URI_DEV
mongoose.connect(mongoUrl, { useNewUrlParser: true, useFindAndModify: false })

app.use(express.static('build'))
app.use(cors())
app.use(middleware.requestLogger)
app.use(bodyParser.json())

app.use('/api/song', songsRouter)

app.get('/', (req, res) => {
  res.send('<h1>This is Setlisted!</h1>')
})

app.get('/api/setlist/all', async (req, res, next) => {
  try {
    const allSetlists = await Setlist.find({}).populate('songs', [])
    res.json(allSetlists)
  } catch (exception) {
    next(exception)
  }
})

app.get('/api/spotify/:id', async (req, res) => {
  const playlistId = req.params.id
  const accessToken = `access_token=${req.headers.authorization}`
  let url = `${spotifyApiUrl}/playlists/${playlistId}/tracks?${accessToken}`
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

app.post('/api/setlist', async (request, response, next) => {
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

module.exports = app
