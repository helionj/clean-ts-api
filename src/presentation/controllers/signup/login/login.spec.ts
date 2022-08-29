import { MissingParamError } from '../../../errors'
import { badRequest } from '../../../helpers/http-helper'
import { LoginController } from './login'

describe('Login Controller', () => {
  test('Should return 400 if email is not provided', async () => {
    const sut = new LoginController()
    const httpRequest = {
      body: {
        password: 'any-password'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('email')))
  })
})
