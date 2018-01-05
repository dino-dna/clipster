var Menu = require('electron').Menu
var template = [
  // {role: 'services', submenu: []},
  { role: 'quit', label: 'Quit' }
]
var menu = Menu.buildFromTemplate(template)
module.exports = menu
