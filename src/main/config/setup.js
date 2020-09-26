module.exports = app => {
  app.disable('x-powered-by')
  app.use((request, response, next) => {
    response.set('access-origin-allow-control', '*')
    response.set('access-origin-allow-methods', '*')
    response.set('access-origin-allow-headers', '*')
    next()
  })
}
