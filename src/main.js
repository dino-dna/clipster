'use strict'

const { clipboard, ipcMain } = require('electron')
const { isDev } = require('./contants')
var path = require('path')
var url = require('url')
var menubar = require('menubar')
const debug = require('debug')('clipster:main:main')

// var addon = require('../native')

if (isDev) require('electron-debug')({ showDevTools: true })

function toMessage (content) {
  // if is string...
  return { string: content }
}

var mb = menubar({
  get y () {
    var bounds = mb.tray.getBounds()
    if (bounds.y <= 0) return process.platform.match(/win\d+/) ? -1 * bounds.height : bounds.height
    return 0
  },
  index: isDev
    ? 'http://localhost:3000'
    : url.format({
      pathname: path.join(__dirname, 'index.html'),
      protocol: 'file:',
      slashes: true
    }),
  width: 500,
  height: 600
  // alwaysOnTop: true
})

mb.on('ready', async function ready () {
  debug('menubar:create-window')
  var history = [] // @TODO refresh from disk
  var maxHistoryLength = 100 // @TODO config option
  var lastClipboardContent = {}
  var isWindowOpen = false
  var lastSetFromUi = {}

  mb.on('create-window', () => {
    debug('menubar:create-window')
    ipcMain.on('webapp:ready', (event, arg) => {
      let msg = JSON.stringify(history)
      mb.window.webContents.executeJavaScript(`window.receive(${msg})`)
      isWindowOpen = true
    })
    ipcMain.on('webapp:setPasteText', (evt, text) => {
      lastSetFromUi = toMessage(text)
      clipboard.writeText(text)
    })
  })
  mb.on('after-create-window', () => {
    mb.window.setResizable(false)
    mb.window.setMovable(false)
  })
  mb.on('after-close', () => {
    isWindowOpen = false
  })
  function onNewClip (msg) {
    history.push(msg)
    if (history.length > maxHistoryLength) history.shift()
    if (isWindowOpen && mb.window) {
      mb.window.webContents.executeJavaScript(`window.receive(${JSON.stringify(msg)})`)
    }
  }
  function sniffForClipboardChanges () {
    // var currContent = addon.get_content()
    var currContent = clipboard.readText()
    var currString = currContent // eslint-disable-line
    debug(`curr: ${currString}, lastCB: ${lastClipboardContent.string}, lastSetFromUI: ${lastSetFromUi.string}`)
    if (
      !lastClipboardContent.string ||
      (
        currString !== lastClipboardContent.string &&
        currString !== lastSetFromUi.string &&
        lastClipboardContent.string !== lastSetFromUi.string
      )
    ) {
      debug(`new clip detected: ${currContent}`)
      let msg = toMessage(currContent)
      onNewClip(msg)
      lastClipboardContent = msg
    }
    setTimeout(sniffForClipboardChanges, 1000)
  }
  sniffForClipboardChanges()
})

module.exports = mb
