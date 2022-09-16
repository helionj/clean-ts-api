import { LoadAccountByToken } from '../../../domain/use-cases/load-account-by-token'
import { Decrypter } from '../../protocols/cryptography/decrypter'
import { LoadAccountByTokenRepository } from '../../protocols/db/account/loud-account-by-token-repository'
import { AccountModel } from '../add-account/db-add-account-protocols'

export class DbLoadAccountByToken implements LoadAccountByToken {
  constructor (private readonly decrypter: Decrypter,
    private readonly loadAccountByTokenRepository: LoadAccountByTokenRepository) {}

  async load (accessToken: string, role?: string): Promise<AccountModel> {
    const token = await this.decrypter.decrypt(accessToken)
    if (token) {
      const account = await this.loadAccountByTokenRepository.loadByToken(accessToken, role)
      if (account) {
        return account
      }
    }
    return null
  }
}
