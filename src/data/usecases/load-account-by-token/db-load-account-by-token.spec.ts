import { Decrypter } from '../../protocols/cryptography/decrypter'
import { DbLoadAccountByToken } from './db-load-account-by-token'
import { LoadAccountByTokenRepository } from '../../../data/protocols/db/account/loud-account-by-token-repository'
import { AccountModel } from '../add-account/db-add-account-protocols'

const makeFakeAccount = (): AccountModel => ({
  id: 'valid-id',
  name: 'valid-name',
  email: 'valid-email@email.com',
  password: 'hashed-password'
})
const makeDecrypterStub = (): Decrypter => {
  class DecrypterStub implements Decrypter {
    async decrypt (id: string): Promise<string> {
      return await new Promise(resolve => resolve('token-decrypt'))
    }
  }
  return new DecrypterStub()
}

const makeLoadAccountByTokenRepositoryStub = (): LoadAccountByTokenRepository => {
  class LoadAccountByTokenRepositoryStub implements LoadAccountByTokenRepository {
    async loadByToken (token: string): Promise<AccountModel> {
      return await new Promise(resolve => resolve(makeFakeAccount()))
    }
  }
  return new LoadAccountByTokenRepositoryStub()
}
type SutTypes = {
  sut: DbLoadAccountByToken
  decrypterStub: Decrypter
  loadAccountByTokenRepositoryStub: LoadAccountByTokenRepository
}

const makeSut = (): SutTypes => {
  const decrypterStub = makeDecrypterStub()
  const loadAccountByTokenRepositoryStub = makeLoadAccountByTokenRepositoryStub()
  const sut = new DbLoadAccountByToken(decrypterStub, loadAccountByTokenRepositoryStub)
  return {
    sut,
    decrypterStub,
    loadAccountByTokenRepositoryStub
  }
}

describe('DbLoadAccountByToken', () => {
  test('Should call Decrypter with correct values', async () => {
    const { sut, decrypterStub } = makeSut()
    const spyDecrypt = jest.spyOn(decrypterStub, 'decrypt')
    await sut.load('any-token', 'any-role')
    expect(spyDecrypt).toHaveBeenCalledWith('any-token')
  })

  test('Should return null when Decrypter returns null', async () => {
    const { sut, decrypterStub } = makeSut()
    jest.spyOn(decrypterStub, 'decrypt').mockReturnValueOnce(new Promise(resolve => resolve(null)))
    const account = await sut.load('any-token', 'any-role')
    expect(account).toBeNull()
  })

  test('Should call loadAccountByTokenRepository with correct values', async () => {
    const { sut, loadAccountByTokenRepositoryStub } = makeSut()
    const loadByTokenSpy = jest.spyOn(loadAccountByTokenRepositoryStub, 'loadByToken')
    await sut.load('any-token', 'any-role')
    expect(loadByTokenSpy).toHaveBeenCalledWith('any-token', 'any-role')
  })
  test('Should return null when loadAccountByTokenRepository returns null', async () => {
    const { sut, loadAccountByTokenRepositoryStub } = makeSut()
    jest.spyOn(loadAccountByTokenRepositoryStub, 'loadByToken').mockReturnValueOnce(new Promise(resolve => resolve(null)))
    const account = await sut.load('any-token', 'any-role')
    expect(account).toBeNull()
  })
  test('Should return an account on success', async () => {
    const { sut } = makeSut()
    const account = await sut.load('any-token', 'any-role')
    expect(account).toEqual(makeFakeAccount())
  })
  test('Should throw when Decrypter throws exception', async () => {
    const { sut, decrypterStub } = makeSut()
    jest.spyOn(decrypterStub, 'decrypt').mockReturnValueOnce(new Promise((resolve, reject) => {
      throw new Error()
    }))

    const promise = sut.load('any-token', 'any-role')
    await expect(promise).rejects.toThrow()
  })
  test('Should throw when LoadAccountByTokenRepository throws exception', async () => {
    const { sut, loadAccountByTokenRepositoryStub } = makeSut()
    jest.spyOn(loadAccountByTokenRepositoryStub, 'loadByToken').mockReturnValueOnce(new Promise((resolve, reject) => {
      throw new Error()
    }))

    const promise = sut.load('any-token', 'any-role')
    await expect(promise).rejects.toThrow()
  })
})
