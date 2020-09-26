const request = require('supertest')
const app = require('./app')

describe('App test', () => {
  test('Should disable x-powered-by header', async () => {
    app.get('/test_x_powered_by', (req, res) => {
      return res.json({})
    })

    const response = await request(app).get('/test_x_powered_by')
    expect(response.headers['x-powered-by']).toBeUndefined()
  })
})
