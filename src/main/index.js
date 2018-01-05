'use strict'

require('perish')
var { isDev, isProductionBuild } = require('../common/constants')
var debug = require('debug')('clipster:main:index')
var { createMenubar, onReady } = require('./menubar')
var init = require('./init')
var autoUpdater = require('electron-updater').autoUpdater
if (!isProductionBuild && isDev) require('electron-debug')({ showDevTools: true })

autoUpdater.checkForUpdatesAndNotify()

async function run () {
  debug('initializing')
  var state = await init()
  debug('creating menubar')
  var mb = createMenubar()
  if (mb.app.isReady()) return onReady({ mb, state })
  return mb.on('ready', () => onReady({ mb, state }))
}

run()
