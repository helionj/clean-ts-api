import { SaveSurveyResultParams } from '../../../../domain/use-cases/survey-result/save-survey-result'
import { SurveyResultModel } from '../../../usecases/survey-result/save-survey-result/db-save-survey-result.protocols'

export interface SaveSurveyResultRepository {
  save: (surveyData: SaveSurveyResultParams) => Promise<SurveyResultModel>
}
