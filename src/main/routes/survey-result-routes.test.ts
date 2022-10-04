import app from '../config/app'
import request from 'supertest'
import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo-helper'
import { sign } from 'jsonwebtoken'
import env from '../config/env'
import { Collection } from 'mongodb'

let surveyCollection: Collection
let accountCollection: Collection

const makeAccessToken = async (): Promise<string> => {
  const result = await accountCollection.insertOne({
    name: 'Hélion Porto',
    email: 'helionporto@gmail.com',
    password: '123'
  })
  const id = result.insertedId
  const accessToken = sign({ id }, env.jwtSecret)
  await accountCollection.updateOne({
    _id: id
  }, { $set: { accessToken } })
  return accessToken
}

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
  describe('PUT /surveys/:surveyId/results', () => {
    test('Should return 403 on save survey without a accesstoken', async () => {
      await request(app)
        .put('/api/surveys/:surveyId/results')
        .send({
          answer: 'any-answer'
        })
        .expect(403)
    })
    test('Should return 200 on save survey  result with a accesstoken', async () => {
      const res = await surveyCollection.insertOne(
        {
          question: 'Question 1',
          answers: [
            {
              image: 'http://image-bank/image1.jpg',
              answer: 'Answer 1'
            },
            {
              answer: 'Answer 2'
            }
          ],
          date: new Date()
        }
      )
      const id = res.insertedId.toHexString()
      const accessToken = await makeAccessToken()
      await request(app)
        .put(`/api/surveys/${id}/results`)
        .set('x-access-token', accessToken)
        .send({
          answer: 'Answer 1'
        })
        .expect(200)
    })
  })
})
