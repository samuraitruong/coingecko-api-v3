import axios, { AxiosInstance } from 'axios';
import qs from 'qs';
import { API_ROUTES } from './Enum';
import { CoinListResponseItem, CoinMarket, PingResponse, TrendingResponse, SimplePriceResponse, TokenPriceResponse, CoinFullInfo, CoinTickerResponse } from './Inteface';

export class CoinGeckoClient {
  http: AxiosInstance;
  apiV3Url = 'https://api.coingecko.com/api/v3'
  constructor() {

    this.http = axios.create({})
  }
  private withPathParams(path: string, replacements: any = {}) {
    let pathStr = path;
    Object.entries(replacements).forEach(([key, value]) => {
      pathStr = pathStr.replace('{' + key + '}', value as string)
    })
    return pathStr;
  }

  private async makeRequest<T>(action: API_ROUTES, params: any = {}) {
    const requestUrl = this.apiV3Url + this.withPathParams(action, params) + '?' + qs.stringify(params);
    console.log(requestUrl)
    const res = await this.http.get<T>(requestUrl);
    return res.data;
  }
  /**
   * Check API server status
   * @returns {PingResponse}
   */
  public async ping() {
    return this.makeRequest<PingResponse>(API_ROUTES.PING);
  }
  public async trending() {
    return this.makeRequest<TrendingResponse>(API_ROUTES.SEARCH_TRENDING);
  }

  /**
   * List all supported coins id, name and symbol (no pagination required)
   * Use this to obtain all the coins’ id in order to make API calls
   * @category Coin
   * @param input.include_platform flag to include platform contract addresses (eg. 0x… for Ethereum based tokens).
valid values: true, false
   * @returns {CoinListResponseItem[]}
   */
  public async coinList(input: { include_platform?: boolean }) {
    return this.makeRequest<CoinListResponseItem[]>(API_ROUTES.COIN_LIST, input);
  }

  /**
   * List all supported coins price, market cap, volume, and market related data
   * @category Coin
   * @param input.vs_currency The target currency of market data (usd, eur, jpy, etc.)
   * @param input.order valid values: market_cap_desc, gecko_desc, gecko_asc, market_cap_asc, market_cap_desc, volume_asc, volume_desc, id_asc, id_desc
   * @param input.category filter by coin category, only decentralized_finance_defi and stablecoins are supported at the moment
   * @param input.ids The ids of the coin, comma separated crytocurrency symbols (base). refers to /coins/list. When left empty, returns numbers the coins observing the params limit and start
   * @param input.per_page Total results per page (valid values: 1…250)
   * @param input.page Page through results
   * @param input.sparkline Include sparkline 7 days data (eg. true, false)
   * @returns {CoinMarket[]}
   */
  public async coinMarket(input: {
    vs_currency: string,
    ids: string,
    category?: 'decentralized_finance_defi' | 'stablecoins',
    order?: 'market_cap_desc' | 'gecko_desc' | 'gecko_asc' | 'market_cap_asc' | 'market_cap_desc' | 'volume_asc' | 'volume_desc' | 'id_asc' | 'id_desc',
    per_page?: number
    page?: number,
    sparkline?: boolean,
    price_change_percentage?: string
  }) {
    return this.makeRequest<CoinMarket[]>(API_ROUTES.COIN_MARKET, input);
  }

  /**
   * Get current data (name, price, market, ... including exchange tickers) for a coin
   * IMPORTANT:
   * Ticker object is limited to 100 items, to get more tickers, use /coins/{id}/tickers
   * Ticker is_stale is true when ticker that has not been updated/unchanged from the exchange for a while.
   * Ticker is_anomaly is true if ticker’s price is outliered by our system.
   * You are responsible for managing how you want to display these information (e.g. footnote, different background, change opacity, hide)
   * @category Coin
   * @param input.id pass the coin id (can be obtained from /coins) eg. bitcoin
   * @param input.localization Include all localized languages in response (true/false) 
   * @param input.tickers nclude tickers data (true/false) [default: true]
   * @param input.market_data Include market_data (true/false) [default: true]
   * @param input.community_data Include community_data data (true/false) [default: true]
   * @param input.developer_data Include developer_data data (true/false) [default: true]
   * @param input.sparkline Include sparkline 7 days data (eg. true, false)
   * @returns {CoinFullInfo}
   */
  public async coin(input: {
    id: string,
    localization?: boolean,
    tickers?: boolean,
    market_data?: boolean,
    community_data?: boolean,
    sparkline?: boolean,
    developer_data?: boolean
  }) {
    return this.makeRequest<CoinFullInfo>(API_ROUTES.COIN, input);
  }

  /**
   * Get coin tickers (paginated to 100 items)
   *
   * IMPORTANT:
   * Ticker is_stale is true when ticker that has not been updated/unchanged from the exchange for a while.
   * Ticker is_anomaly is true if ticker’s price is outliered by our system.
   * You are responsible for managing how you want to display these information (e.g. footnote, different background, change opacity, hide)
   * @category Coin
   * @param input.id pass the coin id (can be obtained from /coins) eg. bitcoin
   * @param input.exchange_ids filter results by exchange_ids (ref: v3/exchanges/list) 
   * @param input.include_exchange_logo flag to show exchange_logo
   * @param input.page Page through results
   * @param input.order valid values: trust_score_desc (default), trust_score_asc and volume_desc
   * @param input.depth flag to show 2% orderbook depth. valid values: true, false
   * @returns {CoinFullInfo}
   */
  public async coinTickers(input: {
    id: string,
    exchange_ids?: string,
    include_exchange_logo?: boolean,
    page?: number,
    order?: 'trust_score_desc' | 'trust_score_asc' | 'volume_desc',
    depth?: boolean,
  }) {
    return this.makeRequest<CoinTickerResponse>(API_ROUTES.COIN_TICKERS, input);
  }

  /**
   * Get the current price of any cryptocurrencies in any other supported currencies that you need.
   * @param input.vs_currency vs_currency of coins, comma-separated if querying more than 1 vs_currency. *refers to simple/supported_vs_currencies
   * @param input.ids The ids of the coin, comma separated crytocurrency symbols (base). refers to /coins/list. When left empty, returns numbers the coins observing the params limit and start
   * @param input.include_market_cap @default false
   * @returns {SimplePriceResponse}
   * @category Simple
   */
  public async simplePrice(input: {
    vs_currency: string,
    ids: string,
    include_market_cap?: boolean,
    include_24hr_vol?: boolean,
    include_24hr_change?: boolean,
    include_last_updated_at?: boolean
  }) {
    return this.makeRequest<SimplePriceResponse>(API_ROUTES.SIMPLE_PRICE, input);
  }

  /**
  * Get current price of tokens (using contract addresses) for a given platform in any other currency that you need.
  * @param input.id The id of the platform issuing tokens (Only ethereum is supported for now)
  * @param input.contract_addresses The contract address of tokens, comma separated
  * @param input.vs_currencies vs_currency of coins, comma-separated if querying more than 1 vs_currency. *refers to simple/supported_vs_currencies
  * @returns The dictionary of price pair with details
  * * Example output
  * ```json
  * {
  *    "0x8207c1ffc5b6804f6024322ccf34f29c3541ae26": {
  *      "btc": 0.00003754,
  *      "btc_market_cap": 7914.297728099776,
  *      "btc_24h_vol": 2397.477480037078,
  *      "btc_24h_change": 3.7958858800037834,
  *      "eth": 0.0009474,
  *      "eth_market_cap": 199730.22336519035,
  *      "eth_24h_vol": 60504.258122696505,
  *      "eth_24h_change": 2.8068351977135007,
  *      "last_updated_at": 1618664199
  *   }
  *}
  *```
  * @category Simple
  */
  public async simpleTokenPrice(input: {
    id: 'ethereum',
    contract_addresses: string,
    vs_currencies: string,
    include_market_cap?: boolean,
    include_24hr_vol?: boolean,
    include_24hr_change?: boolean,
    include_last_updated_at?: boolean
  }) {
    return this.makeRequest<TokenPriceResponse>(API_ROUTES.SIMPLE_TOKEN_PRICE, input);
  }

  /**
  * Get list of supported_vs_currencies.
  * @returns list of supported_vs_currencies
  * @category Simple
  */
  public async simpleSupportedCurrencies() {
    return this.makeRequest<string[]>(API_ROUTES.SIMPLE_SUPPORTED_CURRENCIES);
  }

}
