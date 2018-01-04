'use strict'

var path = require('path')
var url = require('url')
var pkgUp = require('pkg-up')
var pkg = require(pkgUp.sync(__dirname))

var isProductionBuild = false
var isDev = false
if (!pkg.version.match(/0\.0\.0/)) {
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

module.exports = {
  index,
  isDev,
  isProductionBuild,
  persistentDirBasename: '.clipster'
}
