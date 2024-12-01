const connetcToMongo = require("./db");
const express = require('express')
var cors = require('cors')
connetcToMongo();

const app = express()
const port = 8000

app.use(cors())

app.use(express.json())
// Available Routes

app.use('/api/auth', require('./routes/auth'))
app.use('/api/notes', require('./routes/notes'))


// ye endpoint yese hi hai
app.get('/', (req, res) => {
  res.send('Welcome Arun!')
})

app.listen(port, () => {
  console.log(`Task Manager Backend listening on port http://localhost:${port}`)
})

