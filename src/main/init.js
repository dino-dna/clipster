var os = require('os')
var fs = require('fs-extra')
var path = require('path')
var { persistentDirBasename } = require('../common/constants')
var atob = require('abab').atob
var createState = require('./state')

async function initHistory (historyFilename) {
  var history = []
  if (await fs.exists(historyFilename)) {
    let rawHistory = await fs.readFile(historyFilename)
    try {
      history = JSON.parse(rawHistory).map(atob)
    } catch (err) {
      console.warn(`invalid history file: ${historyFilename}. skipping`)
    }
  }
  return history
}

async function initUserConfig (userConfigFilename) {
  var config = {}
  if (await fs.exists(userConfigFilename)) {
    let raw = await fs.readFile(userConfigFilename)
    try {
      config = JSON.parse(raw)
    } catch (err) {
      throw new Error(`invalid JSON detected in config file: ${userConfigFilename}`)
    }
  }
  return config
}

module.exports = async function init () {
  var persistentDirname = path.join(os.homedir(), persistentDirBasename)
  var userConfigFilename = path.join(persistentDirname, 'config.json')
  var historyFilename = path.join(persistentDirname, 'history')
  var history = []
  var userConfig
  await fs.mkdirp(persistentDirname)
  ;[history, userConfig] = await Promise.all([
    initHistory(historyFilename),
    initUserConfig(userConfigFilename)
  ])
  var config = {
    history,
    historyFilename,
    persistentDirBasename,
    persistentDirname
  }
  for (var key in userConfig) {
    if (key in config) throw new Error(`invalid key ${key} in user config`)
    config[key] = userConfig[key]
  }
  return Object.assign(createState(), config)
}
