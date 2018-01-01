'use strict'

var path = require('path')
var url = require('url')
var pkg = require('../package.json')

var isProductionBuild = false
var isDev = false
if (!pkg.scripts) {
  isProductionBuild = true
  // we remove scripts on build.
  isDev = false
}
isDev = isProductionBuild
  ? !!(process.env.DEBUG || '').match(/clipster/)
  : !!(process.env.NODE_ENV || '').match(/dev/)

var index = isProductionBuild
  ? url.format({
    pathname: path.join(__dirname, '..', 'ui', 'index.html'),
    protocol: 'file:',
    slashes: true
  })
  : 'http://localhost:3000'

console.log(index)

module.exports = {
  index,
  isDev,
  isProductionBuild,
  persistentDirBasename: '.clipster'
}
