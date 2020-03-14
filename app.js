const express = require('express')
const app = express()

const cors = require('cors')
const middleware = require('./utils/middleware')
const fetch = require('node-fetch')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const songsRouter = require('./controllers/songs')
const setlistsRouter = require('./controllers/setlists')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')

const spotifyApiUrl = 'http://api.spotify.com/v1'
//change mongoUrl to connect production DB
const mongoUrl = process.env.MONGODB_URI_DEV
mongoose.connect(mongoUrl, { useNewUrlParser: true, useFindAndModify: false })

app.use(express.static('build'))
app.use(cors())
app.use(middleware.requestLogger)
app.use(bodyParser.json())

app.use('/api/song', songsRouter)
app.use('/api/setlist', setlistsRouter)
app.use('/api/user', usersRouter)
app.use('/api/login', loginRouter)

app.get('/', (req, res) => {
  res.send('<h1>This is Setlisted!</h1>')
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

module.exports = app
