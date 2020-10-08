const AuthUseCase = require('../../domain/usecases/auth-usecase')
const LoginRouter = require('../../presentation/routers/login-router')
const EmailValidator = require('../../utils/helpers/email-validator')
const LoadUserByEmailRepository = require('../../infra/repositories/load-user-by-email-repository')
const UpdateAcessTokenRepository = require('../../infra/repositories/update-access-token-repository')
const Encrypter = require('../../utils/helpers/encrypter')
const TokenGenerator = require('../../utils/helpers/token-generator')
const { tokenSecret } = require('../config/env')

const loadUserByEmailRepository = new LoadUserByEmailRepository()
const updateAcessTokenRepository = new UpdateAcessTokenRepository()
const encrypter = new Encrypter()
const tokenGenerator = new TokenGenerator(tokenSecret)
const emailValidator = new EmailValidator()
const authUseCase = new AuthUseCase({
  loadUserByEmailRepository,
  updateAcessTokenRepository,
  encrypter,
  tokenGenerator
})
const loginRouter = new LoginRouter({
  authUseCase,
  emailValidator
})

module.exports = loginRouter
