import { IncomingMessage } from 'http'
// writing event-based test

import { getRequestBody } from '../../../app/server_app/utils/Utils'

const requestMock = {
  on: jest.fn()
}
const someObject = { name: 'john', age: 30, city: 'Singapore' }
const someObjectStringified = JSON.stringify(someObject)

describe('getRequestBody test suite', () => {
  it('should return object for valid JSON', async () => {
    // mock
    requestMock.on.mockImplementation((event, cb) => {
      if (event === 'data') {
        cb(someObjectStringified)
      } else cb()
    })

    const actual = await getRequestBody(requestMock as any as IncomingMessage)
    // equality operator for objects
    expect(actual).toEqual(someObject)
  })
  it('should throw error for invalid JSON', async () => {
    requestMock.on.mockImplementation((event, cb) => {
      if (event === 'data') {
        cb('a' + someObjectStringified) // simulate bad input
      } else cb()
    })

    await expect(
      getRequestBody(requestMock as any as IncomingMessage)
    ).rejects.toThrow('Unexpected token a in JSON at position 0')
  })
  it('should throw error for unexpected error', async () => {
    const someError = new Error('Something went wrong')
    requestMock.on.mockImplementation((event, cb) => {
      if (event === 'error') {
        cb(someError)
      }
    })

    await expect(
      getRequestBody(requestMock as any as IncomingMessage)
    ).rejects.toThrow(someError)
  })
})
