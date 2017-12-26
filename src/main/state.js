var debug = require('debug')('clipster:state')

function createState () {
  var stateHandler = {
    set (obj, key, value) {
      debug(`${key}: ${value}`)
      obj[key] = value
      return true
    }
  }
  return new Proxy({}, stateHandler)
}

module.exports = createState
