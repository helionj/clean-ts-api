import { MissingParamError } from '../../errors'
import { RequiredFieldValidation } from './required-field-validation'

const makeSut = (): RequiredFieldValidation => {
  return new RequiredFieldValidation('field')
}
describe('Required Field Validation', () => {
  test('Should returns MissingParamError if validation fails', () => {
    const sut = makeSut()
    const error = sut.validate({ name: 'any-name' })
    expect(error).toEqual(new MissingParamError('field'))
  })
  test('Should not returns if validation not fails', () => {
    const sut = makeSut()
    const error = sut.validate({ field: 'any-name' })
    expect(error).toBeFalsy()
  })
})
