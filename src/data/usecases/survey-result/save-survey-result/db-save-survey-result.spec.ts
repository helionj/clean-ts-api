import { SaveSurveyResultRepository } from './db-save-survey-result.protocols'
import { DbSaveSurveyResult } from './db-save-survey-result'
import { mockSaveSurveyResultParams, mockSurveyResultModel } from '../../../../domain/test'
import { mockSaveSurveyResultRepository } from '../../../test'
import MockDate from 'mockdate'

type SutTypes = {
  sut: DbSaveSurveyResult
  saveSurveyResultRepositoryStub: SaveSurveyResultRepository
}

const makeSut = (): SutTypes => {
  const saveSurveyResultRepositoryStub = mockSaveSurveyResultRepository()
  const sut = new DbSaveSurveyResult(saveSurveyResultRepositoryStub)
  return {
    sut,
    saveSurveyResultRepositoryStub
  }
}
describe('DbSaveSurveyResult Use Case', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })
  afterAll(() => {
    MockDate.reset()
  })
  test('Should call saveSurveyResultRepository with correct values', async () => {
    const { sut, saveSurveyResultRepositoryStub } = makeSut()
    const saveSpy = jest.spyOn(saveSurveyResultRepositoryStub, 'save')
    const surveyData = mockSaveSurveyResultParams()
    await sut.save(surveyData)
    expect(saveSpy).toHaveBeenCalledWith(surveyData)
  })
  test('Should throw when saveSurveyResultRepository throws exception', async () => {
    const { sut, saveSurveyResultRepositoryStub } = makeSut()
    jest.spyOn(saveSurveyResultRepositoryStub, 'save').mockImplementation(() => {
      throw new Error()
    })
    const promise = sut.save(mockSaveSurveyResultParams())
    await expect(promise).rejects.toThrow()
  })
  test('Should return a surveyResult on success', async () => {
    const { sut } = makeSut()
    const response = await sut.save(mockSaveSurveyResultParams())
    expect(response).toEqual(mockSurveyResultModel())
  })
})
