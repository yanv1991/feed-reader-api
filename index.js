const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const controller = require('./controller')

const PORT = process.env.PORT || 5000;
const corsOptions = {
    origin: '*'
  }

let app = express();

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors())

let dev_db_url = 'mongodb+srv://dev:dev@cluster0-z3ysl.mongodb.net/test?retryWrites=true&w=majority'
let mongoDB = process.env.MONGODB_URI || dev_db_url;
mongoose.connect(mongoDB);
mongoose.Promise = global.Promise;
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.get('/feeds', (req, res) => {
    controller.getFeeds(req, res)
})

app.post('/feed', (req, res) => {
    controller.saveFeed(req, res)
})

app.listen(PORT, () => console.log(`Listening on ${PORT}`));