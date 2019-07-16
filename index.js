const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const controller = require('./controller')
const db = require('./db')

const PORT = process.env.PORT || 5000;

let app = express();

// middlewares
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors())

// start db
db.init()

// routing api
app.get('/feeds', (req, res) => {
    controller.getFeeds(req, res)
})

app.post('/feed', (req, res) => {
    controller.saveFeed(req, res)
})

app.listen(PORT, () => console.log(`Listening on ${PORT}`));