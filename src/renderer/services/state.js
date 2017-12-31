var moveItem = require('../../common/moveItem')
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
      return Object.assign({}, state, { history: state.history.concat(payload) })
    case BOOKMARK_CLIP:
      app.bus.bookmarkClip(payload)
      return state
    case MOVE_BOOKMARK_DOWN:
      app.bus.moveClip(payload, -1)
      return state
    case MOVE_BOOKMARK_UP:
      app.bus.moveClip(payload, 1)
      return state
    case DELETE_BOOKMARK:
      app.bus.deleteBookmark(payload)
      return { ...state, bookmarks: state.bookmarks.filter(item => item.id !== payload) }
    case DELETE_CLIP:
      app.bus.deleteFromHistory(payload)
      return { ...state, history: state.history.filter(item => item.id !== payload) }
    case MOVE_CLIP:
      app.bus.moveClip(payload)
      return { ...state, history: moveItem(state.history, payload.id, payload.dir) }
    case SET_CLIPS:
      return Object.assign({}, state, { history: payload })
    case SELECT_CLIP:
      app.bus.setClipboard(payload.string)
      return state
    case SET_BOOKMARKS:
      return { ...state, bookmarks: payload }
    case SET_ROUTE:
      return { ...state, route: payload }
    default:
      throw new Error(`unhandled message: ${msg}`)
  }
}

var update = (msg, payload) => {
  var lastState
  if (app.isDev) lastState = JSON.parse(JSON.stringify(state))
  state = _update(msg, payload)
  for (var l in listeners) {
    listeners[l](state)
  }
  if (app.isDev)logger.info('(pre) STATE:', lastState, '(post) STATE:', state)
  return state
}

var onUpdate = (cb) => listeners.push(cb)

var BOOKMARK_CLIP = 'BOOKMARK_CLIP'
var DELETE_BOOKMARK = 'DELETE_BOOKMARK'
var DELETE_CLIP = 'DELETE_CLIP'
var ADD_CLIP = 'ADD_CLIP'
var MOVE_CLIP = 'MOVE_CLIP'
var MOVE_BOOKMARK_UP = 'MOVE_BOOKMARK_UP'
var MOVE_BOOKMARK_DOWN = 'MOVE_BOOKMARK_DOWN'
var SET_CLIPS = 'SET_CLIPS'
var SELECT_CLIP = 'SELECT_CLIP'
var SET_BOOKMARKS = 'SET_BOOKMARKS'
var SET_ROUTE = 'SET_ROUTE'

module.exports = {
  onUpdate,
  state,
  update,
  messages: {
    BOOKMARK_CLIP,
    DELETE_BOOKMARK,
    DELETE_CLIP,
    ADD_CLIP,
    MOVE_CLIP,
    SET_CLIPS,
    SELECT_CLIP,
    SET_BOOKMARKS,
    SET_ROUTE
  }
}
