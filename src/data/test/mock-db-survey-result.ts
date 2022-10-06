import { mockSurveyResultModel } from '../../domain/test'
import { SaveSurveyResultParams, SaveSurveyResultRepository, SurveyResultModel } from '../usecases/survey-result/save-survey-result/db-save-survey-result.protocols'

export const mockSaveSurveyResultRepository = (): SaveSurveyResultRepository => {
  class SaveSurveyResultRepositoryStub implements SaveSurveyResultRepository {
    async save (surveyData: SaveSurveyResultParams): Promise<SurveyResultModel> {
      return await Promise.resolve(mockSurveyResultModel())
    }
  }
  return new SaveSurveyResultRepositoryStub()
}
