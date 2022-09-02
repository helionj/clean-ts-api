import bcrypt from 'bcrypt'
import { BcryptAdapter } from './bcrypt-adapter'

jest.mock('bcrypt', () => ({
  async hash (): Promise<string> {
    return await new Promise(resolve => resolve('hash'))
  },

  async compare (): Promise<boolean> {
    return await new Promise(resolve => resolve(true))
  }
}))

const salt = 12

const makeSut = (): BcryptAdapter => {
  return new BcryptAdapter(salt)
}

describe('Bcrypt Adapter', () => {
  test('Should call hash with correct value', async () => {
    const sut = makeSut()
    const hashSpy = jest.spyOn(bcrypt, 'hash')
    await sut.hash('any-value')
    expect(hashSpy).toHaveBeenCalledWith('any-value', salt)
  })
  test('Should return a valid hash on hash success', async () => {
    const sut = makeSut()
    const hash = await sut.hash('any-value')
    expect(hash).toBe('hash')
  })
  test('Should throw when hash throws', async () => {
    const sut = makeSut()
    jest.spyOn(bcrypt, 'hash').mockImplementation(() => {
      throw new Error()
    })

    const promise = sut.hash('any-value')
    await expect(promise).rejects.toThrow()
  })

  test('Should call compare with correct value', async () => {
    const sut = makeSut()
    const compareSpy = jest.spyOn(bcrypt, 'compare')
    await sut.compare('any-value', 'any-hash')
    expect(compareSpy).toHaveBeenCalledWith('any-value', 'any-hash')
  })

  test('Should return true on compare success', async () => {
    const sut = makeSut()
    const comp = await sut.compare('any-value', 'any-value')
    expect(comp).toBe(true)
  })

  test('Should return false on compare fail', async () => {
    const sut = makeSut()
    jest.spyOn(bcrypt, 'compare').mockImplementationOnce(() => false)
    const isValid = await sut.compare('any-value', 'any-hash')
    expect(isValid).toBe(false)
  })

  test('Should throw when compare throws', async () => {
    const sut = makeSut()
    jest.spyOn(bcrypt, 'compare').mockImplementation(() => {
      throw new Error()
    })

    const promise = sut.compare('any-value', 'any-hash')
    await expect(promise).rejects.toThrow()
  })
})
