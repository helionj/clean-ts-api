import { AddAccount, AddAccountModel, AccountModel, HttpRequest, Validation, Authentication, AuthenticationModel } from './signup-controller-protocols'
import { MissingParamError, ServerError } from '../../errors'
import { SignupController } from './signup-controller'
import { badRequest, ok, serverError } from '../../helpers/http/http-helper'

interface SutTypes {
  sut: SignupController
  addAccountStub: AddAccount
  validationStub: Validation
  authenticationStub: Authentication
}

const makeFakeRequest = (): HttpRequest => ({
  body: {
    name: 'any_name',
    email: 'any_email@email.com',
    password: 'any_password',
    passwordConfirm: 'any_password'
  }

})

const makeValidation = (): Validation => {
  class ValidationStub implements Validation {
    validate (input: any): Error {
      return null
    }
  }
  return new ValidationStub()
}

const makeAddAccount = (): AddAccount => {
  class AddAccountStub implements AddAccount {
    async add (account: AddAccountModel): Promise<AccountModel> {
      return await new Promise(resolve => resolve(makeFakeAccount()))
    }
  }
  return new AddAccountStub()
}
const makeFakeAccount = (): AccountModel => (
  {
    id: 'valid-id',
    name: 'valid-name',
    email: 'valid-email',
    password: 'valid-password'
  }
)
const makeAuthentication = (): Authentication => {
  class AuthenticationStub implements Authentication {
    async auth (authentication: AuthenticationModel): Promise<string> {
      return await new Promise(resolve => resolve('any-token'))
    }
  }
  return new AuthenticationStub()
}

const makeSut = (): SutTypes => {
  const addAccountStub = makeAddAccount()
  const validationStub = makeValidation()
  const authenticationStub = makeAuthentication()
  const sut = new SignupController(addAccountStub, validationStub, authenticationStub)

  return {
    sut,
    addAccountStub,
    validationStub,
    authenticationStub
  }
}

describe('Signup Controller', () => {
  test('Should call addAccount with correct values', async () => {
    const { sut, addAccountStub } = makeSut()
    const isValidSpy = jest.spyOn(addAccountStub, 'add')

    await sut.handle(makeFakeRequest())
    expect(isValidSpy).toHaveBeenCalledWith({
      name: 'any_name',
      email: 'any_email@email.com',
      password: 'any_password'
    })
  })

  test('Should return 500 if AddAccount throws exception', async () => {
    const { sut, addAccountStub } = makeSut()

    jest.spyOn(addAccountStub, 'add').mockImplementation(async () => {
      return await new Promise((resolve, reject) => reject(new ServerError()))
    })

    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(serverError(new ServerError()))
  })

  test('Should return 200 if data valid is provided', async () => {
    const { sut } = makeSut()

    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(ok(makeFakeAccount()))
  })

  test('Should call Validation with correct values', async () => {
    const { sut, validationStub } = makeSut()
    const validateSpy = jest.spyOn(validationStub, 'validate')

    const httpRequest = makeFakeRequest()
    await sut.handle(httpRequest)
    expect(validateSpy).toHaveBeenCalledWith(httpRequest.body)
  })

  test('Should return 400 if Validation returns an error', async () => {
    const { sut, validationStub } = makeSut()
    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new MissingParamError('any-field'))
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(badRequest(new MissingParamError('any-field')))
  })
  test('Should call Authentication with correct values', async () => {
    const { sut, authenticationStub } = makeSut()
    const isAuthSpy = jest.spyOn(authenticationStub, 'auth')

    await sut.handle(makeFakeRequest())
    expect(isAuthSpy).toHaveBeenCalledWith({ email: 'any_email@email.com', password: 'any_password' })
  })
})
