import app from '../config/app'
import request from 'supertest'
import { MongoHelper } from '../../infra/criptography/db/mongodb/helpers/mongo-helper'

describe('Signup Routes', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })
  beforeEach(async () => {
    const accountCollection = MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })
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
