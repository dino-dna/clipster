var findIndex = require('lodash/findIndex')

module.exports = function moveItem (collection, id, dir) {
  if (!collection.length || collection.length === 1) return collection
  var currNdx = findIndex(collection, item => item.id === id)
  var targetNdx = currNdx + dir
  if (!collection[targetNdx]) return collection // out-of-bounds! noop.
  var temp = collection[targetNdx]
  collection[targetNdx] = collection[currNdx]
  collection[currNdx] = temp
  return collection
}
