const request = require('supertest')
const app = require('../config/app')

describe('Json Parser Middleware', () => {
  test('Shoud parse body as JSON', async () => {
    app.post('/test_json_parser', (request, response) => {
      return response.json(request.body)
    })

    await request(app)
      .post('/test_json_parser')
      .send({ name: 'Oliver Creative' })
      .expect({ name: 'Oliver Creative' })
  })
})
