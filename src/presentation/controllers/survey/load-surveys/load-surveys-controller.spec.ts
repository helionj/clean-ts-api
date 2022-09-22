import { SurveyModel, LoadSurveys } from './load-surveys-controller-protocols'
import { LoadSurveysController } from './load-surveys-controller'
import MockDate from 'mockdate'
import { ok, serverError } from '../../../helpers/http/http-helper'
import { ServerError } from '../../../errors'

const makeFakeSurveys = (): SurveyModel[] => {
  return [
    {
      id: 'any-id',
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
      id: 'other-id',
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
}
const makeLoadSurveysStub = (): LoadSurveys => {
  class LoadSurveysStub implements LoadSurveys {
    async load (): Promise<SurveyModel[]> {
      return await new Promise(resolve => resolve(makeFakeSurveys()))
    }
  }
  return new LoadSurveysStub()
}

interface SutTypes {
  sut: LoadSurveysController
  loadSurveysStub: LoadSurveys
}
const makeSut = (): SutTypes => {
  const loadSurveysStub = makeLoadSurveysStub()
  const sut = new LoadSurveysController(loadSurveysStub)
  return {
    sut,
    loadSurveysStub
  }
}
describe('LoadSurveys Controller', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })
  afterAll(() => {
    MockDate.reset()
  })
  test('Should call LoadSurveys', async () => {
    const { sut, loadSurveysStub } = makeSut()
    const loadSpy = jest.spyOn(loadSurveysStub, 'load')
    await sut.handle({})
    expect(loadSpy).toHaveBeenCalled()
  })

  test('Should return 200 on success', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle({})
    expect(httpResponse).toEqual(ok(makeFakeSurveys()))
  })

  test('Should return 500 if LoadSurveys throws exception', async () => {
    const { sut, loadSurveysStub } = makeSut()
    jest.spyOn(loadSurveysStub, 'load').mockImplementation(() => {
      throw new ServerError()
    })

    const httpResponse = await sut.handle({})
    expect(httpResponse).toEqual(serverError(new ServerError()))
  })
})
