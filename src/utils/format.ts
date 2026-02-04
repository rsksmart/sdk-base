import { formatUnits, parseUnits } from 'viem'
import type { TokenAmount, Percentage } from '../types'

/**
 * Default decimals for tokens (18 for most ERC20 tokens)
 */
export const DEFAULT_DECIMALS = 18

/**
 * Percentage precision (10000 = 100%)
 */
export const PERCENTAGE_PRECISION = 10000

/**
 * Format a bigint value to a human-readable string
 *
 * For small values (< 0.0001), shows up to 8 decimals to capture significant digits.
 * For larger values, shows up to 4 decimals.
 *
 * @param value - Value in wei/smallest unit
 * @param decimals - Number of decimals (default: 18)
 * @param maxDecimals - Maximum decimals to display (default: auto-detected)
 */
export function formatTokenAmount(
  value: bigint,
  decimals: number = DEFAULT_DECIMALS,
  maxDecimals?: number
): string {
  if (value === 0n) {
    return '0'
  }

  const formatted = formatUnits(value, decimals)
  const [integer, decimal] = formatted.split('.')

  if (!decimal) {
    return integer ?? '0'
  }

  let effectiveMaxDecimals = maxDecimals
  if (effectiveMaxDecimals === undefined) {
    const numValue = parseFloat(formatted)
    if (numValue > 0 && numValue < 0.0001) {
      effectiveMaxDecimals = 8
    } else if (numValue > 0 && numValue < 1) {
      effectiveMaxDecimals = 6
    } else {
      effectiveMaxDecimals = 4
    }
  }

  const trimmed = decimal.slice(0, effectiveMaxDecimals).replace(/0+$/, '')

  if (!trimmed && value > 0n) {
    const minDisplay = '0.' + '0'.repeat(effectiveMaxDecimals - 1) + '1'
    return `<${minDisplay}`
  }

  return trimmed ? `${integer}.${trimmed}` : (integer ?? '0')
}

/**
 * Parse a string amount to bigint
 *
 * @param amount - Amount as string (e.g., "1.5")
 * @param decimals - Number of decimals (default: 18)
 */
export function parseTokenAmount(
  amount: string,
  decimals: number = DEFAULT_DECIMALS
): bigint {
  return parseUnits(amount, decimals)
}

/**
 * Create a TokenAmount object from a bigint value
 */
export function toTokenAmount(
  value: bigint,
  decimals: number = DEFAULT_DECIMALS,
  symbol?: string
): TokenAmount {
  return {
    value,
    formatted: formatTokenAmount(value, decimals),
    symbol,
  }
}

/**
 * Format a percentage value
 *
 * @param value - Raw percentage value (e.g., 3500 for 35%)
 * @param precision - Precision of the raw value (default: 10000 = 100%)
 */
export function formatPercentage(
  value: number | bigint,
  precision: number = PERCENTAGE_PRECISION
): Percentage {
  const numValue = typeof value === 'bigint' ? Number(value) : value
  const percentage = (numValue / precision) * 100

  return {
    value: numValue,
    formatted: `${percentage.toFixed(2)}%`,
  }
}

/**
 * Format a large number with thousand separators
 */
export function formatNumber(value: number | bigint, locale: string = 'en-US'): string {
  const num = typeof value === 'bigint' ? Number(value) : value
  return num.toLocaleString(locale)
}

/**
 * Convert Wei to Ether (or any 18-decimal token)
 */
export function weiToEther(wei: bigint): string {
  return formatTokenAmount(wei, 18)
}

/**
 * Convert Ether to Wei (or any 18-decimal token)
 */
export function etherToWei(ether: string): bigint {
  return parseTokenAmount(ether, 18)
}
