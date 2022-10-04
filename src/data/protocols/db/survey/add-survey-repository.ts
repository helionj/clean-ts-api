import { AddSurveyParams } from '../../../../domain/use-cases/survey/add-survey'

export interface AddSurveyRepository {
  add: (survetData: AddSurveyParams) => Promise<void>
}
