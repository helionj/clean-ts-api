import { Hasher } from '../../data/protocols/cryptography/hasher'
import bcrypt from 'bcrypt'
import { HashComparer } from '../../data/protocols/cryptography/hash-comparer'

export class BcryptAdapter implements Hasher, HashComparer {
  private readonly salt: number

  constructor (salt: number) {
    this.salt = salt
  }

  async compare (value: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(value, hash)
  }

  async hash (value: string): Promise<string> {
    return await bcrypt.hash(value, this.salt)
  }
}
