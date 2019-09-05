const express = require('express')
const app = express()
const cors = require('cors')
const middleware = require('./utils/middleware')
const queryString = require('query-string')
const fetch = require('node-fetch')

app.use(cors())
app.use(middleware.requestLogger)

let songs = [
  {
    id: 1,
    name: 'September',
    artist: 'Earth Wind & Fire'
  },
  {
    id: 2,
    name: 'Boogie Wonderland',
    artist: 'Earth Wind & Fire'
  },
  {
    id: 3,
    name: 'Sleeping In My Car',
    artist: 'Roxette'
  }
]

app.get('/', (req, res) => {
  res.send('<h1>This is Setlisted!</h1>')
})

app.get('/songs', (req, res) => {
  res.json(songs)
})

app.get('/spotify', async (req, res) => {
  const spotifyAccessToken = queryString.parseUrl(req.headers.referer).query
    .access_token
  const apiResponse = await fetch(
    `http://api.spotify.com/v1/playlists/1iHADEaVKULre5JnAMAslK?access_token=${spotifyAccessToken}`
  )
    .then(res => res.json()) // expecting a json response
    .then(json => json)
  res.json(apiResponse)
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
