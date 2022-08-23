import bcrypt from 'bcrypt'
import { BcryptAdapter } from './bcrypt-adapter'

jest.mock('bcrypt', () => ({
  async hash (): Promise<string> {
    return await new Promise(resolve => resolve('hash'))
  }
}))

const salt = 12

const makeSut = (): BcryptAdapter => {
  return new BcryptAdapter(salt)
}

describe('Bcrypt Adapter', () => {
  test('Should call bcrypt with correct value', async () => {
    const sut = makeSut()
    const hashSpy = jest.spyOn(bcrypt, 'hash')
    await sut.encrypt('any-value')
    expect(hashSpy).toHaveBeenCalledWith('any-value', salt)
  })
  test('Should return a hash on success', async () => {
    const sut = makeSut()
    const hash = await sut.encrypt('any-value')
    expect(hash).toBe('hash')
  })
  test('Should throw when bcrypt throws', async () => {
    const sut = makeSut()
    jest.spyOn(bcrypt, 'hash').mockImplementation(() => {
      throw new Error()
    })

    const promise = sut.encrypt('any-value')
    await expect(promise).rejects.toThrow()
  })
})
