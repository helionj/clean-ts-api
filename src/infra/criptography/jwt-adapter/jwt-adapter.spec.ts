import jwt from 'jsonwebtoken'
import { JwtAdapter } from './jwt-adapter'
jest.mock('jsonwebtoken', () => ({
  async sign (): Promise<string> {
    return await new Promise(resolve => resolve('any-token'))
  }
}))
describe('Jwt Adapter', () => {
  test('Should call sign with correct values', async () => {
    const sut = new JwtAdapter('secret')
    const signSpy = jest.spyOn(jwt, 'sign')
    await sut.encrypt('any-id')
    expect(signSpy).toBeCalledWith({ id: 'any-id' }, 'secret')
  })

  test('Should return a token on sign success', async () => {
    const sut = new JwtAdapter('secret')
    const accessToken = await sut.encrypt('any-id')
    expect(accessToken).toBe('any-token')
  })
})
