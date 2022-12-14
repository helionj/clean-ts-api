import { MissingParamError } from '../../presentation/errors'
import { Validation } from '../../presentation/protocols'
import { mockValidation } from '../test'
import { ValidationComposite } from './validation-composite'

type SutTypes = {
  sut: ValidationComposite
  validationStubs: Validation[]
}

const makeSut = (): SutTypes => {
  const validationStubs = [mockValidation(), mockValidation()]
  const sut = new ValidationComposite(validationStubs)
  return {
    sut,
    validationStubs
  }
}
describe('Validation Composite', () => {
  test('Should return an error if validation fails', () => {
    const { sut, validationStubs } = makeSut()
    jest.spyOn(validationStubs[0], 'validate').mockReturnValueOnce(new MissingParamError('field'))
    const error = sut.validate({ field: 'any-value' })
    expect(error).toEqual(new MissingParamError('field'))
  })
  test('Should return the first error if more one validation fails', () => {
    const { sut, validationStubs } = makeSut()
    jest.spyOn(validationStubs[0], 'validate').mockReturnValueOnce(new MissingParamError('field'))
    jest.spyOn(validationStubs[1], 'validate').mockReturnValueOnce(new Error('field'))
    const error = sut.validate({ field: 'any-value' })
    expect(error).toEqual(new MissingParamError('field'))
  })
  test('Should return the first error if more one validation fails', () => {
    const { sut } = makeSut()
    const error = sut.validate({ field: 'any-value' })
    expect(error).toBeFalsy()
  })
})
