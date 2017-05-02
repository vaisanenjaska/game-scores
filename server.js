var express = require('express')
var app = express()
var path = require("path")
var pg = require('pg')
var bodyParser = require('body-parser')

function DBConnect(res) {
  pg.defaults.ssl = true;
  let response = {}
  pg.connect(process.env.DATABASE_URL, function(err, client, done) {
    if (err) throw err
    let i = 0
    client.query('SELECT * from games;').on('row', function(row) {
			done()
      response[i++] = row
    }).then( function() {
      res.send(response)
    })
  })
}

app.use(bodyParser.urlencoded({
    extended: true
}))

app.use(bodyParser.json());

app.get('/', function(req, res) {
  res.sendFile(__dirname + "/index.html")
})

app.post('/', function(req,res) {
  DBConnect(res)
})

app.post('/scores/:id', function(req, res) {
  let id = req.params.id
  pg.defaults.ssl = true;
  let response = {}
  pg.connect(process.env.DATABASE_URL, function(err, client, done) {
    if (err) throw err
    let i = 0
    client.query('SELECT * from scores where gameid=$1 order by cast(score as int) desc;', [id]).on('row', function(row) {
			done()
      response[i++] = row
    }).then( function() {
      res.send(response)
    })
  })
})

app.post('/submitscore/:id', function(req, res) {
  let id = req.params.id
  pg.defaults.ssl = true;
  let response = {}
  pg.connect(process.env.DATABASE_URL, function(err, client, done) {
    if (err) throw err
    let i = 0
    client.query('INSERT INTO scores ("gameid", "nick", "score") VALUES ($1, $2, $3);', [id, req.body.name, req.body.score], function() {
			done()
		})
  })
  res.send(req.body.name)
})

app.get('/games/:id', function(req, res) {
  let id = req.params.id
  pg.defaults.ssl = true;
  let response = []
  pg.connect(process.env.DATABASE_URL, function(err, client, done) {
    if (err) throw err
    let i = 0
    client.query('SELECT * from scores where gameid=$1 order by cast(score as int) desc;', [id]).on('row', function(row) {
			done()
      response.push(row)
    }).then( function() {
      res.send(response)
    })
  })
})

app.get('/games', function(req, res) {
  let id = req.params.id
  pg.defaults.ssl = true;
  let response = []
  pg.connect(process.env.DATABASE_URL, function(err, client, done) {
    if (err) throw err
    let i = 0
    client.query('SELECT * from games;').on('row', function(row) {
			done()
      response.push(row)
    }).then( function() {
      res.send(response)
    })
  })
})

app.post('/game', function (req,res) {
  pg.defaults.ssl = true;
  let response = {}
  pg.connect(process.env.DATABASE_URL, function(err, client, done) {
    if (err) throw err
    let i = 0
    client.query('INSERT INTO games ("name") VALUES ($1);', [req.body.name], function() {
			done()
		})
  })
  res.send(req.body.name)
})

app.listen(process.env.PORT || 3000, function () {
  console.log('Listening')
})
