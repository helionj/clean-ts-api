import app from '../config/app'
import request from 'supertest'
import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo-helper'
import { Collection } from 'mongodb'
import { sign } from 'jsonwebtoken'
import env from '../config/env'

let surveyCollection: Collection
let accountCollection: Collection

describe('Survey Routes', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })
  beforeEach(async () => {
    surveyCollection = await MongoHelper.getCollection('surveys')
    accountCollection = await MongoHelper.getCollection('accounts')
    await surveyCollection.deleteMany({})
  })
  describe('POST /surveys', () => {
    test('Should return 403 on add survey without a token', async () => {
      await request(app)
        .post('/api/surveys')
        .send({
          question: 'Question 1',
          answers: [
            {
              image: 'http://image-bank/image1.jpg',
              answer: 'Answer 1'
            },
            {
              answer: 'Answer 2'
            }
          ]
        })
        .expect(403)
    })
    test('Should return 204 on add survey with a valic accessToken', async () => {
      const result = await accountCollection.insertOne({
        name: 'Hélion Porto',
        email: 'helionporto@gmail.com',
        password: '123',
        role: 'admin'
      })
      const { insertedId: id } = result
      const accessToken = sign({ insertedId: id }, env.jwtSecret)
      await accountCollection.updateOne({
        _id: id
      }, { $set: { accessToken } })

      await request(app)
        .post('/api/surveys')
        .set('x-accessToken', accessToken)
        .send({
          question: 'Question 1',
          answers: [
            {
              image: 'http://image-bank/image1.jpg',
              answer: 'Answer 1'
            },
            {
              answer: 'Answer 2'
            }
          ]
        })
        .expect(403)
    })
  })
})
