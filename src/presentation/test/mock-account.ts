import { AccountModel } from '../../domain/models/account'
import { mockAccountModel } from '../../domain/test'
import { AddAccount, AddAccountParams } from '../../domain/use-cases/account/add-account'
import { Authentication, AuthenticationParams } from '../../domain/use-cases/account/authentication'

export const mockAddAccount = (): AddAccount => {
  class AddAccountStub implements AddAccount {
    async add (account: AddAccountParams): Promise<AccountModel> {
      return await Promise.resolve(mockAccountModel())
    }
  }
  return new AddAccountStub()
}

export const mockAuthentication = (): Authentication => {
  class AuthenticationStub implements Authentication {
    async auth (authentication: AuthenticationParams): Promise<string> {
      return await Promise.resolve('any-token')
    }
  }
  return new AuthenticationStub()
}
