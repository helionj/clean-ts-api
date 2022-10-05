import { SurveyModel } from '../../domain/models/survey'
import { mockSurveyModel, mockSurveys } from '../../domain/test'
import { AddSurvey, AddSurveyParams } from '../../domain/use-cases/survey/add-survey'
import { LoadSurveyById } from '../../domain/use-cases/survey/load-survey-by-id'
import { LoadSurveys } from '../../domain/use-cases/survey/load-surveys'

export const mockAddSurvey = (): AddSurvey => {
  class AddSurveyStub implements AddSurvey {
    async add (survey: AddSurveyParams): Promise<void> {
      return await new Promise(resolve => resolve())
    }
  }
  return new AddSurveyStub()
}

export const mockLoadSurveys = (): LoadSurveys => {
  class LoadSurveysStub implements LoadSurveys {
    async load (): Promise<SurveyModel[]> {
      return await new Promise(resolve => resolve(mockSurveys()))
    }
  }
  return new LoadSurveysStub()
}

export const mockLoadSurveyById = (): LoadSurveyById => {
  class LoadSurveyByIdStub implements LoadSurveyById {
    async loadById (id: string): Promise<SurveyModel> {
      return await new Promise(resolve => resolve(mockSurveyModel()))
    }
  }
  return new LoadSurveyByIdStub()
}
