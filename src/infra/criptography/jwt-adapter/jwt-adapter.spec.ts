import jwt from 'jsonwebtoken'
import { JwtAdapter } from './jwt-adapter'
jest.mock('jsonwebtoken', () => ({
  async sign (): Promise<string> {
    return await Promise.resolve('any-token')
  },
  async verify (): Promise<string> {
    return await Promise.resolve('any-token')
  }
}))
const makeSut = (): JwtAdapter => {
  return new JwtAdapter('secret')
}
describe('Jwt Adapter', () => {
  describe('sign', () => {
    test('Should call sign with correct values', async () => {
      const sut = makeSut()
      const signSpy = jest.spyOn(jwt, 'sign')
      await sut.encrypt('any-id')
      expect(signSpy).toBeCalledWith({ id: 'any-id' }, 'secret')
    })
    test('Should return a token on sign success', async () => {
      const sut = makeSut()
      const accessToken = await sut.encrypt('any-id')
      expect(accessToken).toBe('any-token')
    })
    test('Should throw if sign throws', async () => {
      const sut = makeSut()
      jest.spyOn(jwt, 'sign').mockImplementationOnce(() => {
        throw new Error()
      })
      const promise = sut.encrypt('any-id')
      await expect(promise).rejects.toThrow()
    })
  })
  describe('verify', () => {
    test('Should call vrify with correct values', async () => {
      const sut = makeSut()
      const verifySpy = jest.spyOn(jwt, 'verify')
      await sut.decrypt('any-token')
      expect(verifySpy).toBeCalledWith('any-token', 'secret')
    })
    test('Should return a value on verify success', async () => {
      const sut = makeSut()
      const value = await sut.decrypt('any-id')
      expect(value).toBe('any-token')
    })
    test('Should throw if verify throws', async () => {
      const sut = makeSut()
      jest.spyOn(jwt, 'verify').mockImplementationOnce(() => {
        throw new Error()
      })
      const promise = sut.decrypt('any-id')
      await expect(promise).rejects.toThrow()
    })
  })
})
