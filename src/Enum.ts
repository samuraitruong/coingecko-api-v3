export enum API_ROUTES {
  PING = '/ping',
  SEARCH_TRENDING = '/search/trending',
  COIN = '/coins/{id}',
  COIN_LIST = '/coins/list',
  COIN_MARKET = '/coins/markets',
  COIN_TICKERS = '/coins/{id}/tickers',
  SIMPLE_PRICE = '/simple/price',
  SIMPLE_SUPPORTED_CURRENCIES = '/simple/supported_vs_currencies',
  SIMPLE_TOKEN_PRICE = '/simple/token_price/{id}',

}

export type PLATFORMS = 'etherium' | 'tron'
