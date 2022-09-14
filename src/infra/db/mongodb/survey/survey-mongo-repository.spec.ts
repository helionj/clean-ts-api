import { Collection } from 'mongodb'
import { MongoHelper } from '../helpers/mongo-helper'
import { SurveyMongoRepository } from './survey-mongo-repository'

let surveyCollection: Collection

const makeSut = (): SurveyMongoRepository => {
  return new SurveyMongoRepository()
}

describe('Survey Mongo repository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })
  beforeEach(async () => {
    surveyCollection = await MongoHelper.getCollection('surveys')
    await surveyCollection.deleteMany({})
  })

  test('Should add a survey on add success', async () => {
    const sut = makeSut()
    await sut.add(
      {
        question: 'any-question',
        answers: [
          {
            image: 'any-image',
            answer: 'any-answer'
          },
          {
            answer: 'other-answer'
          }
        ]
      }
    )
    const survey = await surveyCollection.findOne({ question: 'any-question' })
    expect(survey).toBeTruthy()
  })
})
