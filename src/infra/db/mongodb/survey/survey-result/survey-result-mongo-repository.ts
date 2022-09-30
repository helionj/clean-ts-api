import { SaveSurveyResultModel, SaveSurveyResultRepository, SurveyResultModel } from '../../../../../data/usecases/save-survey-result/db-save-survey-result.protocols'
import { MongoHelper } from '../../helpers/mongo-helper'

export class SurveyResultMongoRepository implements SaveSurveyResultRepository {
  async save (data: SaveSurveyResultModel): Promise<SurveyResultModel> {
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

    const updateRes = await surveyResultCollection.updateOne(filter, updateData, options)
    const res = await surveyResultCollection.findOne({ _id: updateRes.upsertedId })
    return res && MongoHelper.map(res) as SurveyResultModel
  }
}
