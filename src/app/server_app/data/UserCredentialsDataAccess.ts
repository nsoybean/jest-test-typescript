import { Account } from '../model/AuthModel'
import { DataBase } from './DataBase'

// this is a consumer class, where parent class 'database' is created automatically in constructor
export class UserCredentialsDataAccess {
  // constructor
  // slightly more difficult to test as it doesnt have a constructor with arguments. 'DataBase' needs to be mocked via jest.fn()
  private userCredentialsDataBase = new DataBase<Account>()

  public async addUser(user: Account) {
    const accountId = await this.userCredentialsDataBase.insert(user)
    return accountId
  }

  public async getUserById(id: string) {
    const user = await this.userCredentialsDataBase.getBy('id', id)
    return user
  }

  public async getUserByUserName(userName: string) {
    const user = await this.userCredentialsDataBase.getBy('userName', userName)
    return user
  }
}
