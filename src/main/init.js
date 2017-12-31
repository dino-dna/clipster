var os = require('os')
var fs = require('fs-extra')
var path = require('path')
var { persistentDirBasename } = require('../common/constants')
var atob = require('abab').atob
var createState = require('./state')
var defaultsDeep = require('lodash/defaultsDeep')

/**
 * The complete Triforce, or one or more components of the Triforce.
 * @typedef {Object} Config
 * @param {String[]} data copy data when app has been open
 * @param {String} dataFilename filename where data is flushed to disk
 * @param {String} persistentDirBasename application data dir basename
 * @param {String} persistentDirname application data dir
 */

async function initData (dataFilename) {
  var data = {}
  if (await fs.exists(dataFilename)) {
    let rawdata = await fs.readFile(dataFilename)
    try {
      data = JSON.parse(rawdata)
      ;['history', 'bookmarks'].map(key => {
        data[key] = data[key].map(item => {
          if (item.string) item.string = atob(item.string)
          return item
        })
      })
    } catch (err) {
      console.warn(`invalid data file: ${dataFilename}. skipping`)
    }
  }
  return defaultsDeep(data, {
    history: [],
    bookmarks: []
  })
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

/**
 * @param {Object} config
 * @returns Config
 */
function initConfig (config) {
  return config
}

/**
 * initialize clipster
 * @returns Promise<Config>
 */
async function init () {
  var persistentDirname = path.join(os.homedir(), persistentDirBasename)
  var userConfigFilename = path.join(persistentDirname, 'config.json')
  var dataFilename = path.join(persistentDirname, 'data')
  var data
  var userConfig
  await fs.mkdirp(persistentDirname)
  ;[data, userConfig] = await Promise.all([
    initData(dataFilename),
    initUserConfig(userConfigFilename)
  ])
  var config = initConfig({
    data,
    dataFilename,
    persistentDirBasename,
    persistentDirname
  })
  for (var key in userConfig) {
    if (key in config) throw new Error(`invalid key ${key} in user config`)
    config[key] = userConfig[key]
  }
  return createState(config)
}

module.exports = init
