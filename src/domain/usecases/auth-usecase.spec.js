const AuthUseCase = require('./auth-usecase')
const { MissingParamError } = require('../../utils/errors')

const makeEncrypter = () => {
  class EncrypterSy {
    async compare (password, hashedPassword) {
      this.password = password
      this.hashedPassword = hashedPassword
      return this.isValid
    }
  }

  const encrypterSpy = new EncrypterSy()
  encrypterSpy.isValid = true
  return encrypterSpy
}

const makeEncrypterWithError = () => {
  class EncrypterSpy {
    async compare () {
      throw new Error()
    }
  }

  return new EncrypterSpy()
}

const makeTokenGenerator = () => {
  class TokenGeneratorSpy {
    async generate (userId) {
      this.userId = userId
      return this.accessToken
    }
  }

  const tokenGeneratorSpy = new TokenGeneratorSpy()
  tokenGeneratorSpy.accessToken = 'any_token'
  return tokenGeneratorSpy
}

const makeTokenGeneratorWithError = () => {
  class TokenGeneratorSpy {
    async generate () {
      throw new Error()
    }
  }

  return new TokenGeneratorSpy()
}

const makeLoadUserByEmailRepository = () => {
  class LoadUserByEmailRepositorySpy {
    async load (email) {
      this.email = email
      return this.user
    }
  }

  const loadUserByEmailRepositorySpy = new LoadUserByEmailRepositorySpy()
  loadUserByEmailRepositorySpy.user = {
    id: 'any_id',
    password: 'hashed_password'
  }

  return loadUserByEmailRepositorySpy
}

const makeLoadUserByEmailRepositoryWithError = () => {
  class LoadUserByEmailRepositorySpy {
    async load () {
      throw new Error()
    }
  }

  return new LoadUserByEmailRepositorySpy()
}

const makeUpdateAcessTokenRepository = () => {
  class UpdateAcessTokenRepositorySpy {
    async update (userId, acessToken) {
      this.userId = userId
      this.acessToken = acessToken
    }
  }

  return new UpdateAcessTokenRepositorySpy()
}

const makeUpdateAcessTokenRepositoryWithError = () => {
  class UpdateAcessTokenRepositorySpy {
    async update () {
      throw new Error()
    }
  }

  return new UpdateAcessTokenRepositorySpy()
}

const makeSut = () => {
  const loadUserByEmailRepositorySpy = makeLoadUserByEmailRepository()
  const updateAcessTokenRepositorySpy = makeUpdateAcessTokenRepository()
  const encrypterSpy = makeEncrypter()
  const tokenGeneratorSpy = makeTokenGenerator()
  const sut = new AuthUseCase({
    loadUserByEmailRepository: loadUserByEmailRepositorySpy,
    updateAcessTokenRepository: updateAcessTokenRepositorySpy,
    encrypter: encrypterSpy,
    tokenGenerator: tokenGeneratorSpy
  })

  return { sut, loadUserByEmailRepositorySpy, updateAcessTokenRepositorySpy, encrypterSpy, tokenGeneratorSpy }
}

describe('Auth UseCase', () => {
  test('Should throw if no email is provided', async () => {
    const { sut } = makeSut()
    const promise = sut.auth()
    expect(promise).rejects.toThrow(new MissingParamError('email'))
  })

  test('Should throw if no password is provided', async () => {
    const { sut } = makeSut()
    const promise = sut.auth('any_email@gmail.com')
    expect(promise).rejects.toThrow(new MissingParamError('password'))
  })

  test('Should call LoadUserByEmailRepository with correct email', async () => {
    const { sut, loadUserByEmailRepositorySpy } = makeSut()
    await sut.auth('any_email@gmail.com', 'any_password')
    expect(loadUserByEmailRepositorySpy.email).toBe('any_email@gmail.com')
  })

  test('Should return null if an invalid email is provided', async () => {
    const { sut, loadUserByEmailRepositorySpy } = makeSut()
    loadUserByEmailRepositorySpy.user = null
    const accessToken = await sut.auth('invalid_email@gmail.com', 'any_password')
    expect(accessToken).toBeNull()
  })

  test('Should return null if an invalid password is provided', async () => {
    const { sut, encrypterSpy } = makeSut()
    encrypterSpy.isValid = false
    const accessToken = await sut.auth('valid_email@gmail.com', 'invalid_password')
    expect(accessToken).toBeNull()
  })

  test('Should calls Encrypter with correct values', async () => {
    const { sut, loadUserByEmailRepositorySpy, encrypterSpy } = makeSut()
    await sut.auth('valid_email@gmail.com', 'any_password')
    expect(encrypterSpy.password).toBe('any_password')
    expect(encrypterSpy.hashedPassword).toBe(loadUserByEmailRepositorySpy.user.password)
  })

  test('Should call TokenGenerator with correct userId', async () => {
    const { sut, loadUserByEmailRepositorySpy, tokenGeneratorSpy } = makeSut()
    await sut.auth('valid_email@gmail.com', 'valid_password')
    expect(tokenGeneratorSpy.userId).toBe(loadUserByEmailRepositorySpy.user._id)
  })

  test('Should return an acessToken if correct credencial are provided', async () => {
    const { sut, tokenGeneratorSpy } = makeSut()
    const acessToken = await sut.auth('valid_email@gmail.com', 'valid_password')
    expect(acessToken).toBe(tokenGeneratorSpy.accessToken)
    expect(acessToken).toBeTruthy()
  })

  test('Should call UpdateAcessTokenRepository with correct values', async () => {
    const { sut, loadUserByEmailRepositorySpy, updateAcessTokenRepositorySpy, tokenGeneratorSpy } = makeSut()
    await sut.auth('valid_email@gmail.com', 'valid_password')
    expect(updateAcessTokenRepositorySpy.userId).toBe(loadUserByEmailRepositorySpy.user._id)
    expect(updateAcessTokenRepositorySpy.acessToken).toBe(tokenGeneratorSpy.accessToken)
  })

  test('Should throws if invalid dependencies are provided', async () => {
    const invalid = {}
    const loadUserByEmailRepository = makeLoadUserByEmailRepository()
    const encrypter = makeEncrypter()
    const tokenGenerator = makeTokenGenerator()

    const suts = [].concat(
      new AuthUseCase(),
      new AuthUseCase({
        loadUserByEmailRepository: null
      }),
      new AuthUseCase({ loadUserByEmailRepository: invalid }),
      new AuthUseCase({
        loadUserByEmailRepository,
        encrypter: null
      }),
      new AuthUseCase({
        loadUserByEmailRepository,
        encrypter: invalid
      }),
      new AuthUseCase({
        loadUserByEmailRepository,
        encrypter,
        tokenGenerator: null
      }),
      new AuthUseCase({
        loadUserByEmailRepository,
        encrypter,
        tokenGenerator: invalid
      }),
      new AuthUseCase({
        loadUserByEmailRepository,
        updateAcessTokenRepository: null,
        encrypter,
        tokenGenerator
      }),
      new AuthUseCase({
        loadUserByEmailRepository,
        updateAcessTokenRepository: invalid,
        encrypter,
        tokenGenerator
      })
    )

    for (const sut of suts) {
      const promise = sut.auth('any_email@gmail.com', 'any_password')
      expect(promise).rejects.toThrow()
    }
  })

  test('Should throws if any dependency throws', async () => {
    const loadUserByEmailRepository = makeLoadUserByEmailRepository()
    const encrypter = makeEncrypter()
    const tokenGenerator = makeTokenGenerator()

    const suts = [].concat(
      new AuthUseCase({
        loadUserByEmailRepository: makeLoadUserByEmailRepositoryWithError()
      }),
      new AuthUseCase({
        loadUserByEmailRepository,
        encrypter: makeEncrypterWithError()
      }),
      new AuthUseCase({
        loadUserByEmailRepository,
        encrypter,
        tokenGenerator: makeTokenGeneratorWithError()
      }),
      new AuthUseCase({
        loadUserByEmailRepository,
        updateAcessTokenRepository: makeUpdateAcessTokenRepositoryWithError(),
        encrypter,
        tokenGenerator
      })
    )

    for (const sut of suts) {
      const promise = sut.auth('any_email@gmail.com', 'any_password')
      expect(promise).rejects.toThrow()
    }
  })
})
