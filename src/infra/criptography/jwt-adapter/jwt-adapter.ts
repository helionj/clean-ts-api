import { Encrypter } from '../../../data/protocols/cryptography/encrypter'
import jwt from 'jsonwebtoken'

export class JwtAdapter implements Encrypter {
  constructor (private readonly secret: string) {
    this.secret = secret
  }

  async encrypt (id: string): Promise<string> {
    const accessToken = jwt.sign({ id }, this.secret)
    return accessToken
  }
}
