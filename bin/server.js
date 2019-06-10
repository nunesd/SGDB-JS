

const http = require('http')
const debug = require('debug')('nodestr:server')
const express = require('express')
const app = require('../src/app')

const port = '3000'
app.set('port', port)

const server = http.createServer(app)


server.listen(port)
