/**
 * @rsksmart/sdk-base
 *
 * Shared base functions and utilities for Rootstock SDK modules
 */

export type {
  Address,
  TokenAmount,
  Percentage,
  LogLevel,
  LoggerConfig,
  SDKErrorContext,
} from './types'

export {
  SDKError,
  ErrorCodes,
  isSDKError,
  toSDKError,
  type ErrorCode,
} from './errors'

export { Logger, createLogger, logger } from './logger'

export {
  formatTokenAmount,
  parseTokenAmount,
  toTokenAmount,
  formatPercentage,
  formatNumber,
  weiToEther,
  etherToWei,
  DEFAULT_DECIMALS,
  PERCENTAGE_PRECISION,
  isAddress,
  validateAddress,
  isZeroAddress,
  shortenAddress,
  isPositiveBigInt,
  isNonNegativeBigInt,
  validatePositiveAmount,
  isTransactionHash,
} from './utils'

export {
  createPriceService,
  calculateABI,
  calculateCyclePayoutUSD,
  type PriceService,
  type TokenPrice,
  type TokenPrices,
  type PriceServiceConfig,
  type ABICalculatorParams,
} from './prices'

export {
  getTokenAddresses,
  ZERO_ADDRESS,
  TOKEN_DECIMALS,
  type TokenAddresses,
  type TokenDecimals,
  type RootstockChainId,
} from './tokens'
