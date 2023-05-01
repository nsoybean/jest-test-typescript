import { Account } from './../../../app/server_app/model/AuthModel'
import { DataBase } from '../../../app/server_app/data/DataBase'
import { UserCredentialsDataAccess } from '../../../app/server_app/data/UserCredentialsDataAccess'

const insertMock = jest.fn()
const getByMock = jest.fn()

// mocking consumer class
// UserCredentialsDataAccess is a consumer class
// parent class (database) is called in constructor
// unit testing should be limited to consumer class, independent of parent
// hence, injecting mock into consumer classes
jest.mock('../../../app/server_app/data/DataBase', () => {
  // return constructor object (with same name) in callback function
  return {
    DataBase: jest.fn().mockImplementation(() => {
      // return reference to methods (mocked)
      // wont be called when DataBase is initialized, only when used. This prevents usage before initialization error.
      return {
        insert: insertMock,
        getBy: getByMock
      }
    })
  }
})

describe('UserCredentialsDataAccess test suite', () => {
  let sut: UserCredentialsDataAccess

  const someAccount: Account = {
    id: '',
    userName: 'someUserName',
    password: 'somePassword'
  }
  const someId = '1234'

  beforeEach(() => {
    // as per implementation, new database instance (connection) will be created due to method in constructor.
    // hence jest mock is required
    sut = new UserCredentialsDataAccess()
    expect(DataBase).toHaveBeenCalledTimes(1)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should add user and return id', async () => {
    // use mockReturnValueOnce for async calls
    // this mocks the 'insert' method of the parent class 'Database' and hence limits the test to only UserCredentialDataAccess
    insertMock.mockReturnValueOnce(someId)

    const actualId = await sut.addUser(someAccount)
    expect(actualId).toBe(someId)
    expect(insertMock).toHaveBeenCalledWith(someAccount)
  })

  it('should get user by id', async () => {
    getByMock.mockResolvedValueOnce(someAccount)

    const actualUser = await sut.getUserById(someId)

    expect(actualUser).toEqual(someAccount)
    expect(getByMock).toHaveBeenCalledWith('id', someId)
  })

  it('should get user by name', async () => {
    getByMock.mockResolvedValueOnce(someAccount)

    const actualUser = await sut.getUserByUserName(someAccount.userName)

    expect(actualUser).toEqual(someAccount)
    expect(getByMock).toHaveBeenCalledWith('userName', someAccount.userName)
  })
})
