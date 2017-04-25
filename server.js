var express = require('express')
var app = express()
var path = require("path")
var pg = require('pg')

function DBConnect(res) {
  pg.defaults.ssl = true;
  let response = {}
  pg.connect(process.env.DATABASE_URL, function(err, client) {
    if (err) throw err
    console.log('Connected to postgres! Getting schemas...')
    let i = 0
    client.query('SELECT * from games;').on('row', function(row) {
        response[i++] = row.name
    }).then( function() {
      res.send(response)
    })
  })
}

app.get('/', function (req, res) {
  res.sendFile(__dirname + "/index.html")
})

app.post('/', function (req,res) {
  DBConnect(res)
})

app.listen(process.env.PORT || 3000, function () {
  console.log('Listening')
})
