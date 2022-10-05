import { AddAccount, HttpRequest, Validation, Authentication } from './signup-controller-protocols'
import { EmailInUseError, MissingParamError, ServerError } from '../../../errors'
import { SignupController } from './signup-controller'
import { badRequest, conflict, ok, serverError } from '../../../helpers/http/http-helper'
import { mockAddAccount, mockAuthentication, mockValidation } from '../../../test'

type SutTypes = {
  sut: SignupController
  addAccountStub: AddAccount
  validationStub: Validation
  authenticationStub: Authentication
}

const mockRequest = (): HttpRequest => ({
  body: {
    name: 'any_name',
    email: 'any_email@email.com',
    password: 'any_password',
    passwordConfirm: 'any_password'
  }

})

const makeSut = (): SutTypes => {
  const addAccountStub = mockAddAccount()
  const validationStub = mockValidation()
  const authenticationStub = mockAuthentication()
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

    await sut.handle(mockRequest())
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

    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(serverError(new ServerError()))
  })

  test('Should return 200 if data valid is provided', async () => {
    const { sut } = makeSut()

    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(ok({ accessToken: 'any-token' }))
  })

  test('Should call Validation with correct values', async () => {
    const { sut, validationStub } = makeSut()
    const validateSpy = jest.spyOn(validationStub, 'validate')

    const httpRequest = mockRequest()
    await sut.handle(httpRequest)
    expect(validateSpy).toHaveBeenCalledWith(httpRequest.body)
  })

  test('Should return 400 if Validation returns an error', async () => {
    const { sut, validationStub } = makeSut()
    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new MissingParamError('any-field'))
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(badRequest(new MissingParamError('any-field')))
  })
  test('Should call Authentication with correct values', async () => {
    const { sut, authenticationStub } = makeSut()
    const isAuthSpy = jest.spyOn(authenticationStub, 'auth')

    await sut.handle(mockRequest())
    expect(isAuthSpy).toHaveBeenCalledWith({ email: 'any_email@email.com', password: 'any_password' })
  })
  test('Should return 500 if Authentication throws exception', async () => {
    const { sut, authenticationStub } = makeSut()
    jest.spyOn(authenticationStub, 'auth').mockImplementation(() => {
      throw new ServerError()
    })

    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(serverError(new ServerError()))
  })

  test('Should return 409 when AddAccount returns null', async () => {
    const { sut, addAccountStub } = makeSut()
    jest.spyOn(addAccountStub, 'add').mockReturnValueOnce(new Promise(resolve => resolve(null)))
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(conflict(new EmailInUseError()))
  })
})
