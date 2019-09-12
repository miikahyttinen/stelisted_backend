const express = require('express')
const app = express()
const cors = require('cors')
const middleware = require('./utils/middleware')
const queryString = require('query-string')
const fetch = require('node-fetch')

const baseApiUrl = ''

app.use(cors())
app.use(middleware.requestLogger)

app.get('/', (req, res) => {
  res.send('<h1>This is Setlisted!</h1>')
})

app.get('/spotify', async (req, res) => {
  const spotifyAccessToken = queryString.parseUrl(req.headers.referer).query
    .access_token
  let responseJson = []
  let next = true
  let url = `http://api.spotify.com/v1/playlists/1iHADEaVKULre5JnAMAslK/tracks?access_token=${spotifyAccessToken}`
  while (next) {
    console.log('URL-->', url)
    const response = await fetch(url)
    const data = await response.json()
    console.log('DATA ------------------- !!!!', data.items)
    responseJson = responseJson.concat(data.items)
    if (data.next) {
      url = `${data.next}&access_token=${spotifyAccessToken}`
    } else {
      next = false
    }
  }
  console.log('responseJson ****', responseJson.length)
  return res.send(responseJson)
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
