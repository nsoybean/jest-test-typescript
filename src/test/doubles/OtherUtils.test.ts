import {
  calculateComplexity,
  toUpperCaseWithCb,
  OtherStringUtils
} from '../../app/doubles/OtherUtils'

describe('OtherUtils test suite', () => {
  /**
   * SPIES
   */
  describe('OtherStringUtils tests with spies', () => {
    let sut: OtherStringUtils

    beforeEach(() => {
      sut = new OtherStringUtils() // use class instance (objects) as SUT
    })

    test('Use a spy to track calls', () => {
      const toUpperCaseSpy = jest.spyOn(sut, 'toUpperCase') // two arg: (sut, public method of SUT)
      sut.toUpperCase('asa')
      expect(toUpperCaseSpy).toBeCalledWith('asa')
    })

    // this example is impt, as most of the time our service interacts with other modules/ dependencies
    test('Use a spy to track calls to other module', () => {
      const consoleLogSpy = jest.spyOn(console, 'log')
      sut.logString('abc')
      expect(consoleLogSpy).toBeCalledWith('abc')
    })

    // change original functionality via spy without injected into SUT
    test('Use a spy to replace the implementation of a method', () => {
      jest.spyOn(sut, 'callExternalService').mockImplementation(() => {
        console.log('calling mocked implementation!!!') // replace implementation of method in object
      })
      sut.callExternalService()
    })
  })

  /**
   * MOCK
   */
  describe('Tracking callbacks with Jest mocks', () => {
    const callBackMock = jest.fn()

    // impt to clear states after each test
    afterEach(() => {
      jest.clearAllMocks()
    })

    it('calls callback for invalid argument - track calls', () => {
      const actual = toUpperCaseWithCb('', callBackMock)
      expect(actual).toBeUndefined()
      expect(callBackMock).toBeCalledWith('Invalid argument!')
      expect(callBackMock).toBeCalledTimes(1)
    })

    it('calls callback for valid argument - track calls', () => {
      const actual = toUpperCaseWithCb('abc', callBackMock)
      expect(actual).toBe('ABC')
      expect(callBackMock).toBeCalledWith('called function with abc')
      expect(callBackMock).toBeCalledTimes(1)
    })
  })

  it('Calculates complexity', () => {
    // stubs (incomplete objects used strictly for testing purposes)
    const someInfo = {
      length: 5,
      extraInfo: {
        field1: 'someInfo',
        field2: 'someOtherInfo'
      }
    }

    const actual = calculateComplexity(someInfo as any)
    expect(actual).toBe(10)
  })
})
