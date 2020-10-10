const LoginRouterComposer = require('../composers/login-router-composer')
const { adpt } = require('../adapters/express-router-adapter')

module.exports = router => {
  router.post('/login', adpt(LoginRouterComposer.compose))
}
