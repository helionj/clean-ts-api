import { EmailValidatorAdapter } from './email-validator-adapter'
import validator from 'validator'

jest.mock('validator', () => ({
  isEmail (): boolean {
    return true
  }
}))

const makeSut = (): EmailValidatorAdapter => {
  return new EmailValidatorAdapter()
}

describe('Email Validator Adapter', () => {
  test('Should returns false when validator returns false', () => {
    const sut = makeSut()
    jest.spyOn(validator, 'isEmail').mockReturnValueOnce(false)
    const isValid = sut.isValid('inValid_email@email.com')
    expect(isValid).toBe(false)
  })
  test('Should returns true when validator returns true', () => {
    const sut = makeSut()
    const isValid = sut.isValid('Valid_email@email.com')
    expect(isValid).toBe(true)
  })

  test('Should call validator with correct email', () => {
    const sut = makeSut()
    const isEmailSpy = jest.spyOn(validator, 'isEmail')
    sut.isValid('any_email@email.com')
    expect(isEmailSpy).toHaveBeenCalledWith('any_email@email.com')
  })
})
