import { SaveSurveyResultModel } from '../../../../domain/use-cases/save-survey-result'
import { SurveyResultModel } from '../../../usecases/save-survey-result/db-save-survey-result.protocols'

export interface SaveSurveyResultRepository {
  save: (surveyData: SaveSurveyResultModel) => Promise<SurveyResultModel>
}
