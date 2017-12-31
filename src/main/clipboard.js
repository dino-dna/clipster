var { clipboard } = require('electron')
var isNil = require('lodash/isNil')
var debug = require('debug')('clipster:main:clipboard')
var { Random, Entropy } = require('entropy-string')

var random = new Random()
var bits = Entropy.bits(1e6, 1e9)

function toMessage (str) {
  return {
    id: random.string(bits),
    string: str
  }
}

var state = {
  curr: null,
  prev: null
}

function sniffForClipboardChanges (onNewClip) {
  state.curr = clipboard.readText()
  if (isNil(state.last)) state.last = state.curr
  if (
    state.curr !== state.last
  ) {
    // && state.last.string !== state.lastSetFromUi.string
    // state.current !== state.lastSetFromUi.string &&
    debug(`new clip detected: ${state.curr}`)
    var msg = toMessage(state.curr)
    onNewClip(msg)
    state.last = state.curr
  }
  setTimeout(() => sniffForClipboardChanges(onNewClip), 1000)
}

/**
 *
 * @param {Function} cb called back with clipboard content
 */
function onChange (cb) {
  sniffForClipboardChanges(cb)
}

module.exports = {
  onChange
}
