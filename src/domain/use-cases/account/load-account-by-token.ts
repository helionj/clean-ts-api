import { AccountModel } from '../../models/account'

export type AddAccountModel = {
  name: string
  email: string
  password: string
}

export interface LoadAccountByToken {

  load: (accessToken: string, role?: string) => Promise<AccountModel>
}
