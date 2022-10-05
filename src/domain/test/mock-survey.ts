import { SurveyModel } from '../models/survey'
import { AddSurveyParams } from '../use-cases/survey/add-survey'

export const mockSurveyModel = (): SurveyModel => {
  return {
    id: 'any-id',
    question: 'any-question',
    answers: [
      {
        image: 'any-image',
        answer: 'any-answer'
      }
    ],
    date: new Date()
  }
}
export const mockAddSurveyParams = (): AddSurveyParams => {
  return {
    question: 'any-questiion',
    answers: [
      {
        image: 'any-image',
        answer: 'any-answer'
      }
    ],
    date: new Date()
  }
}

export const mockSurveys = (): SurveyModel[] => {
  return [
    {
      id: 'any-id',
      question: 'any-question',
      answers: [
        {
          image: 'any-image',
          answer: 'any-answer'
        }
      ],
      date: new Date()
    },
    {
      id: 'other-id',
      question: 'other-question',
      answers: [
        {
          image: 'other-image',
          answer: 'other-answer'
        }
      ],
      date: new Date()
    }
  ]
}
