'use strict'

var path = require('path')
var url = require('url')

var isDev = !!(process.env.NODE_ENV || '').match(/dev/)

var index = isDev
  ? 'http://localhost:3000'
  : url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  })

module.exports = {
  index,
  isDev,
  persistentDirBasename: '.clipster'
}
