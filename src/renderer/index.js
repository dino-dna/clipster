// renderer index
import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import registerServiceWorker from './registerServiceWorker'
import './main.css'
import 'typicons.font'
import '../../node_modules/skeleton-css/css/normalize.css'
import '../../node_modules/skeleton-css/css/skeleton.css'

var app = require('./services/app')
var { ipcRenderer } = require('electron')
var stateService = require('./services/state')
var { onUpdate: onStateUpdate, state, update, messages } = stateService
app.bus = require('./services/bus')(stateService)
function render (state) {
  return ReactDOM.render(
    <App {...state} update={update} messages={messages} />,
    document.getElementById('root')
  )
}
onStateUpdate(render)
render(state)

registerServiceWorker()
ipcRenderer.send('webapp:ready', true)
