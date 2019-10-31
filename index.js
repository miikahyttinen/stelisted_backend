require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
const middleware = require('./utils/middleware')
const queryString = require('query-string')
const fetch = require('node-fetch')
const Song = require('./models/song')
const Setlist = require('./models/setlist')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')

const baseApiUrl = 'http://api.spotify.com/v1'
//change this to connect prod DB
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

app.get('/setlist', (req, res) => {
  const allSetlists = [
    {
      name: 'Hääkeikka 12.3.2019',
      tracks: [
        {
          name: 'Smoke on the water',
          artist: 'Deep Purple',
          key: 'Em'
        },
        {
          name: 'Grow Up',
          artist: 'DJ Maacalangelo',
          key: 'Dm'
        },
        {
          name: 'Rakastuin lesboon',
          artist: 'Ursus Factory',
          key: 'Alkaa D'
        }
      ]
    },
    {
      name: 'Piazza Tahko 31.12.2019',
      tracks: [
        {
          name: 'Cotton eye Joe',
          artist: 'Deep Purple',
          key: 'G'
        },
        {
          name: 'Ihanaa leijonat',
          artist: 'Antero Mertaranta',
          key: 'Am'
        },
        {
          name: 'Symphony',
          artist: 'Clean bandit feat Zara Larsson',
          key: 'Alkaa E'
        }
      ]
    }
  ]
  res.send(allSetlists)
})

app.get('/spotify', async (req, res) => {
  const accessToken = `access_token=${
    queryString.parseUrl(req.headers.referer).query.access_token
  }`
  let url = `${baseApiUrl}/playlists/5cbfV6QdSVw05LhZyVcv7B/tracks?${accessToken}`
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
      await response.status(201).json(savedSong)
    }
  } catch (exception) {
    next(exception)
  }
})

app.post('/setlist', async (request, response, next) => {
  const body = request.body

  console.log('BODY ------------->:', body)

  try {
    if (body.name === undefined || body.songIds === undefined) {
      response.status(400).json({ error: 'name or songIds undefined' })
    } else {
      const setlist = new Setlist({
        songIds: body.songIds,
        name: body.name
      })
      console.log('PÄÄSTIN TÄHÄN')
      const savedSetlist = await setlist.save()
      await response.status(201).json(savedSetlist)
    }
  } catch (exception) {
    next(exception)
  }
})
