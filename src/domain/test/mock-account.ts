import { AccountModel } from '../models/account'
import { AddAccountParams } from '../use-cases/account/add-account'

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
