import { LoadSurveyByIdRepository } from './db-load-survey-by-id-protocols'
import { DbLoadSurveyById } from './db-load-survey-by-id'
import { mockLoadSurveyByIdRepository } from '../../../test'
import MockDate from 'mockdate'
import { mockSurveyModel } from '../../../../domain/test'

type SutTypes = {
  sut: DbLoadSurveyById
  loadSurveyByIdRepositoryStub: LoadSurveyByIdRepository
}
const makeSut = (): SutTypes => {
  const loadSurveyByIdRepositoryStub = mockLoadSurveyByIdRepository()
  const sut = new DbLoadSurveyById(loadSurveyByIdRepositoryStub)
  return {
    sut,
    loadSurveyByIdRepositoryStub
  }
}
describe('DbLoadSourveyById', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })
  afterAll(() => {
    MockDate.reset()
  })
  test('Should call LoadSurveyByIdRepository with correct values', async () => {
    const { sut, loadSurveyByIdRepositoryStub } = makeSut()
    const loadByIdSpy = jest.spyOn(loadSurveyByIdRepositoryStub, 'loadById')
    await sut.loadById('any-id')
    expect(loadByIdSpy).toHaveBeenCalledWith('any-id')
  })
  test('Should return a survey on success', async () => {
    const { sut } = makeSut()
    const response = await sut.loadById('any-id')
    expect(response).toEqual(mockSurveyModel())
  })
  test('Should throw when LoadSurveysRepository throws exception', async () => {
    const { sut, loadSurveyByIdRepositoryStub } = makeSut()
    jest.spyOn(loadSurveyByIdRepositoryStub, 'loadById').mockImplementation(() => {
      throw new Error()
    })
    const promise = sut.loadById('any-id')
    await expect(promise).rejects.toThrow()
  })
})
