var levels = [
  'debug',
  'verbose',
  'info',
  'warn',
  'error'
]
var logger = {}
function log (level) {
  console[level].apply(console, Array.from(arguments).slice(1))
}
levels.forEach(name => {
  logger[name] = (...args) => {
    log(name, ...args)
  }
})
module.exports = logger
