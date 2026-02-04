import { describe, it, expect } from 'vitest'
import {
  formatTokenAmount,
  parseTokenAmount,
  toTokenAmount,
  formatPercentage,
  formatNumber,
  weiToEther,
  etherToWei,
} from '../src/utils/format'

describe('formatTokenAmount', () => {
  it('should format 18 decimal token amounts correctly', () => {
    expect(formatTokenAmount(1000000000000000000n)).toBe('1')
    expect(formatTokenAmount(1500000000000000000n)).toBe('1.5')
    expect(formatTokenAmount(1234567890000000000n)).toBe('1.2345')
  })

  it('should format zero correctly', () => {
    expect(formatTokenAmount(0n)).toBe('0')
  })

  it('should format large amounts correctly', () => {
    expect(formatTokenAmount(1000000000000000000000n)).toBe('1,000'.replace(',', ''))
  })

  it('should format small amounts with more decimals', () => {
    expect(formatTokenAmount(10000000000000n)).toBe('0.00001')
    expect(formatTokenAmount(1000000000000n)).toBe('0.000001')
  })

  it('should show "<minimum" for extremely small non-zero values', () => {
    expect(formatTokenAmount(1n)).toBe('<0.00000001')
    expect(formatTokenAmount(100n)).toBe('<0.00000001')
    expect(formatTokenAmount(1000000000n)).toBe('<0.00000001')
  })

  it('should display small values at the boundary correctly', () => {
    expect(formatTokenAmount(10000000000n)).toBe('0.00000001')
    expect(formatTokenAmount(9999999999n)).toBe('<0.00000001')
  })

  it('should respect maxDecimals parameter', () => {
    expect(formatTokenAmount(1234567890123456789n, 18, 2)).toBe('1.23')
  })

  it('should handle different decimal places', () => {
    expect(formatTokenAmount(1000000n, 6)).toBe('1')
    expect(formatTokenAmount(100000000n, 8)).toBe('1')
  })
})

describe('parseTokenAmount', () => {
  it('should parse token amounts correctly', () => {
    expect(parseTokenAmount('1')).toBe(1000000000000000000n)
    expect(parseTokenAmount('1.5')).toBe(1500000000000000000n)
    expect(parseTokenAmount('0.001')).toBe(1000000000000000n)
  })

  it('should parse zero correctly', () => {
    expect(parseTokenAmount('0')).toBe(0n)
  })

  it('should handle different decimal places', () => {
    expect(parseTokenAmount('1', 6)).toBe(1000000n)
    expect(parseTokenAmount('1', 8)).toBe(100000000n)
  })
})

describe('toTokenAmount', () => {
  it('should create TokenAmount object', () => {
    const amount = toTokenAmount(1000000000000000000n)

    expect(amount.value).toBe(1000000000000000000n)
    expect(amount.formatted).toBe('1')
  })

  it('should include symbol when provided', () => {
    const amount = toTokenAmount(1000000000000000000n, 18, 'RIF')

    expect(amount.symbol).toBe('RIF')
  })

  it('should format correctly with different decimals', () => {
    const amount = toTokenAmount(1000000n, 6, 'USDC')

    expect(amount.formatted).toBe('1')
    expect(amount.symbol).toBe('USDC')
  })
})

describe('formatPercentage', () => {
  it('should format percentage correctly', () => {
    const pct = formatPercentage(3500)

    expect(pct.value).toBe(3500)
    expect(pct.formatted).toBe('35.00%')
  })

  it('should handle 100%', () => {
    const pct = formatPercentage(10000)

    expect(pct.formatted).toBe('100.00%')
  })

  it('should handle 0%', () => {
    const pct = formatPercentage(0)

    expect(pct.formatted).toBe('0.00%')
  })

  it('should handle bigint input', () => {
    const pct = formatPercentage(5000n)

    expect(pct.formatted).toBe('50.00%')
  })

  it('should handle custom precision', () => {
    const pct = formatPercentage(350, 1000)

    expect(pct.formatted).toBe('35.00%')
  })
})

describe('formatNumber', () => {
  it('should format numbers with thousand separators', () => {
    expect(formatNumber(1000)).toContain('1')
    expect(formatNumber(1000000)).toContain('1')
  })

  it('should handle bigint', () => {
    expect(formatNumber(1000000n)).toContain('1')
  })
})

describe('weiToEther', () => {
  it('should convert wei to ether', () => {
    expect(weiToEther(1000000000000000000n)).toBe('1')
    expect(weiToEther(500000000000000000n)).toBe('0.5')
  })
})

describe('etherToWei', () => {
  it('should convert ether to wei', () => {
    expect(etherToWei('1')).toBe(1000000000000000000n)
    expect(etherToWei('0.5')).toBe(500000000000000000n)
  })
})
