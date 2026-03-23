[![OpenSSF Scorecard](https://api.scorecard.dev/projects/github.com/rsksmart/sdk-base/badge)](https://scorecard.dev/viewer/?uri=github.com/rsksmart/sdk-base)
[![CodeQL](https://github.com/rsksmart/sdk-base/workflows/CodeQL/badge.svg)](https://github.com/rsksmart/sdk-base/actions?query=workflow%3ACodeQL)

<img src="rootstock-logo.png" alt="RSK Logo" style="width:100%; height: auto;" />

# @rsksmart/sdk-base

Shared utilities, types, token metadata, pricing helpers, logging, and errors for Rootstock SDK packages (for example `@rsksmart/w3layer`, `@rsksmart/collective-sdk`, `@rsksmart/vaults-sdk`).

## Installation

```bash
npm install @rsksmart/sdk-base viem
```

`viem` is required for address types and some helpers.

## Overview

| Area | What you get |
|------|----------------|
| **Types** | `TokenAmount`, `Percentage`, `Address`, logger config |
| **Errors** | `SDKError`, `ErrorCodes`, `isSDKError`, `toSDKError` |
| **Logger** | `Logger`, `createLogger`, default `logger` |
| **Formatting** | `formatTokenAmount`, `parseTokenAmount`, `toTokenAmount`, percentages, wei/ether |
| **Validation** | `isAddress`, `validateAddress`, `isZeroAddress`, amount helpers |
| **Tokens** | `getTokenAddresses`, `TOKEN_DECIMALS`, `ZERO_ADDRESS` |
| **Prices** | RWS-backed `createPriceService`, `calculateABI`, `calculateCyclePayoutUSD` |

## Types

Core value types used across SDKs:

```typescript
import type { TokenAmount, Percentage, Address } from '@rsksmart/sdk-base'

const amount: TokenAmount = {
  value: 10n ** 18n,
  formatted: '1.0',
  symbol: 'RIF',
}
```

## Token addresses & decimals

Canonical RIF, stRIF, USDRIF, and reward “coinbase” addresses for Rootstock mainnet (30) and testnet (31), plus decimal constants:

```typescript
import { getTokenAddresses, TOKEN_DECIMALS, ZERO_ADDRESS } from '@rsksmart/sdk-base'

const { RIF, stRIF, USDRIF, COINBASE_ADDRESS } = getTokenAddresses(31)

console.log(TOKEN_DECIMALS.RIF) // 18
```

- **`ZERO_ADDRESS`**: `0x000...000` (e.g. for native RBTC in some price flows)
- **`RootstockChainId`**: `30 | 31`

## Formatting & parsing

```typescript
import {
  formatTokenAmount,
  parseTokenAmount,
  toTokenAmount,
  formatPercentage,
  weiToEther,
  etherToWei,
} from '@rsksmart/sdk-base'

const formatted = formatTokenAmount(1000000000000000000n, 18)
const parsed = parseTokenAmount('1.5', 18)
const tokenAmount = toTokenAmount(10n ** 18n, 18, 'RIF')

const pct = formatPercentage(3500, 10000) // 35.00%
```

**Constants:** `DEFAULT_DECIMALS` (18), `PERCENTAGE_PRECISION` (10000).

## Address & amount validation

```typescript
import {
  isAddress,
  validateAddress,
  isZeroAddress,
  shortenAddress,
  validatePositiveAmount,
  isPositiveBigInt,
} from '@rsksmart/sdk-base'

validateAddress('0x...') // throws if invalid
```

## Errors

Structured errors with codes for programmatic handling:

```typescript
import { SDKError, ErrorCodes, isSDKError, toSDKError } from '@rsksmart/sdk-base'

try {
  // ...
} catch (e) {
  if (isSDKError(e)) {
    console.log(e.code, e.module, e.details)
  }
  throw toSDKError(e, ErrorCodes.NETWORK_ERROR, 'my-module')
}
```

See `ErrorCodes` in `src/errors.ts` for the full list (e.g. `INVALID_ADDRESS`, `CONTRACT_READ_FAILED`, `RPC_ERROR`).

## Logger

```typescript
import { createLogger, logger } from '@rsksmart/sdk-base'

const log = createLogger({ level: 'info', prefix: '[MySDK]' })
log.info('Ready', { chainId: 31 })
```

## Price service & ABI helpers

Fetches USD prices from **RIF Wallet Services** (RWS) and supports Annual Backers Incentives (ABI) style calculations used by Collective flows.

```typescript
import {
  createPriceService,
  calculateABI,
  calculateCyclePayoutUSD,
} from '@rsksmart/sdk-base'

const priceService = createPriceService({ chainId: 31 })
const prices = await priceService.fetchPrices()

const abi = calculateABI(
  {
    rewardsRif: 0n,
    rewardsRbtc: 0n,
    rewardsUsdrif: 0n,
    totalAllocation: 1n,
    weightedAvgBackerRewardPct: 0n,
  },
  prices
)
```

- **`createPriceService`**: optional `baseUrl`, `chainId`, `timeout` (defaults follow mainnet/testnet RWS URLs).
- **`calculateABI`** / **`calculateCyclePayoutUSD`**: see `src/prices/abiCalculator.ts` for parameters and semantics.

## Releasing to npm (GitHub Actions)

Publishing runs on **Release published**. The workflow checks that the Git tag matches `version` in `package.json`.

**Accepted tag formats** (either is valid):

- `v0.2.1` → full ref `refs/tags/v0.2.1`
- `0.2.1` → full ref `refs/tags/0.2.1`

Bump `version` in `package.json`, commit, then create a GitHub Release whose tag matches that version (with or without the `v` prefix).

The publish workflow also checks that `repository.url` in `package.json` matches this GitHub repo (e.g. `git+https://github.com/OWNER/REPO.git`). Use the same `OWNER/REPO` as in **Settings → General** on GitHub.

## Requirements

- Node.js >= 18
- TypeScript >= 5 (recommended peer dependency)
