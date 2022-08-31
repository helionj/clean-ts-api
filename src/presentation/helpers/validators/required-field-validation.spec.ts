import { MissingParamError } from '../../errors'
import { RequiredFieldValidation } from './required-field-validation'

describe('Required Field Validation', () => {
  test('Should returns MissingParamError if validation fails', () => {
    const sut = new RequiredFieldValidation('field')
    const error = sut.validate({ name: 'any-name' })
    expect(error).toEqual(new MissingParamError('field'))
  })
  test('Should not returns if validation not fails', () => {
    const sut = new RequiredFieldValidation('field')
    const error = sut.validate({ field: 'any-name' })
    expect(error).toBeFalsy()
  })
})
