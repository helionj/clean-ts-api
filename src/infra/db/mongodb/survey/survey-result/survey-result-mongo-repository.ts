import { SaveSurveyResultParams, SaveSurveyResultRepository, SurveyResultModel } from '../../../../../data/usecases/survey-result/save-survey-result/db-save-survey-result.protocols'
import { MongoHelper } from '../../helpers/mongo-helper'

export class SurveyResultMongoRepository implements SaveSurveyResultRepository {
  async save (data: SaveSurveyResultParams): Promise<SurveyResultModel> {
    const surveyResultCollection = await MongoHelper.getCollection('surveyResults')
    const filter = {
      accountId: data.accountId,
      surveyId: data.surveyId
    }
    const updateData = {
      $set: { answer: data.answer, date: Date() }

    }

    const options = {
      upsert: true
    }

    await surveyResultCollection.updateOne(filter, updateData, options)

    const res = await surveyResultCollection.findOne(filter)
    if (res) {
      return MongoHelper.map(res) as SurveyResultModel
    }
  }
}
