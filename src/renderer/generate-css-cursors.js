function createCursor (size, font) {
  var canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  var ctx = canvas.getContext('2d')
  ctx.fillStyle = '#000000'
  ctx.font = `${size}px ${font}`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText('\uf002', size / 2, size / 2)
  var dataURL = canvas.toDataURL('image/png')
  console.log('css:')
  console.log(`    url(${dataURL}), auto`)
}
