class EmailValidator {
  isValid (email) {
    return true
  }
}

describe('Email Validator', () => {
  test('Should returns true if validator returns true', () => {
    const sut = new EmailValidator()
    const isEmailValid = sut.isValid('valid_email@gmail.com')
    expect(isEmailValid).toBe(true)
  })
})
