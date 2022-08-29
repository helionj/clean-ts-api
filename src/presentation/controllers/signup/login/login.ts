import { Authentication } from '../../../../domain/use-cases/authentication'
import { InvalidParamError, MissingParamError } from '../../../errors'
import { badRequest, serverError } from '../../../helpers/http-helper'
import { HttpRequest, HttpResponse } from '../../../protocols'
import { Controller, EmailValidator } from '../signup-protocols'

export class LoginController implements Controller {
  private readonly emailValidator: EmailValidator
  private readonly authentication: Authentication

  constructor (emailValidator: EmailValidator, authentication: Authentication) {
    this.emailValidator = emailValidator
    this.authentication = authentication
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const { email, password } = httpRequest.body
    try {
      if (!email) {
        return await new Promise(resolve => resolve(badRequest(new MissingParamError('email'))))
      }
      if (!password) {
        return await new Promise(resolve => resolve(badRequest(new MissingParamError('password'))))
      }
      if (!this.emailValidator.isValid(email)) {
        return badRequest(new InvalidParamError('email'))
      }

      await this.authentication.auth(email, password)
    } catch (error) {
      return serverError(error)
    }
  }
}
