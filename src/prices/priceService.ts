import type { TokenPrice, TokenPrices, PriceServiceConfig, RWSPriceResponse } from './types'
import { getTokenAddresses, ZERO_ADDRESS, type RootstockChainId } from '../tokens'

/**
 * Default RIF Wallet Services URLs
 */
const RWS_URLS = {
  mainnet: 'https://rws.app.rootstockcollective.xyz',
  testnet: 'https://dev.rws.app.rootstockcollective.xyz',
} as const

/**
 * Default configuration
 */
const DEFAULT_CONFIG: Required<PriceServiceConfig> = {
  baseUrl: RWS_URLS.mainnet,
  chainId: 30,
  timeout: 10000,
}

/**
 * Create a price service instance
 */
export function createPriceService(config: PriceServiceConfig = {}) {
  const finalConfig: Required<PriceServiceConfig> = {
    ...DEFAULT_CONFIG,
    ...config,
  }

  if (!config.baseUrl) {
    finalConfig.baseUrl = finalConfig.chainId === 31 ? RWS_URLS.testnet : RWS_URLS.mainnet
  }

  const tokenAddresses = getTokenAddresses(finalConfig.chainId as RootstockChainId)

  return {
    /**
     * Fetch current token prices from RIF Wallet Services
     */
    async fetchPrices(): Promise<TokenPrices> {
      const addresses = [tokenAddresses.RIF, ZERO_ADDRESS].join(',')

      const url = `${finalConfig.baseUrl}/price?addresses=${addresses}&convert=USD&chainId=${finalConfig.chainId}`

      try {
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), finalConfig.timeout)

        const response = await fetch(url, {
          signal: controller.signal,
          headers: { Accept: 'application/json' },
        })

        clearTimeout(timeoutId)

        if (!response.ok) {
          throw new Error(`Price API error: ${response.status} ${response.statusText}`)
        }

        const data = (await response.json()) as RWSPriceResponse

        return mapPriceResponse(data, tokenAddresses.RIF)
      } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') {
          throw new Error('Price fetch timeout')
        }
        throw error
      }
    },

    /**
     * Get the base URL being used
     */
    get baseUrl(): string {
      return finalConfig.baseUrl
    },

    /**
     * Get the chain ID being used
     */
    get chainId(): number {
      return finalConfig.chainId
    },
  }
}

/**
 * Map RWS API response to TokenPrices
 */
function mapPriceResponse(
  data: RWSPriceResponse,
  rifAddress: string
): TokenPrices {
  const rifData = data[rifAddress.toLowerCase()] || data[rifAddress]
  const rbtcData = data[ZERO_ADDRESS.toLowerCase()] || data[ZERO_ADDRESS]

  const rifPrice: TokenPrice | null = rifData
    ? {
        symbol: 'RIF',
        price: rifData.price,
        lastUpdated: rifData.lastUpdated,
      }
    : null

  const rbtcPrice: TokenPrice | null = rbtcData
    ? {
        symbol: 'RBTC',
        price: rbtcData.price,
        lastUpdated: rbtcData.lastUpdated,
      }
    : null

  const stRifPrice: TokenPrice | null = rifPrice
    ? {
        symbol: 'stRIF',
        price: rifPrice.price,
        lastUpdated: rifPrice.lastUpdated,
      }
    : null

  const usdrifPrice: TokenPrice = {
    symbol: 'USDRIF',
    price: 1,
    lastUpdated: new Date().toISOString(),
  }

  return {
    RIF: rifPrice,
    RBTC: rbtcPrice,
    stRIF: stRifPrice,
    USDRIF: usdrifPrice,
  }
}

/**
 * Price service instance type
 */
export type PriceService = ReturnType<typeof createPriceService>
