import { InvalidParamError } from '../../../errors'
import { forbidden, ok, serverError } from '../../../helpers/http/http-helper'
import { SaveSurveyResultController } from './save-survey-result-controller'
import { HttpRequest, LoadSurveyById, SaveSurveyResult } from './save-survey-result-controller-protocols'
import MockDate from 'mockdate'
import { mockSurveyResultModel, throwError } from '../../../../domain/test'
import { mockLoadSurveyById, mockSaveSurveyResult } from '../../../test'

const mockRequest = (): HttpRequest => {
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

type SutTypes = {
  sut: SaveSurveyResultController
  loadSurveyByIdStub: LoadSurveyById
  saveSurveyResultStub: SaveSurveyResult
}

const makeSut = (): SutTypes => {
  const loadSurveyByIdStub = mockLoadSurveyById()
  const saveSurveyResultStub = mockSaveSurveyResult()
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
    await sut.handle(mockRequest())
    expect(loadByIdSpy).toHaveBeenCalledWith(mockRequest().params.surveyId)
  })
  test('Should return 403 when LoadSurveyById returns null', async () => {
    const { sut, loadSurveyByIdStub } = makeSut()
    jest.spyOn(loadSurveyByIdStub, 'loadById').mockReturnValueOnce(Promise.resolve(null))
    const httpRespone = await sut.handle(mockRequest())
    expect(httpRespone).toEqual(forbidden(new InvalidParamError('surveyId')))
  })

  test('Should return 500 when LoadSurveyById returns throws', async () => {
    const { sut, loadSurveyByIdStub } = makeSut()
    jest.spyOn(loadSurveyByIdStub, 'loadById').mockImplementationOnce(throwError)
    const httpRespone = await sut.handle(mockRequest())
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
    await sut.handle(mockRequest())
    expect(saveSpy).toHaveBeenCalledWith({
      accountId: 'any-accountId',
      surveyId: 'any-surveyId',
      answer: 'any-answer',
      date: new Date()
    })
  })
  test('Should return 500 when SaveSurveyResult returns throws', async () => {
    const { sut, saveSurveyResultStub } = makeSut()
    jest.spyOn(saveSurveyResultStub, 'save').mockImplementationOnce(throwError)
    const httpRespone = await sut.handle(mockRequest())
    expect(httpRespone).toEqual(serverError(new Error()))
  })
  test('Should return 200 on success', async () => {
    const { sut } = makeSut()
    const httpRespone = await sut.handle(mockRequest())
    const result = mockSurveyResultModel()
    expect(httpRespone).toEqual(ok(result))
  })
})
