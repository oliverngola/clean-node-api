const validator = require('validator')

class EmailValidator {
  isValid (email) {
    return validator.isEmail(email)
  }
}

describe('Email Validator', () => {
  test('Should returns true if validator returns true', () => {
    const sut = new EmailValidator()
    const isEmailValid = sut.isValid('valid_email@gmail.com')
    expect(isEmailValid).toBe(true)
  })

  test('Should returns false if validator returns true', () => {
    validator.isEmailValid = false
    const sut = new EmailValidator()
    const isEmailValid = sut.isValid('invalid_email@gmail.com')
    expect(isEmailValid).toBe(false)
  })
})