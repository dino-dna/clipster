var { clipboard } = require('electron')

function toMessage (content) {
  // if is string...
  return { string: content }
}

module.exports = {
  toMessage
}
