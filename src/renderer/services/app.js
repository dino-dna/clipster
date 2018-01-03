module.exports = {
  bus: null,
  isDev: !!(process.env.DEBUG || '').match(/clipster/) || !!(process.env.NODE_ENV || '').match(/dev/)
}
