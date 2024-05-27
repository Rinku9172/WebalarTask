const connectToMongo = require('./db');
const express = require('express');
var cors = require('cors');
connectToMongo();
const app = express();
const port = 5000;

// Configure CORS to allow specific origin
app.use(cors({
  origin: 'http://localhost:3000', // Allow requests from this origin
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Allow these methods
  credentials: true // Allow credentials such as cookies, authorization headers or TLS client certificates
}));

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
