# coingecko-api-v3

[![CI](https://github.com/samuraitruong/coingecko-api-v3/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/samuraitruong/coingecko-api-v3/actions/workflows/ci.yml) [![codecov](https://codecov.io/gh/samuraitruong/coingecko-api-v3/branch/main/graph/badge.svg?token=A7P9GCFGN2)](https://codecov.io/gh/samuraitruong/coingecko-api-v3) [![version](https://badgen.net/npm/v/coingecko-api-v3)](https://badgen.net/npm/v/coingecko-api-v3)

The nodejs api library for accessing coingecko api v3 , develop with typescript with zero dependencies

- [Official document here](https://www.coingecko.com/api/documentations/v3)

- [API document generated](https://samuraitruong.github.io/coingecko-api-v3/classes/CoinGeckoClient.CoinGeckoClient-1.html)


## Get started

```
npm install coingecko-api-v3

```

```js
import { CoinGeckoClient } from 'coingecko-api-v3';
const client = new CoinGeckoClient({
  timeout: 10000,
  autoRetry: true,
});
const trendingSearch = await client.trending();
```

## Options

- timeout (optional): The http timeout, default 30s
- autoRetry (optional): Auto retry if the http response code is 429 - to many request

## Supported API method

| Endpoint                                                   |                           function | tested? |
| ---------------------------------------------------------- | ---------------------------------: | :-----: |
| /ping                                                      |                      client.ping() |   ✅    |
| /simple/price                                              |               client.simplePrice() |   ✅    |
| /simple/token_price/:id                                    |             client.simplePriceId() |   ✅    |
| /simple/supported_vs_currencies                            | client.simpleSupportedCurrencies() |   ✅    |
| /coins/list                                                |                  client.coinList() |   ✅    |
| /coins/markets                                             |               client.coinMarkets() |   ✅    |
| /coins/:id                                                 |                    client.coinId() |   ✅    |
| /coins/:id/tickers                                         |             client.coinIdTickers() |   ✅    |
| /coins/:id/history                                         |             client.coinIdHistory() |   ✅    |
| /coins/:id/market_history                                  |       client.coinIdMarketHistory() |   ✅    |
| /coins/id/market_chart                                     |         client.coinIdMarketChart() |   ✅    |
| /coins/{id}/market_chart/range                             |    client.coinIdMarketChartRange() |   ✅    |
| /coins/{id}/status_updates                                 |       client.coinIdStatusUpdates() |   ✅    |
| /coins/{id}/ohlc                                           |                client.coinIdOHLC() |   ✅    |
| /coins/{id}/contract/{contract_address}                    |                  client.contract() |   ✅    |
| /coins/{id}/contract/{contract_address}/market_chart/      |       client.contractMarketChart() |   ✅    |
| /coins/{id}/contract/{contract_address}/market_chart/range |  client.contractMarketChartRange() |   ✅    |
| /exchanges                                                 |                 client.exchanges() |   ✅    |
| /exchanges/list                                            |              client.exchangeList() |   ✅    |
| /exchanges/{id}/tickers                                    |         client.exchangeIdTickers() |   ✅    |
| /exchanges/{id}/status_update                              |   client.exchangeIdStatusUpdates() |   ✅    |
| /exchanges/{id}/volume_chart                               |     client.exchangeIdVolumeChart() |   ✅    |
| /finance_platforms                                         |          client.financePlatforms() |   ✅    |
| /finance_products                                          |           client.financeProducts() |   ✅    |
| /indexes                                                   |                   client.indexes() |   ✅    |
| /indexes/{market_id}/{id}                                  |           client.indexesMarketId() |   ✅    |
| /indexes/list                                              |               client.indexesList() |   ✅    |
| /indexes/list_by_market_and_id/{market_id}/{id}            |           client.financeProducts() |   ✅    |
| /derivatives                                               |              client./derivatives() |   ✅    |
| /derivatives/exchanges                                     |     client./derivativesExchanges() |   ✅    |
| /derivatives/exchanges/{id}                                |   client./derivativesExchangesId() |   ✅    |
| /status_updates                                            |             client.statusUpdates() |   ✅    |
| /exchange_rates                                            |             client.exhangesRates() |   ✅    |
| /search                                                    |                    client.search() |   ✅    |
| /search/trending                                           |                  client.trending() |   ✅    |
| /global                                                    |                    client.global() |   ✅    |
| /status_updates                                            |             client.statusUpdates() |   ✅    |
| /global/decentralized_finance_defi                         |                client.globalDefi() |   ✅    |


## Development
e
