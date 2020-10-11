const request = require('supertest')
const bcrypt = require('bcrypt')
const app = require('../config/app')
const MongoHelper = require('../../infra/helpers/mongo-helper')
let userModel

describe('Login Routes', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
    userModel = await MongoHelper.getCollection('users')
  })

  beforeEach(async () => {
    await userModel.deleteMany()
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  test('Should return 200 when valid credencials are provided', async () => {
    await userModel.insertOne({
      email: 'valid_email@gmail.com',
      password: bcrypt.hashSync('hashed_password', 10)
    })

    await request(app)
      .post('/api/login')
      .send({
        email: 'valid_email@gmail.com',
        password: 'hashed_password'
      })
      .expect(200)
  })

  test('Should return 401 when invalid credencials are provided', async () => {
    await request(app)
      .post('/api/login')
      .send({
        email: 'valid_email@gmail.com',
        password: 'hashed_password'
      })
      .expect(401)
  })
})
