import type { Address } from 'viem'

/**
 * Rootstock Chain IDs
 */
export type RootstockChainId = 30 | 31

/**
 * Token addresses structure
 */
export interface TokenAddresses {
  /** RIF Token */
  RIF: Address
  /** stRIF Token (staked RIF) */
  stRIF: Address
  /** USDRIF Stablecoin */
  USDRIF: Address
  /** 
   * COINBASE_ADDRESS - Special address for native RBTC in reward contracts
   */
  COINBASE_ADDRESS: Address
}

/**
 * Token addresses for Rootstock Mainnet (chainId: 30)
 */
const mainnetTokenAddresses: TokenAddresses = {
  RIF: '0x2acc95758f8b5f583470ba265eb685a8f45fc9d5' as Address,
  stRIF: '0x5db91e24bd32059584bbdb831a901f1199f3d459' as Address,
  USDRIF: '0x3a15461d8ae0f0fb5fa2629e9da7d66a794a6e37' as Address,
  COINBASE_ADDRESS: '0xf7ab6cfaebbadfe8b5494022c4c6db776bd63b6b' as Address,
}

/**
 * Token addresses for Rootstock Testnet (chainId: 31)
 */
const testnetTokenAddresses: TokenAddresses = {
  RIF: '0x19f64674d8a5b4e652319f5e239efd3bc969a1fe' as Address,
  stRIF: '0xe88d04062060b196b0f220afa784168d4b3657e9' as Address,
  USDRIF: '0x8dbf326e12a9ff37ed6ddf75ada548c2640a6482' as Address,
  COINBASE_ADDRESS: '0xf7ab6cfaebbadfe8b5494022c4c6db776bd63b6b' as Address,
}

/**
 * Get token addresses for a specific chain
 * 
 * @param chainId - Rootstock chain ID (30 for mainnet, 31 for testnet)
 * @returns Token addresses for the specified chain
 */
export function getTokenAddresses(chainId: RootstockChainId): TokenAddresses {
  switch (chainId) {
    case 30:
      return mainnetTokenAddresses
    case 31:
      return testnetTokenAddresses
    default:
      throw new Error(`Unsupported chain ID: ${chainId}`)
  }
}

/**
 * Zero address constant (used for native RBTC in price APIs)
 */
export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000' as Address

/**
 * Token decimals for Rootstock tokens
 * All major tokens on Rootstock use 18 decimals
 */
export const TOKEN_DECIMALS = {
  /** RIF Token decimals */
  RIF: 18,
  /** stRIF Token decimals */
  stRIF: 18,
  /** USDRIF Stablecoin decimals */
  USDRIF: 18,
  /** Native RBTC decimals */
  RBTC: 18,
} as const

/** Type for token decimal values */
export type TokenDecimals = typeof TOKEN_DECIMALS
