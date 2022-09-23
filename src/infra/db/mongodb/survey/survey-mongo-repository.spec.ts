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

  describe('add', () => {
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
          ],
          date: new Date()
        }
      )
      const survey = await surveyCollection.findOne({ question: 'any-question' })
      expect(survey).toBeTruthy()
    })
  })
  describe('load', () => {
    test('Should load a list of surveys on success', async () => {
      await surveyCollection.insertMany([
        {
          question: 'any-question',
          answers: [
            {
              image: 'any-image',
              answer: 'any-answer'
            }
          ],
          date: new Date()
        },
        {
          question: 'other-question',
          answers: [
            {
              image: 'other-image',
              answer: 'other-answer'
            }
          ],
          date: new Date()
        }
      ]
      )
      const sut = makeSut()
      const surveys = await sut.load()
      expect(surveys.length).toBe(2)
      expect(surveys[0].question).toEqual('any-question')
      expect(surveys[1].question).toEqual('other-question')
    })
    test('Should load a list empty', async () => {
      const sut = makeSut()
      const surveys = await sut.load()
      expect(surveys.length).toBe(0)
    })
  })
})
