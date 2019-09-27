const express = require('express')
const app = express()
const cors = require('cors')
const middleware = require('./utils/middleware')
const queryString = require('query-string')
const fetch = require('node-fetch')

const baseApiUrl = 'http://api.spotify.com/v1'

app.use(cors())
app.use(middleware.requestLogger)

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

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
