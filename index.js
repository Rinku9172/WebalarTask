const connectToMongo = require('./db');
const express = require('express');
var cors = require('cors');
connectToMongo();
const app = express();
const port = 5000;

// Configure CORS to allow specific origin
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "https://deluxe-narwhal-926463.netlify.app");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(express.json());

app.get('/', async (req, res) => {
  res.send("Backend is working");
});

// Available Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/task', require('./routes/tasks'));

app.listen(port, () => {
  console.log(`PreetMakeup backend listening at http://localhost:${port}`);
});
