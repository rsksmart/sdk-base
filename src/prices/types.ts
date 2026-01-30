/**
 * Price information for a token
 */
export interface TokenPrice {
  /** Token symbol */
  symbol: string
  /** Price in USD */
  price: number
  /** Last update timestamp */
  lastUpdated: string
}

/**
 * Collection of token prices
 */
export interface TokenPrices {
  RIF: TokenPrice | null
  RBTC: TokenPrice | null
  USDRIF: TokenPrice | null
  stRIF: TokenPrice | null
}

/**
 * Configuration for the price service
 */
export interface PriceServiceConfig {
  /** Base URL for the price API */
  baseUrl?: string
  /** Chain ID (30 for mainnet, 31 for testnet) */
  chainId?: number
  /** Request timeout in milliseconds */
  timeout?: number
}

/**
 * Raw response from RIF Wallet Services price API
 */
export interface RWSPriceResponse {
  [address: string]: {
    price: number
    lastUpdated: string
  }
}
