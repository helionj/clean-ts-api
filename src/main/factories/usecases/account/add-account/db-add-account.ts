import { DbAddAccount } from '../../../../../data/usecases/account/add-account/db-add-account'
import { AddAccount } from '../../../../../domain/use-cases/account/add-account'
import { BcryptAdapter } from '../../../../../infra/criptography/bcript-adapter/bcrypt-adapter'
import { AccountMongoRepository } from '../../../../../infra/db/mongodb/account/account-mongo-repository'

export const makeDbAddAccount = (): AddAccount => {
  const salt = 12
  const bcryptAdapter = new BcryptAdapter(salt)
  const accountMongoRepository = new AccountMongoRepository()
  return new DbAddAccount(bcryptAdapter, accountMongoRepository, accountMongoRepository)
}
