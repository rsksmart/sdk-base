import type { SDKErrorContext } from './types'

/**
 * Error codes for SDK errors
 */
export const ErrorCodes = {
  UNKNOWN: 'UNKNOWN_ERROR',
  INVALID_ADDRESS: 'INVALID_ADDRESS',
  INVALID_AMOUNT: 'INVALID_AMOUNT',
  INVALID_CHAIN: 'INVALID_CHAIN',

  CONTRACT_READ_FAILED: 'CONTRACT_READ_FAILED',
  CONTRACT_WRITE_FAILED: 'CONTRACT_WRITE_FAILED',
  CONTRACT_NOT_FOUND: 'CONTRACT_NOT_FOUND',
  SIMULATION_FAILED: 'SIMULATION_FAILED',

  TX_FAILED: 'TRANSACTION_FAILED',
  TX_REJECTED: 'TRANSACTION_REJECTED',
  TX_TIMEOUT: 'TRANSACTION_TIMEOUT',
  INSUFFICIENT_FUNDS: 'INSUFFICIENT_FUNDS',

  NETWORK_ERROR: 'NETWORK_ERROR',
  RPC_ERROR: 'RPC_ERROR',
} as const

export type ErrorCode = (typeof ErrorCodes)[keyof typeof ErrorCodes]

/**
 * Custom SDK Error class with additional context
 */
export class SDKError extends Error {
  readonly code: ErrorCode
  readonly module: string | undefined
  readonly details: Record<string, unknown> | undefined

  constructor(message: string, context: SDKErrorContext) {
    super(message)
    this.name = 'SDKError'
    this.code = context.code as ErrorCode
    this.module = context.module
    this.details = context.details
  }

  /**
   * Create a formatted error message with context
   */
  toJSON(): Record<string, unknown> {
    return {
      name: this.name,
      code: this.code,
      message: this.message,
      module: this.module,
      details: this.details,
    }
  }
}

/**
 * Check if an error is an SDK error
 */
export function isSDKError(error: unknown): error is SDKError {
  return error instanceof SDKError
}

/**
 * Create an SDK error from an unknown error
 */
export function toSDKError(
  error: unknown,
  defaultCode: ErrorCode = ErrorCodes.UNKNOWN,
  module?: string | undefined
): SDKError {
  if (isSDKError(error)) {
    return error
  }

  const message = error instanceof Error ? error.message : String(error)
  const details = error instanceof Error ? { originalError: error.name } : undefined

  return new SDKError(message, {
    code: defaultCode,
    module,
    details,
  })
}
