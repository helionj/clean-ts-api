import { AddAccountModel } from '../../../../domain/use-cases/account/add-account'
import { AccountModel } from '../../../../domain/models/account'

export interface AddAccountRepository {
  add: (accountData: AddAccountModel) => Promise<AccountModel>
}
