// var moveItem = require('../../common/moveItem')
var app = require('./app')
var logger = require('./logger')
var listeners = []

var state = {
  route: '/',
  bookmarks: [],
  history: []
}

var _update = (msg, payload) => {
  switch (msg) {
    case ADD_CLIP:
      return { ...state, history: state.history.concat(payload) }
    case BOOKMARK_CLIP:
      app.bus.bookmarkClip(payload)
      return { ...state }
    case DELETE_BOOKMARK:
      app.bus.deleteBookmark(payload)
      return { ...state }
    case DELETE_CLIP:
      app.bus.deleteFromHistory(payload)
      return { ...state }
    case MOVE_BOOKMARK:
      app.bus.moveBookmark(payload)
      return { ...state }
    case MOVE_CLIP:
      app.bus.moveClip(payload)
      return { ...state }
    case SET_CLIPS:
      return { ...state, history: payload }
    case SELECT_CLIP:
      app.bus.setClipboard(payload.string)
      return { ...state }
    case SET_BOOKMARKS:
      return { ...state, bookmarks: payload }
    case SET_CONFIGURATION:
      return { ...state, config: payload }
    case SET_ROUTE:
      return { ...state, route: payload }
    case UPDATE_CONFIGURATION:
      app.bus.updateConfiguration(payload)
      return { ...state }
    default:
      throw new Error(`unhandled message: ${msg}`)
  }
}

var update = (msg, payload) => {
  var lastState
  if (app.isDev) lastState = JSON.parse(JSON.stringify(state))
  state = _update(msg, payload)
  for (var l in listeners) listeners[l](state)
  if (app.isDev) logger.info('(pre) STATE:', lastState, '(post) STATE:', state)
  return state
}

var onUpdate = (cb) => listeners.push(cb)

var BOOKMARK_CLIP = 'BOOKMARK_CLIP'
var DELETE_BOOKMARK = 'DELETE_BOOKMARK'
var DELETE_CLIP = 'DELETE_CLIP'
var ADD_CLIP = 'ADD_CLIP'
var MOVE_CLIP = 'MOVE_CLIP'
var MOVE_BOOKMARK = 'MOVE_BOOKMARK'
var SET_CLIPS = 'SET_CLIPS'
var SELECT_CLIP = 'SELECT_CLIP'
var SET_BOOKMARKS = 'SET_BOOKMARKS'
var SET_CONFIGURATION = 'SET_CONFIGURATION'
var SET_ROUTE = 'SET_ROUTE'
var UPDATE_CONFIGURATION = 'UPDATE_CONFIGURATION'

module.exports = {
  onUpdate,
  state,
  update,
  messages: {
    ADD_CLIP,
    BOOKMARK_CLIP,
    DELETE_BOOKMARK,
    DELETE_CLIP,
    MOVE_BOOKMARK,
    MOVE_CLIP,
    SET_CLIPS,
    SELECT_CLIP,
    SET_BOOKMARKS,
    SET_CONFIGURATION,
    SET_ROUTE,
    UPDATE_CONFIGURATION
  }
}
