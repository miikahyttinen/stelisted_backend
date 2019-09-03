const express = require('express')
const app = express()
const cors = require('cors')
const middleware = require('./utils/middleware')

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

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
