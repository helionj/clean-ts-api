import { EmailValidatorAdapter } from './email-validator'

describe('Email Validator Adapter', () => {
  test('Should returns false when validator returns false', () => {
    const sut = new EmailValidatorAdapter()
    const isValid = sut.isValid('inalid_email@email.com')
    expect(isValid).toBe(false)
  })
})
