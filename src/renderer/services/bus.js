var { ipcRenderer } = require('electron')
var logger = require('./logger')

module.exports = function createBus (state) {
  window.receive = function (msg) {
    logger.info(`${msg.action} [from main]`, msg.payload)
    return state.update(state.messages[msg.action], msg.payload)
  }
  var bus = {
    bookmarkClip (payload) {
      ipcRenderer.send('webapp:bookmarkClip', payload)
    },
    setClipboard (payload) {
      ipcRenderer.send('webapp:setPasteText', payload)
    },
    deleteBookmark (id) {
      ipcRenderer.send('webapp:deleteBookmark', id)
    },
    deleteFromHistory (id) {
      ipcRenderer.send('webapp:deleteFromHistory', id)
    },
    moveClip ({ id, dir }) {
      ipcRenderer.send('webapp:moveClip', { id, dir })
    }
  }
  return bus
}
