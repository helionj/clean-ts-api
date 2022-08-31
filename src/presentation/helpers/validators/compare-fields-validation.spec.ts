import { InvalidParamError } from '../../errors'
import { CompareFieldsValidation } from './compare-fields-validation'

const makeSut = (): CompareFieldsValidation => {
  return new CompareFieldsValidation('field', 'fieldToCompare')
}
describe('Compare Fields Validation', () => {
  test('Should returns InavalidParamError if validation fails', () => {
    const sut = makeSut()
    const error = sut.validate({
      field: 'any-value',
      fieldToCompare: 'wrong-value'
    })
    expect(error).toEqual(new InvalidParamError('fieldToCompare'))
  })
  test('Should not returns if validation not fails', () => {
    const sut = makeSut()
    const error = sut.validate({ field: 'any-value', fieldToCompare: 'any-value' })
    expect(error).toBeFalsy()
  })
})
