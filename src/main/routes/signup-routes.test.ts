import app from '../config/app'
import request from 'supertest'

describe('Signup Routes', () => {
  test('Should return an account on success', async () => {
    await request(app)
      .post('/api/signup')
      .send({
        name: 'Hélion Porto',
        email: 'helionporto@gmail.com',
        password: '123',
        passwordConfirm: '123'
      })
      .expect(200)
  })
})
