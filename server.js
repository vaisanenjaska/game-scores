var express = require('express')
var app = express()

app.get('/', function(req, res) {
  res.type('html')
  res.sendStatus(200)
  res.render("<p>Hey</p>")
})
