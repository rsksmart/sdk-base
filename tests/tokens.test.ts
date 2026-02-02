import { describe, it, expect } from 'vitest'
import { TOKEN_DECIMALS, ZERO_ADDRESS, isZeroAddress } from '../src'

describe('TOKEN_DECIMALS', () => {
  it('should have correct decimals for RIF', () => {
    expect(TOKEN_DECIMALS.RIF).toBe(18)
  })

  it('should have correct decimals for stRIF', () => {
    expect(TOKEN_DECIMALS.stRIF).toBe(18)
  })

  it('should have correct decimals for USDRIF', () => {
    expect(TOKEN_DECIMALS.USDRIF).toBe(18)
  })

  it('should have correct decimals for RBTC', () => {
    expect(TOKEN_DECIMALS.RBTC).toBe(18)
  })
})

describe('ZERO_ADDRESS', () => {
  it('should be the zero address', () => {
    expect(ZERO_ADDRESS).toBe('0x0000000000000000000000000000000000000000')
  })
})

describe('isZeroAddress', () => {
  it('should return true for zero address', () => {
    expect(isZeroAddress(ZERO_ADDRESS)).toBe(true)
  })

  it('should return true for lowercase zero address', () => {
    expect(isZeroAddress('0x0000000000000000000000000000000000000000')).toBe(true)
  })

  it('should return false for non-zero address', () => {
    expect(isZeroAddress('0x1234567890123456789012345678901234567890')).toBe(false)
  })
})
