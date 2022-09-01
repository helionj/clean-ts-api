import { LoadAccountByEmailRepository } from '../../protocols/loud-account-by-email-repository'
import { AccountModel } from '../add-account/db-add-account-protocols'
import { DbAuthentication } from './db-authentication'

describe('DbAuthentication UseCase', () => {
  test('Should call LouadAccountByEmailRepository with correct email', async () => {
    class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
      async load (email: string): Promise<AccountModel> {
        const account: AccountModel = {
          id: 'any-id',
          name: 'any-name',
          email: 'any-email@email.com',
          password: 'any-password'
        }
        return await new Promise(resolve => resolve(account))
      }
    }
    const loadAccountByEmailRepositoryStub = new LoadAccountByEmailRepositoryStub()
    const sut = new DbAuthentication(loadAccountByEmailRepositoryStub)
    const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'load')
    await sut.auth({
      email: 'any-email@email.com',
      password: 'any-password'
    })
    expect(loadSpy).toHaveBeenCalledWith('any-email@email.com')
  })
})
