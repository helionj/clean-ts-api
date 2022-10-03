import { InvalidParamError } from '../../../errors'
import { forbidden, serverError } from '../../../helpers/http/http-helper'
import { SaveSurveyResultController } from './save-survey-result-controller'
import { HttpRequest, SurveyModel, LoadSurveyById } from './save-survey-result-controller-protocols'

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
      surveyId: 'any-id'
    }
  }
}
type SutTypes = {
  sut: SaveSurveyResultController
  loadSurveyByIdStub: LoadSurveyById
}
const makeLoadSurveyById = (): LoadSurveyById => {
  class LoadSurveyByIdStub implements LoadSurveyById {
    async loadById (id: string): Promise<SurveyModel> {
      return await new Promise(resolve => resolve(makeFakeSurvey()))
    }
  }
  return new LoadSurveyByIdStub()
}

const makeSut = (): SutTypes => {
  const loadSurveyByIdStub = makeLoadSurveyById()
  const sut = new SaveSurveyResultController(loadSurveyByIdStub)
  return {
    sut,
    loadSurveyByIdStub
  }
}
describe('SaveSurveyResult Controller', () => {
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
})
