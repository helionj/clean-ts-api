import { EmailValidatorAdapter } from './email-validator'
import validator from 'validator'

jest.mock('validator', () => ({
  isEmail (): boolean {
    return true
  }
}))

describe('Email Validator Adapter', () => {
  test('Should returns false when validator returns false', () => {
    const sut = new EmailValidatorAdapter()
    jest.spyOn(validator, 'isEmail').mockReturnValueOnce(false)
    const isValid = sut.isValid('inValid_email@email.com')
    expect(isValid).toBe(false)
  })
  test('Should returns true when validator returns true', () => {
    const sut = new EmailValidatorAdapter()
    const isValid = sut.isValid('Valid_email@email.com')
    expect(isValid).toBe(true)
  })
})
