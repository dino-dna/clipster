var isObjectLike = require('lodash/isObjectLike')
var debug = require('debug')('clipster:state')
var fs = require('fs')
var btoa = require('abab').btoa
var debounce = require('lodash/debounce')
var { isDev } = require('../common/constants')

/**
 * @param {Config} config
 */
function createState (state) {
  async function flushData (opts) {
    var { sync } = opts || {}
    var serialized = JSON.parse(JSON.stringify(state.data))
    ;['history', 'bookmarks'].map(key => {
      serialized[key].map(item => {
        if (item.string) item.string = btoa(item.string)
        return item
      })
    })
    await fs[sync ? 'writeFileSync' : 'writeFile'](
      state.dataFilename,
      JSON.stringify(serialized, null, 2)
    )
  }
  var debouncedFlushData = debounce(flushData, isDev ? 0 : 10000)

  /**
   * An overly complicated way to automatically flush our state data to disk
   * as changes to the data occur. Essentially, on any changes to our data, set
   * the new value, and trigger a flush to disk by intercepting updates to the
   * data using `Proxy` instances.
   * @param {*} value field to proxy
   */
  function createFieldProxy (value) {
    if (value.__isProxy) return value
    var p = new Proxy(value, {
      set (obj, key, value) {
        if (key === 'length') return true
        obj[key] = value
        debouncedFlushData()
        return true
      },
      deleteProperty (obj, key) {
        delete obj[key]
        debouncedFlushData()
      }
    })
    p.__isProxy = true
    return p
  }

  process.on('exit', () => flushData({ sync: true }))

  // prep state for entry into main program
  state.data.history = createFieldProxy(state.data.history)
  state.data.bookmarks = createFieldProxy(state.data.bookmarks)
  state.data = new Proxy(state.data, {
    set (obj, key, value) {
      debug(`${key}: ${value}`)
      obj[key] = isObjectLike(value) ? createFieldProxy(value) : value
      debouncedFlushData()
      return true
    }
  })
  return state
}

module.exports = createState
