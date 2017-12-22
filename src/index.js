import './main.css'
import { Main } from './Main.elm'
import registerServiceWorker from './registerServiceWorker'
import 'typicons.font'
import '../node_modules/skeleton-css/css/normalize.css'
import '../node_modules/skeleton-css/css/skeleton.css'

const { ipcRenderer } = require('electron')
const debug = require('debug')('clipster:renderer:index')

const app = Main.embed(document.getElementById('root'))

app.ports.setPaste.subscribe(text => {
  debug(`sending clip selection to main: ${text.substr(0, 20)}${text.length > 20 ? '...' : ''}`)
  ipcRenderer.send('webapp:setPasteText', text)
})

window.receive = function (msg) {
  debug('message received from main')
  if (Array.isArray(msg)) return app.ports.clipboardEvents.send(msg)
  return app.ports.clipboardEvent.send(msg)
}
registerServiceWorker()
ipcRenderer.send('webapp:ready', true)
