import { MissingParamError } from '../../presentation/errors'
import { Validation } from '../../presentation/protocols'
import { ValidationComposite } from './validation-composite'

interface SutTypes {
  sut: ValidationComposite
  validationStubs: Validation[]
}
const makeValidation = (): Validation => {
  class ValidationStub implements Validation {
    validate (input: any): Error {
      return null
    }
  }
  return new ValidationStub()
}
const makeSut = (): SutTypes => {
  const validationStubs = [makeValidation(), makeValidation()]
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