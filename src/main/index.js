'use strict'

require('perish')
var { isDev } = require('../common/constants')
var debug = require('debug')('clipster:main:index')
if (isDev) require('electron-debug')({ showDevTools: true })
var { createMenubar, onReady } = require('./menubar')
var init = require('./init')
var autoUpdater = require('electron-updater').autoUpdater
autoUpdater.checkForUpdatesAndNotify()

async function run () {
  debug('initialing')
  var state = await init()
  debug('creating menubar')
  var mb = createMenubar()
  if (mb.app.isReady()) {
    onReady({ mb, state })
  } else {
    mb.on('ready', () => {
      onReady({ mb, state })
    })
  }
}

run()
