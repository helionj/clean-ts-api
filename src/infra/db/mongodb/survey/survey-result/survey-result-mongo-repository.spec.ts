import { Collection } from 'mongodb'
import { SurveyModel } from '../../../../../domain/models/survey'
import { MongoHelper } from '../../helpers/mongo-helper'
import { SurveyResultMongoRepository } from './survey-result-mongo-repository'
import { AccountModel } from '../../../../../domain/models/account'

let surveyCollection: Collection
let surveyResultCollection: Collection
let accountCollection: Collection

const makeSurvey = async (): Promise<SurveyModel> => {
  const res = await surveyCollection.insertOne(
    {
      question: 'any-question',
      answers: [
        {
          image: 'any-image',
          answer: 'any-answer'
        },
        {
          image: 'other-image',
          answer: 'other-answer'
        }
      ],
      date: new Date()
    }
  )
  const { insertedId: id } = res
  const surveyById = await surveyCollection.findOne({ _id: id })
  return MongoHelper.map(surveyById) as SurveyModel
}
const makeAccount = async (): Promise<AccountModel> => {
  const res = await accountCollection.insertOne(
    {
      name: 'any-name',
      email: 'any-email@email.com',
      password: 'any-password'
    }
  )
  const { insertedId: id } = res
  const accountById = await accountCollection.findOne({ _id: id })
  return MongoHelper.map(accountById) as AccountModel
}
const makeSut = (): SurveyResultMongoRepository => {
  return new SurveyResultMongoRepository()
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
    surveyResultCollection = await MongoHelper.getCollection('surveyResults')
    await surveyResultCollection.deleteMany({})
    accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })
  describe('add', () => {
    test('Should add a resultSurvey on save success', async () => {
      const account = await makeAccount()
      const survey = await makeSurvey()
      const sut = makeSut()
      const surveyResult = await sut.save(
        {
          surveyId: survey.id,
          accountId: account.id,
          answer: survey.answers[0].answer,
          date: new Date()
        }
      )
      expect(surveyResult).toBeTruthy()
      expect(surveyResult.id).toBeTruthy()
      expect(surveyResult.answer).toBe(survey.answers[0].answer)
    })
  })
  test('Should update a resultSurvey if its not new', async () => {
    const account = await makeAccount()
    const survey = await makeSurvey()
    const res = await surveyResultCollection.insertOne({
      surveyId: survey.id,
      accountId: account.id,
      answer: survey.answers[0].answer,
      date: new Date()
    })
    const sut = makeSut()
    const surveyResult = await sut.save(
      {
        surveyId: survey.id,
        accountId: account.id,
        answer: survey.answers[1].answer,
        date: new Date()
      }
    )

    expect(surveyResult).toBeTruthy()
    expect(surveyResult.id).toEqual(res.insertedId.toHexString())
    expect(surveyResult.answer).toBe(survey.answers[1].answer)
  })
})
