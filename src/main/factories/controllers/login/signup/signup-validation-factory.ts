import { ValidationComposite, CompareFieldsValidation, EmailValidation, RequiredFieldValidation } from '../../../../../validation/validators'
import { Validation } from '../../../../../presentation/protocols/validation'
import { EmailValidatorAdapter } from '../../../../../infra/validators/email-validator-adapter'

export const makeSignupValidation = (): ValidationComposite => {
  const validations: Validation[] = []

  for (const field of ['name', 'email', 'password', 'passwordConfirm']) {
    validations.push(new RequiredFieldValidation(field))
  }
  validations.push(new CompareFieldsValidation('password', 'passwordConfirm'))
  validations.push(new EmailValidation('email', new EmailValidatorAdapter()))
  return new ValidationComposite(validations)
}
