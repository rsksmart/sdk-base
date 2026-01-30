import Big from 'big.js'
import type { TokenPrices } from './types'

/**
 * Scale factor for wei/ether conversion (10^18)
 * Using string for Big.js compatibility in decimal calculations
 * Note: it is needed to use string for Big.js compatibility in decimal calculations
 */
const WEI_SCALE = '1000000000000000000' // 10^18

/** Number of 2-week cycles per year */
//TODO: Make this CYCLES_PER_YEAR variable configurable (maybe .env variable or a json config file) also, ask Collective team for the correct value
const CYCLES_PER_YEAR = 26

/**
 * Parameters for calculating Annual Backers Incentives
 */
export interface ABICalculatorParams {
  /** Total RIF rewards for the cycle (in wei) */
  rewardsRif: bigint
  /** Total RBTC rewards for the cycle (in wei) */
  rewardsRbtc: bigint
  /** Total USDRIF rewards for the cycle (in wei) */
  rewardsUsdrif: bigint
  /** Total allocation across all gauges (in wei) */
  totalAllocation: bigint
  /** Weighted average backer reward percentage in wei scale (10^18 = 100%) */
  weightedAvgBackerRewardPct: bigint
}

/**
 * Calculate the cycle payout in wei
 * Returns: (rifAmount * rifPrice + rbtcAmount * rbtcPrice + usdrifAmount * usdrifPrice) / WeiPerEther
 *
 * @param rifAmount - RIF amount in wei
 * @param rbtcAmount - RBTC amount in wei
 * @param usdrifAmount - USDRIF amount in wei
 * @param prices - Token prices in USD
 * @returns Cycle payout as Big (in wei scale for USD value)
 */
export function calculateCyclePayoutWei(
  rifAmount: bigint,
  rbtcAmount: bigint,
  usdrifAmount: bigint,
  prices: TokenPrices
): Big {
  const rifPrice = Big(prices.RIF?.price ?? 0)
  const rbtcPrice = Big(prices.RBTC?.price ?? 0)
  const usdrifPrice = Big(prices.USDRIF?.price ?? 1)

  const rifPriceWei = rifPrice.mul(WEI_SCALE)
  const rbtcPriceWei = rbtcPrice.mul(WEI_SCALE)
  const usdrifPriceWei = usdrifPrice.mul(WEI_SCALE)

  const rifValue = Big(rifAmount.toString()).mul(rifPriceWei)
  const rbtcValue = Big(rbtcAmount.toString()).mul(rbtcPriceWei)
  const usdrifValue = Big(usdrifAmount.toString()).mul(usdrifPriceWei)

  return rifValue.add(rbtcValue).add(usdrifValue).div(WEI_SCALE)
}

/**
 * Calculate the USD value of cycle rewards
 */
export function calculateCyclePayoutUSD(
  rifAmount: bigint,
  rbtcAmount: bigint,
  usdrifAmount: bigint,
  prices: TokenPrices
): number {
  const payoutWei = calculateCyclePayoutWei(rifAmount, rbtcAmount, usdrifAmount, prices)
  return payoutWei.div(WEI_SCALE).toNumber()
}

/**
 * Calculate Annual Backers Incentives (ABI) percentage using compound interest formula
 *
 * Formula: ABI = ((1 + rewardsPerStRif / WeiPerEther / rifPrice)^26 - 1) * 100
 *
 * Where:
 * - rewardsPerStRif = cyclePayout * weightedAvgBackerRewardPct / totalAllocation
 * - cyclePayout = total value in wei scale
 *
 * @param params - Calculation parameters
 * @param prices - Token prices
 * @returns ABI percentage (e.g., 16.5 means 16.5%)
 */
export function calculateABI(params: ABICalculatorParams, prices: TokenPrices): number {
  const {
    rewardsRif,
    rewardsRbtc,
    rewardsUsdrif,
    totalAllocation,
    weightedAvgBackerRewardPct,
  } = params

  const rifPrice = prices.RIF?.price ?? 0

  if (rifPrice === 0 || totalAllocation === 0n) {
    return 0
  }

  const cyclePayout = calculateCyclePayoutWei(rewardsRif, rewardsRbtc, rewardsUsdrif, prices)

  if (cyclePayout.eq(0)) {
    return 0
  }

  const totalAllocationBig = Big(totalAllocation.toString())
  const weightedPctBig = Big(weightedAvgBackerRewardPct.toString())

  const rewardsPerStRif = cyclePayout.mul(weightedPctBig).div(totalAllocationBig)

  const ratePerCycle = rewardsPerStRif.div(WEI_SCALE).div(rifPrice)
  const compoundFactor = Big(1).add(ratePerCycle).pow(CYCLES_PER_YEAR)
  const abiPercentage = compoundFactor.minus(1).mul(100)

  return abiPercentage.toNumber()
}
