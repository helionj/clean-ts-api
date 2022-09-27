import { LoadSurveyById } from '../../../domain/use-cases/load-survey-by-id.ts'
import { LoadSurveyByIdRepository } from '../../protocols/db/survey/load-survey-by-id-repository'
import { SurveyModel } from '../load-surveys/db-load-surveys-protocols'

export class DbLoadSurveyById implements LoadSurveyById {
  constructor (private readonly loadSurveyByIdRepository: LoadSurveyByIdRepository) {}
  async loadById (id: string): Promise<SurveyModel> {
    await this.loadSurveyByIdRepository.loadById(id)
    return null
  }
}
