import { AccountModel } from '../models/account'
import { AddAccountParams } from '../use-cases/account/add-account'
import { AuthenticationParams } from '../use-cases/account/authentication'

export const mockAccountModel = (): AccountModel => ({
  id: 'any-id',
  name: 'any-name',
  email: 'any-email@email.com',
  password: 'any-password'
})

export const mockAddAccountParams = (): AddAccountParams => ({
  name: 'any-name',
  email: 'any-email@email.com',
  password: 'any-password'
})

export const mockAuthentication = (): AuthenticationParams => (
  {
    email: 'any-email@email.com',
    password: 'any-password'
  }
)
