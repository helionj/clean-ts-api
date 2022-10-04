import { DbSaveSurveyResult } from '../../../../../data/usecases/survey-result/save-survey-result/db-save-survey-result'
import { SaveSurveyResult } from '../../../../../domain/use-cases/survey-result/save-survey-result'
import { SurveyResultMongoRepository } from '../../../../../infra/db/mongodb/survey/survey-result/survey-result-mongo-repository'

export const makeDbSaveSurveyResult = (): SaveSurveyResult => {
  const surveyResultMongoRepository = new SurveyResultMongoRepository()
  return new DbSaveSurveyResult(surveyResultMongoRepository)
}
