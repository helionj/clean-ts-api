import { AddSurveyModel, AddSurveyRepository } from './db-add-survey-protocols'
import { DbAddSurvey } from './db-add-survey'
const makeFakeSurvey = (): AddSurveyModel => {
  return {
    question: 'any-questiion',
    answers: [
      {
        image: 'any-image',
        answer: 'any-answer'
      }
    ]
  }
}
interface SutTypes {
  sut: DbAddSurvey
  addSurveyRepositoryStub: AddSurveyRepository
}

const makeAddSurveyRepositoryStub = (): AddSurveyRepository => {
  class AddSurveyRepositoryStub implements AddSurveyRepository {
    async add (surveyData: AddSurveyModel): Promise<void> {
      return await new Promise(resolve => resolve())
    }
  }
  return new AddSurveyRepositoryStub()
}

const makeSut = (): SutTypes => {
  const addSurveyRepositoryStub = makeAddSurveyRepositoryStub()
  const sut = new DbAddSurvey(addSurveyRepositoryStub)
  return {
    sut,
    addSurveyRepositoryStub
  }
}
describe('DbAddSurvey Use Case', () => {
  test('Should call AddSurveyRepository with correct values', async () => {
    const { sut, addSurveyRepositoryStub } = makeSut()
    const addSpy = jest.spyOn(addSurveyRepositoryStub, 'add')
    await sut.add(makeFakeSurvey())
    expect(addSpy).toHaveBeenCalledWith(makeFakeSurvey())
  })

  test('Should throw when AddSurveyRepository throws exception', async () => {
    const { sut, addSurveyRepositoryStub } = makeSut()
    jest.spyOn(addSurveyRepositoryStub, 'add').mockImplementation(() => {
      throw new Error()
    })
    const promise = sut.add(makeFakeSurvey())
    await expect(promise).rejects.toThrow()
  })
})
