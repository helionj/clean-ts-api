import { InvalidParamError } from '../../../errors'
import { forbidden, serverError } from '../../../helpers/http/http-helper'
import { SaveSurveyResultController } from './save-survey-result-controller'
import { HttpRequest, SurveyModel, LoadSurveyById, SurveyResultModel, SaveSurveyResult, SaveSurveyResultModel } from './save-survey-result-controller-protocols'
import MockDate from 'mockdate'

const makeFakeSurvey = (): SurveyModel => {
  return {
    id: 'any-id',
    question: 'any-question',
    answers: [
      {
        image: 'any-image',
        answer: 'any-answer'
      }
    ],
    date: new Date()
  }
}
const makeFakeRequest = (): HttpRequest => {
  return {
    params: {
      surveyId: 'any-surveyId'
    },
    body: {
      answer: 'any-answer'
    },
    accountId: 'any-accountId'
  }
}
const makeFakeSurveyResult = (): SurveyResultModel => {
  return {
    id: 'any-id',
    surveyId: 'any-surveyId',
    accountId: 'any-accountId',
    answer: 'any-answer',
    date: new Date()
  }
}
type SutTypes = {
  sut: SaveSurveyResultController
  loadSurveyByIdStub: LoadSurveyById
  saveSurveyResultStub: SaveSurveyResult
}
const makeLoadSurveyById = (): LoadSurveyById => {
  class LoadSurveyByIdStub implements LoadSurveyById {
    async loadById (id: string): Promise<SurveyModel> {
      return await new Promise(resolve => resolve(makeFakeSurvey()))
    }
  }
  return new LoadSurveyByIdStub()
}
const makeSaveSurveyResultStub = (): SaveSurveyResult => {
  class SaveSurveyResultStub implements SaveSurveyResult {
    async save (data: SaveSurveyResultModel): Promise<SurveyResultModel> {
      return await new Promise(resolve => resolve(makeFakeSurveyResult()))
    }
  }
  return new SaveSurveyResultStub()
}

const makeSut = (): SutTypes => {
  const loadSurveyByIdStub = makeLoadSurveyById()
  const saveSurveyResultStub = makeSaveSurveyResultStub()
  const sut = new SaveSurveyResultController(loadSurveyByIdStub, saveSurveyResultStub)
  return {
    sut,
    loadSurveyByIdStub,
    saveSurveyResultStub
  }
}
describe('SaveSurveyResult Controller', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })
  afterAll(() => {
    MockDate.reset()
  })
  test('Should call LoadSurveyById with correct values', async () => {
    const { sut, loadSurveyByIdStub } = makeSut()
    const loadByIdSpy = jest.spyOn(loadSurveyByIdStub, 'loadById')
    await sut.handle(makeFakeRequest())
    expect(loadByIdSpy).toHaveBeenCalledWith(makeFakeRequest().params.surveyId)
  })
  test('Should return 403 when LoadSurveyById returns null', async () => {
    const { sut, loadSurveyByIdStub } = makeSut()
    jest.spyOn(loadSurveyByIdStub, 'loadById').mockReturnValueOnce(new Promise(resolve => resolve(null)))
    const httpRespone = await sut.handle(makeFakeRequest())
    expect(httpRespone).toEqual(forbidden(new InvalidParamError('surveyId')))
  })

  test('Should return 500 when LoadSurveyById returns throws', async () => {
    const { sut, loadSurveyByIdStub } = makeSut()
    jest.spyOn(loadSurveyByIdStub, 'loadById').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const httpRespone = await sut.handle(makeFakeRequest())
    expect(httpRespone).toEqual(serverError(new Error()))
  })

  test('Should return 403 when LoadSurveyById returns null', async () => {
    const { sut } = makeSut()
    const httpRespone = await sut.handle({
      params: {
        surveyId: 'any-surveyId'
      },
      body: {
        answer: 'wrong-answer'
      }
    })
    expect(httpRespone).toEqual(forbidden(new InvalidParamError('answer')))
  })

  test('Should call saveSurveyResult with correct values', async () => {
    const { sut, saveSurveyResultStub } = makeSut()
    const saveSpy = jest.spyOn(saveSurveyResultStub, 'save')
    await sut.handle(makeFakeRequest())
    expect(saveSpy).toHaveBeenCalledWith({
      accountId: 'any-accountId',
      surveyId: 'any-surveyId',
      answer: 'any-answer',
      date: new Date()
    })
  })
  test('Should return 500 when SaveSurveyResult returns throws', async () => {
    const { sut, saveSurveyResultStub } = makeSut()
    jest.spyOn(saveSurveyResultStub, 'save').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const httpRespone = await sut.handle(makeFakeRequest())
    expect(httpRespone).toEqual(serverError(new Error()))
  })
})
