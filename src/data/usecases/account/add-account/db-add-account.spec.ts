import { AddAccountRepository, Hasher, LoadAccountByEmailRepository } from './db-add-account-protocols'
import { DbAddAccount } from './db-add-account'
import { mockAccountModel, mockAddAccountParams, throwError } from '../../../../domain/test'
import { mockAddAccountRepository, mockHasher, mockLoadAccountByEmailRepository } from '../../../test'

type SutTypes = {
  sut: DbAddAccount
  hasherStub: Hasher
  addAccountRepositoryStub: AddAccountRepository
  loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository
}

const makeSut = (): SutTypes => {
  const hasherStub = mockHasher()
  const addAccountRepositoryStub = mockAddAccountRepository()
  const loadAccountByEmailRepositoryStub = mockLoadAccountByEmailRepository()
  jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail').mockReturnValue(new Promise(resolve => resolve(null)))
  const sut = new DbAddAccount(hasherStub, addAccountRepositoryStub, loadAccountByEmailRepositoryStub)
  return {
    sut,
    hasherStub,
    addAccountRepositoryStub,
    loadAccountByEmailRepositoryStub
  }
}
describe('DbAddAccount Usecase', () => {
  test('Should call Hasher with correct password', async () => {
    const { sut, hasherStub } = makeSut()
    const hashSpy = jest.spyOn(hasherStub, 'hash')
    await sut.add(mockAddAccountParams())
    expect(hashSpy).toHaveBeenCalledWith('any-password')
  })

  test('Should throw when Hasher throws exception', async () => {
    const { sut, hasherStub } = makeSut()
    jest.spyOn(hasherStub, 'hash').mockImplementationOnce(throwError)

    const promise = sut.add(mockAddAccountParams())
    await expect(promise).rejects.toThrow()
  })

  test('Should call AddAccountRepository with correct values', async () => {
    const { sut, addAccountRepositoryStub } = makeSut()
    const addSpy = jest.spyOn(addAccountRepositoryStub, 'add')

    await sut.add(mockAddAccountParams())
    expect(addSpy).toHaveBeenCalledWith({
      name: 'any-name',
      email: 'any-email@email.com',
      password: 'any-password'
    })
  })

  test('Should throw when AddAccountRepository throws exception', async () => {
    const { sut, addAccountRepositoryStub } = makeSut()
    jest.spyOn(addAccountRepositoryStub, 'add').mockImplementation(() => {
      throw new Error()
    })
    const promise = sut.add(mockAddAccountParams())
    await expect(promise).rejects.toThrow()
  })

  test('Should return an account on success', async () => {
    const { sut } = makeSut()
    const account = await sut.add(mockAddAccountParams())
    expect(account).toEqual(mockAccountModel())
  })

  test('Should call LoadAccountByEmailRepository with correct email', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail')
    await sut.add(mockAddAccountParams())
    expect(loadSpy).toHaveBeenCalledWith('any-email@email.com')
  })

  test('Should return null when loadAccountByEmaillRepository not returns null', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail').mockReturnValueOnce(new Promise(resolve => resolve(mockAccountModel())))
    const account = await sut.add(mockAddAccountParams())
    expect(account).toBeNull()
  })
})
