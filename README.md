# coingecko-api-v3

The nodejs api library for accessing coingecko api v3 , develop with typescript with zero dependencies

Official document here - https://www.coingecko.com/api/documentations/v3

API document generated - https://samuraitruong.github.io/coingecko-api-v3/classes/coingeckoclient.coingeckoclient-1.html

## Get started

```
npm install coingecko-api-v3

```

```js
const client = new CoinGeckoClient();
const trendingSearch = await client.trendingSearch();
```

## Methods

| Method                          |                           function | tested |
| ------------------------------- | ---------------------------------: | :----: |
| /ping                           |                      client.ping() |   👍   |
| /simple/price                   |                client.simpePrice() |   👍   |
| /simple/token_price/:id         |             client.simplePriceId() |   👍   |
| /simple/supported_vs_currencies | client.simpleSupportedCurrencies() |   👍   |

