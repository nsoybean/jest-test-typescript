import { HTTP_CODES } from './../../../app/server_app/model/ServerModel'
import { ReservationsHandler } from './../../../app/server_app/handlers/ReservationsHandler'
import { LoginHandler } from './../../../app/server_app/handlers/LoginHandler'
import { RegisterHandler } from './../../../app/server_app/handlers/RegisterHandler'
import { Authorizer } from '../../../app/server_app/auth/Authorizer'
import { ReservationsDataAccess } from '../../../app/server_app/data/ReservationsDataAccess'
import { Server } from '../../../app/server_app/server/Server'

jest.mock('../../../app/server_app/auth/Authorizer')
jest.mock('../../../app/server_app/data/ReservationsDataAccess')
jest.mock('../../../app/server_app/handlers/LoginHandler')
jest.mock('../../../app/server_app/handlers/RegisterHandler')
jest.mock('../../../app/server_app/handlers/ReservationsHandler')

const requestMock = {
  url: '',
  headers: {
    'user-agent': 'jest-test'
  }
}

const responseMock = {
  end: jest.fn(),
  writeHead: jest.fn()
}

const serverMock = {
  listen: jest.fn(),
  close: jest.fn()
}

// study server.ts to see why callback is required here
// *** factory jest implementation
jest.mock('http', () => ({
  // replace implementation of function
  createServer: (cb: Function) => {
    cb(requestMock, responseMock)
    return serverMock
  }
}))

describe('Server test suite', () => {
  let sut: Server

  beforeEach(() => {
    sut = new Server()
    expect(Authorizer).toBeCalledTimes(1)
    expect(ReservationsDataAccess).toBeCalledTimes(1)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should start server on port 8080 and end the request', async () => {
    await sut.startServer()

    expect(serverMock.listen).toBeCalledWith(8080)
    expect(responseMock.end).toBeCalled()
  })

  it('should handle register request', async () => {
    requestMock.url = 'localhost:8080/register'
    const handleRequestSpy = jest.spyOn(
      RegisterHandler.prototype, // 'prototype' here refers to a class method. as opposed to a constructor of a class.
      'handleRequest'
    )

    await sut.startServer()
    expect(handleRequestSpy).toBeCalledTimes(1)
    expect(RegisterHandler).toBeCalledWith(
      requestMock,
      responseMock,
      expect.any(Authorizer) // jest matcher, any authorizer will do. usually used to check if function is called with the right type of argument instead of the argument itself.
    )
  })

  it('should handle login request', async () => {
    requestMock.url = 'localhost:8080/login'
    const handleRequestSpy = jest.spyOn(
      LoginHandler.prototype, // 'prototype' here refers to a class method. as opposed to a constructor of a class.
      'handleRequest'
    )

    await sut.startServer()
    expect(handleRequestSpy).toBeCalledTimes(1)
    expect(LoginHandler).toBeCalledWith(
      requestMock,
      responseMock,
      expect.any(Authorizer) // jest matcher, any authorizer will do. usually used to check if function is called with the right type of argument instead of the argument itself.
    )
  })

  it('should handle reservation request', async () => {
    requestMock.url = 'localhost:8080/reservation'
    const handleRequestSpy = jest.spyOn(
      ReservationsHandler.prototype, // 'prototype' here refers to a class method. as opposed to a constructor of a class.
      'handleRequest'
    )

    await sut.startServer()
    expect(handleRequestSpy).toBeCalledTimes(1)
    expect(ReservationsHandler).toBeCalledWith(
      requestMock,
      responseMock,
      expect.any(Authorizer), // jest matcher, any authorizer will do. usually used to check if function is called with the right type of argument instead of the argument itself.
      expect.any(ReservationsDataAccess)
    )
  })

  it('should do nothing for unsupported routes', async () => {
    requestMock.url = 'localhost:8080/someRandomRoute'
    const validateTokenSpy = jest.spyOn(
      Authorizer.prototype, // 'prototype' here refers to a class method. as opposed to a constructor of a class.
      'validateToken'
    )

    await sut.startServer()
    expect(validateTokenSpy).not.toBeCalled()
  })

  it('should handle errors in serving requests', async () => {
    requestMock.url = 'localhost:8080/reservation'
    const handleRequestSpy = jest.spyOn(
      ReservationsHandler.prototype, // 'prototype' here refers to a class method. as opposed to a constructor of a class.
      'handleRequest'
    )
    handleRequestSpy.mockRejectedValueOnce(new Error('Some error'))

    await sut.startServer()
    expect(responseMock.writeHead).toBeCalledWith(
      HTTP_CODES.INTERNAL_SERVER_ERROR,
      JSON.stringify('Internal server error: Some error')
    )
  })

  it('should stop server if stopped', async () => {
    await sut.startServer()
    await sut.stopServer()
    expect(serverMock.close).toBeCalledTimes(1)
  })
})
