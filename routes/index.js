var express = require('express')
var app = express()app.get('/', function (req, res) {
    res.render('index', { title: 'My Schedule' })
})

module.exports = app;