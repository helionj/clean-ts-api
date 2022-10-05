import { Collection } from 'mongodb'
import { MongoHelper } from '../helpers/mongo-helper'
import { AccountMongoRepository } from './account-mongo-repository'
import { mockAddAccountParams } from '../../../../domain/test'

let accountCollection: Collection

const makeSut = (): AccountMongoRepository => {
  return new AccountMongoRepository()
}

describe('Account Mongo repository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })
  beforeEach(async () => {
    accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })

  describe('add', () => {
    test('Should return an account on add success', async () => {
      const sut = makeSut()
      const account = await sut.add(mockAddAccountParams())
      expect(account).toBeTruthy()
      expect(account.id).toBeTruthy()
      expect(account.name).toBe('any-name')
      expect(account.email).toBe('any-email@email.com')
      expect(account.password).toBe('any-password')
    })
  })
  describe('loadByEmail', () => {
    test('Should return an account on loadByEmail success', async () => {
      const sut = makeSut()
      await accountCollection.insertOne(mockAddAccountParams())
      const account = await sut.loadByEmail('any-email@email.com')
      expect(account).toBeTruthy()
      expect(account.id).toBeTruthy()
      expect(account.name).toBe('any-name')
      expect(account.email).toBe('any-email@email.com')
      expect(account.password).toBe('any-password')
    })
    test('Should return null on loadByEmail fails', async () => {
      const sut = makeSut()
      const account = await sut.loadByEmail('any-email@email.com')
      expect(account).toBeFalsy()
    })
  })
  describe('updateAccessToken', () => {
    test('Should update the account accessToken on updateAccessToken success', async () => {
      const sut = makeSut()
      const res = await accountCollection.insertOne(mockAddAccountParams())
      const { insertedId: id } = res
      const accountById = await accountCollection.findOne({ _id: id })
      expect(accountById.accessToken).toBeFalsy()
      await sut.updateAccessToken(accountById._id.toHexString(), 'any-token')
      const account = await accountCollection.findOne({ _id: id })
      expect(account).toBeTruthy()
      expect(account.accessToken).toBe('any-token')
    })
  })
  describe('loadByToken', () => {
    test('Should return an account on loadByToken without role', async () => {
      const sut = makeSut()
      await accountCollection.insertOne({
        name: 'any-name',
        email: 'any-email@email.com',
        password: 'any-password',
        accessToken: 'any-token'
      })
      const account = await sut.loadByToken('any-token')
      expect(account).toBeTruthy()
      expect(account.id).toBeTruthy()
      expect(account.name).toBe('any-name')
      expect(account.email).toBe('any-email@email.com')
      expect(account.password).toBe('any-password')
    })
    test('Should return an account on loadByToken with admin role', async () => {
      const sut = makeSut()
      await accountCollection.insertOne({
        name: 'any-name',
        email: 'any-email@email.com',
        password: 'any-password',
        accessToken: 'any-token',
        role: 'admin'
      })
      const account = await sut.loadByToken('any-token', 'admin')
      expect(account).toBeTruthy()
      expect(account.id).toBeTruthy()
      expect(account.name).toBe('any-name')
      expect(account.email).toBe('any-email@email.com')
      expect(account.password).toBe('any-password')
    })
    test('Should not return an account on loadByToken with invalid role', async () => {
      const sut = makeSut()
      await accountCollection.insertOne({
        name: 'any-name',
        email: 'any-email@email.com',
        password: 'any-password',
        accessToken: 'any-token'
      })
      const account = await sut.loadByToken('any-token', 'admin')
      expect(account).toBeFalsy()
    })
    test('Should return null on loadByToken fails', async () => {
      const sut = makeSut()
      const account = await sut.loadByToken('any-token')
      expect(account).toBeFalsy()
    })
    test('Should return an account on loadByToken with admin role', async () => {
      const sut = makeSut()
      await accountCollection.insertOne({
        name: 'any-name',
        email: 'any-email@email.com',
        password: 'any-password',
        accessToken: 'any-token',
        role: 'admin'
      })
      const account = await sut.loadByToken('any-token')
      expect(account).toBeTruthy()
      expect(account.id).toBeTruthy()
      expect(account.name).toBe('any-name')
      expect(account.email).toBe('any-email@email.com')
      expect(account.password).toBe('any-password')
    })
  })
})
