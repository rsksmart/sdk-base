import type { Address as ViemAddress } from 'viem'

/**
 * Ethereum address type
 */
export type Address = ViemAddress

/**
 * Token amount with raw and formatted values
 */
export interface TokenAmount {
  /** Raw amount in smallest unit (wei) */
  value: bigint
  /** Formatted amount as string with decimals */
  formatted: string
  /** Token symbol */
  symbol?: string
}

/**
 * Percentage value
 */
export interface Percentage {
  /** Raw percentage value (e.g., 3500 for 35%) */
  value: number
  /** Formatted percentage string (e.g., "35%") */
  formatted: string
}

/**
 * Log levels for the SDK logger
 */
export type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'silent'

/**
 * Logger configuration
 */
export interface LoggerConfig {
  /** Minimum log level to display */
  level: LogLevel
  /** Custom prefix for log messages */
  prefix?: string
}

/**
 * SDK Error with additional context
 */
export interface SDKErrorContext {
  /** Error code for programmatic handling */
  code: string
  /** Module where error occurred */
  module?: string | undefined
  /** Additional error details */
  details?: Record<string, unknown> | undefined
}
