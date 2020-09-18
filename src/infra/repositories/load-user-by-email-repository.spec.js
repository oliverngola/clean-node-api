class LoadUserByEmailRepository {
  async load (email) {
    return null
  }
}

describe('LoadUserByEmail Repository', () => {
  test('Should returns null if no user is found', async () => {
    const sut = new LoadUserByEmailRepository()
    const user = await sut.load('invalid_emai@gmail.com')
    expect(user).toBeNull()
  })
})
