var menubar = require('menubar')
var { index, isDev } = require('../common/constants')
var { onChange: onClipboardChange } = require('./clipboard')
var { clipboard: systemClipboard, ipcMain } = require('electron')
var debug = require('debug')('clipster:main:menubar')
var path = require('path')
var moveItem = require('../common/moveItem')
var contextMenu = require('./context-menu')

function createMenubar () {
  var mb = menubar({
    get y () {
      // offset the window s.t. the bar does not cover the app
      var bounds = mb.tray.getBounds()
      if (bounds.y <= 0) return process.platform.match(/win\d+/) ? -1 * bounds.height : bounds.height
      return 0
    },
    dir: path.resolve(__dirname),
    index,
    width: 500,
    height: 600,
    alwaysOnTop: !isDev
  })
  return mb
}

async function onReady ({ mb, state }) {
  mb.tray.on('right-click', () => {
    mb.tray.popUpContextMenu(contextMenu)
  })
  function sendClips () {
    var msg = JSON.stringify({
      action: 'SET_CLIPS',
      payload: state.data.history
    })
    mb.window.webContents.executeJavaScript(`window.receive(${msg})`)
  }
  function sendBookmarks () {
    var msg = JSON.stringify({
      action: 'SET_BOOKMARKS',
      payload: state.data.bookmarks
    })
    mb.window.webContents.executeJavaScript(`window.receive(${msg})`)
  }
  function sendConfig () {
    var msg = JSON.stringify({
      action: 'SET_CONFIGURATION',
      payload: state.data.config
    })
    mb.window.webContents.executeJavaScript(`window.receive(${msg})`)
  }
  function refreshUiState () {
    sendClips()
    sendBookmarks()
    sendConfig()
  }

  debug('menubar:ready')
  mb.on('create-window', () => {
    debug('menubar:create-window')
    ipcMain.on('webapp:ready', refreshUiState)
    ipcMain.on('webapp:bookmarkClip', (evt, newBookmark) => {
      state.uiLastBookmarkId = newBookmark.id
      state.data.bookmarks = state.data.bookmarks.filter(bookmark => bookmark.id !== newBookmark.id)
      state.data.bookmarks.unshift(newBookmark)
      sendBookmarks()
    })
    ipcMain.on('webapp:setPasteText', (evt, text) => {
      state.uiSelectedMsg = text
      systemClipboard.writeText(text)
      // setTimeout(() => mb.window.hide(), 300)
    })
    ipcMain.on('webapp:deleteBookmark', (evt, id) => {
      state.data.bookmarks = state.data.bookmarks.filter(item => item.id !== id)
      sendBookmarks()
    })
    ipcMain.on('webapp:deleteFromHistory', (evt, id) => {
      state.data.history = state.data.history.filter(item => item.id !== id)
      sendClips()
    })
    ipcMain.on('webapp:moveBookmark', (evt, payload) => {
      var { id, dir } = payload
      state.data.bookmarks = moveItem(state.data.bookmarks, id, dir)
      sendBookmarks()
    })
    ipcMain.on('webapp:moveClip', (evt, payload) => {
      var { id, dir } = payload
      state.data.history = moveItem(state.data.history, id, dir)
      sendClips()
    })
    ipcMain.on('webapp:updateConfiguration', (evt, payload) => {
      var { name, value } = payload
      if (name === 'saveHistory' && payload === true) {
        state.data.config.__permitOneTimeSave = true
      }
      state.data.config[name] = !value
      sendConfig()
    })
  })
  mb.on('after-create-window', () => {
    mb.window.setResizable(isDev)
    mb.window.setMovable(isDev)
  })

  onClipboardChange(function onNewClip (msg) {
    if (msg.string === state.uiSelectedMsg) {
      // @TODO we expect one change event here as we ourselves just wrote to
      // the clipboard.  perhaps hackishly, catch that first case, but let
      // future copies of that same text thru
      state.uiSelectedMsg = null
      return
    }
    state.data.history.unshift(msg)
    if (state.data.history.length > state.maxHistoryLength) state.data.history.pop()
    refreshUiState()
  })
}

module.exports = {
  createMenubar,
  onReady
}
