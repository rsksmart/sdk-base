import { isAddress as viemIsAddress, getAddress } from 'viem'
import type { Address } from '../types'

/**
 * Check if a string is a valid Ethereum address
 */
export function isAddress(value: string): value is Address {
  return viemIsAddress(value)
}

/**
 * Validate and normalize an Ethereum address
 *
 * @param value - Address string to validate
 * @returns Checksummed address
 * @throws Error if address is invalid
 */
export function validateAddress(value: string): Address {
  if (!isAddress(value)) {
    throw new Error(`Invalid address: ${value}`)
  }
  return getAddress(value)
}

/**
 * Check if an address is the zero address
 */
export function isZeroAddress(address: string): boolean {
  return address.toLowerCase() === '0x0000000000000000000000000000000000000000'
}

/**
 * Shorten an address for display (e.g., "0x1234...5678")
 */
export function shortenAddress(address: string, chars: number = 4): string {
  if (!isAddress(address)) {
    return address
  }
  return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`
}

/**
 * Check if a value is a positive bigint
 */
export function isPositiveBigInt(value: bigint): boolean {
  return value > 0n
}

/**
 * Check if a value is a non-negative bigint
 */
export function isNonNegativeBigInt(value: bigint): boolean {
  return value >= 0n
}

/**
 * Validate that a value is a positive bigint
 *
 * @throws Error if value is not positive
 */
export function validatePositiveAmount(value: bigint, name: string = 'Amount'): void {
  if (value <= 0n) {
    throw new Error(`${name} must be positive, got: ${value}`)
  }
}

/**
 * Check if a string is a valid transaction hash
 */
export function isTransactionHash(value: string): boolean {
  return /^0x[a-fA-F0-9]{64}$/.test(value)
}

//TODO search for specific viem validations for TX Hash and isZeroAddress