import app from '../config/app'
import request from 'supertest'
import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo-helper'

describe('Survey Routes', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })
  describe('PUT /surveys/:surveyId/results', () => {
    test('Should return 403 on save survey without a token', async () => {
      await request(app)
        .put('/api/surveys/:surveyId/results')
        .send({
          answer: 'any-answer'
        })
        .expect(403)
    })
  })
})
