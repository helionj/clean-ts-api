import { SurveyResultModel } from '../models/survey-result'
import { SaveSurveyResultParams } from '../use-cases/survey-result/save-survey-result'

export const mockSurveyResultModel = (): SurveyResultModel => {
  return {
    id: 'any-id',
    accountId: 'any-accountId',
    surveyId: 'any-surveyId',
    answer: 'any-answer',
    date: new Date()
  }
}
export const mockSaveSurveyResultParams = (): SaveSurveyResultParams => {
  return {
    accountId: 'any-accountId',
    surveyId: 'any-surveyId',
    answer: 'any-answer',
    date: new Date()
  }
}
