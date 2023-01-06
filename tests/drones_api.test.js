const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)

test('blogs are returned as xml', async () => {
  await api.get('/')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})
