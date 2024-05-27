const connectToMongo = require('./db');
const express = require('express')
var cors = require('cors')
connectToMongo();
const app = express()
const port = 5000

app.use(cors())
app.use(express.json())

router.get('/', async (req, res) => {
res.send("Backend is working");
})

//Available Routes
app.use('/api/auth', require('./routes/auth'))
app.use('/api/task', require('./routes/tasks'))

app.listen(port, () => {
  console.log(`taskManager backend listening at http://localhost:${port}`)
})
