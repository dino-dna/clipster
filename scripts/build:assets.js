'use strict'

var execa = require('execa')
var path = require('path')
var fs = require('fs-extra')
var pick = require('lodash/pick')

var childOpts = {
  cwd: path.resolve(__dirname, '..'),
  stdio: 'inherit',
  env: Object.assign({}, process.env, { NODE_ENV: 'production' })
}

async function assets () {
  await execa.shell('rm -rf app && mkdir -p app', childOpts)
  await Promise.all([
    execa.shell('cp -r src/main app/', childOpts),
    execa.shell('cp -r src/common app/', childOpts),
    execa.shell('cp src/main/production.index.js app/index.js', childOpts)
  ])
  var appPkg = require('../package.json')
  var versionFile = path.resolve(__dirname, '..', 'PUBLISHED_VERSION')
  if (await fs.exists(versionFile)) {
    appPkg.version = (await fs.readFile(versionFile)).toString().trim()
  } else {
    console.error('[clipster:build:assets]: unable to find version file. ignoring.')
  }
  appPkg = pick(appPkg, ['name', 'version', 'author', 'dependencies', 'author', 'license'])
  appPkg.main = 'index.js'
  await fs.writeFile(
    path.resolve(__dirname, '../app/package.json'),
    JSON.stringify(appPkg, null, 2)
  )
  await execa.shell('cp -r node_modules app/node_modules', childOpts)
  await execa.shell('cd app && yarn', childOpts)
}

assets()
