import app from '../config/app'
import request from 'supertest'
import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo-helper'
import { Collection } from 'mongodb'
import { hash } from 'bcrypt'

let accountCollection: Collection

describe('Login Routes', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })
  beforeEach(async () => {
    accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })
  describe('POST /signup', () => {
    test('Should return 200 on signup success', async () => {
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
  describe('POST /login', () => {
    test('Should return 200 on login success', async () => {
      const password = await hash('123', 12)
      await accountCollection.insertOne({
        name: 'Hélion Porto',
        email: 'helionporto@gmail.com',
        password
      })
      await request(app)
        .post('/api/login')
        .send({
          email: 'helionporto@gmail.com',
          password: '123'
        })
        .expect(200)
    })
  })
  test('Should return 401 when invalid credentials', async () => {
    await request(app)
      .post('/api/login')
      .send({
        email: 'helionporto@gmail.com',
        password: '123'
      })
      .expect(401)
  })
})
