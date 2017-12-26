var menubar = require('menubar')
var { index, isDev } = require('../common/constants')
var { toMessage } = require('./clipboard')
var { clipboard, ipcMain } = require('electron')
var debug = require('debug')('clipster:main:menubar')
var isNil = require('lodash/isNil')

function createMenubar () {
  var mb = menubar({
    get y () {
      var bounds = mb.tray.getBounds()
      if (bounds.y <= 0) return process.platform.match(/win\d+/) ? -1 * bounds.height : bounds.height
      return 0
    },
    index,
    width: 500,
    height: 600,
    alwaysOnTop: !isDev
  })
  return mb
}

async function onReady ({ mb, state }) {
  debug('menubar:ready')
  state.isWindowOpen = false
  mb.on('create-window', () => {
    debug('menubar:create-window')
    ipcMain.on('webapp:ready', (event, arg) => {
      let msg = JSON.stringify(state.history)
      mb.window.webContents.executeJavaScript(`window.receive(${msg})`)
      state.isWindowOpen = true
    })
    ipcMain.on('webapp:setPasteText', (evt, text) => {
      state.lastSetFromUi = toMessage(text)
      clipboard.writeText(text)
    })
  })
  mb.on('after-create-window', () => {
    mb.window.setResizable(isDev)
    mb.window.setMovable(isDev)
  })
  mb.on('after-close', () => {
    state.isWindowOpen = false
  })

  state.lastClipboardContent = { string: clipboard.readText() }
  state.lastSetFromUi = {}
  function onNewClip (msg) {
    state.history.push(msg)
    if (state.history.length > state.maxHistoryLength) state.history.shift()
    if (state.isWindowOpen && mb.window) {
      mb.window.webContents.executeJavaScript(`window.receive(${JSON.stringify(msg)})`)
    }
  }
  function sniffForClipboardChanges () {
    // var currContent = addon.get_content()
    var currContent = clipboard.readText()
    var currString = currContent // eslint-disable-line
    debug(`curr: ${currString}, lastCB: ${state.lastClipboardContent.string}, state.lastSetFromUI: ${state.lastSetFromUi.string}`)
    if (
      isNil(state.lastClipboardContent.string) ||
      (
        currString !== state.lastClipboardContent.string &&
        currString !== state.lastSetFromUi.string &&
        state.lastClipboardContent.string !== state.lastSetFromUi.string
      )
    ) {
      debug(`new clip detected: ${currContent}`)
      let msg = toMessage(currContent)
      onNewClip(msg)
      state.lastClipboardContent = msg
    }
    setTimeout(sniffForClipboardChanges, 1000)
  }
  sniffForClipboardChanges()
}

module.exports = {
  createMenubar,
  onReady
}
