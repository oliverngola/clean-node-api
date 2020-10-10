const request = require('supertest')
let app

describe('Content-Type Middleware', () => {
  beforeEach(() => {
    jest.resetModules()
    app = require('../config/app')
  })

  test('Should return json content-type as default', async () => {
    app.get('/test_content_type', (request, response) => {
      return response.send('')
    })

    await request(app)
      .get('/test_content_type')
      .expect('content-type', /json/)
  })

  test('Should return xml content-type if forced', async () => {
    app.get('/test_content_type', (request, response) => {
      response.type('xml')
      return response.send('')
    })

    await request(app)
      .get('/test_content_type')
      .expect('content-type', /xml/)
  })
})
