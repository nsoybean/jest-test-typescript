// specify custom file/ module
jest.mock('../../app/doubles/OtherUtils', () => ({
  ...jest.requireActual('../../app/doubles/OtherUtils'), // keep original functionality
  calculateComplexity: () => {
    // mock implementation of method 'calculateComplexity'
    return 10
  }
}))

// able to specify node_module directly
jest.mock('uuid', () => ({
  v4: () => '123' // mock generated uuid
}))

import * as OtherUtils from '../../app/doubles/OtherUtils'

describe('module tests', () => {
  test('calculate complexity', () => {
    const result = OtherUtils.calculateComplexity({} as any)
    expect(result).toBe(10)
  })

  test('keep other functions', () => {
    const result = OtherUtils.toUpperCase('abc')
    expect(result).toBe('ABC')
  })

  test('string with mocked uuid id', () => {
    const result = OtherUtils.toLowerCaseWithId('ABC')
    expect(result).toBe('abc123')
  })
})
