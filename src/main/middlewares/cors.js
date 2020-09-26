module.exports = (request, response, next) => {
  response.set('access-origin-allow-control', '*')
  response.set('access-origin-allow-methods', '*')
  response.set('access-origin-allow-headers', '*')
  next()
}
