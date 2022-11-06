"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CoinGeckoClient = void 0;
/* eslint-disable linebreak-style */
const https_1 = __importDefault(require("https"));
const Enum_1 = require("./Enum");
/**
 * The wrap client to access all api on coin gecko
 */
class CoinGeckoClient {
    /**
     * Constructor
     * @param options the options passed for client library, at the moment only timeout are support
     */
    constructor(options) {
        this.apiV3Url = "https://api.coingecko.com/api/v3";
        this.options = {
            timeout: 30000,
            autoRetry: true,
        };
        this.options = Object.assign(Object.assign({}, this.options), options);
    }
    withPathParams(path, replacements = {}) {
        let pathStr = path;
        Object.entries(replacements).forEach(([key, value]) => {
            pathStr = pathStr.replace(`{${key}}`, value);
        });
        return pathStr;
    }
    /**
     * Make HTTP request to the given endpoint
     * @param url the full https URL
     * @returns json content
     */
    httpGet(url) {
        return __awaiter(this, void 0, void 0, function* () {
            const { host, pathname, search } = new URL(url);
            const options = {
                host,
                path: pathname + search,
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
                timeout: this.options.timeout, // in ms
            };
            const parseJson = (input) => {
                try {
                    return JSON.parse(input);
                }
                catch (err) {
                    return input;
                }
            };
            return new Promise((resolve, reject) => {
                const req = https_1.default.request(options, (res) => {
                    if (res.statusCode && res.statusCode === 429) {
                        resolve({
                            statusCode: res.statusCode,
                            data: {
                                error: "HTTP 429 - Too many request",
                            },
                            headers: res.headers,
                        });
                        // reject(new Error(`HTTP status code ${res.statusCode}`));
                    }
                    const body = [];
                    res.on("data", (chunk) => body.push(chunk));
                    res.on("end", () => {
                        const resString = Buffer.concat(body).toString();
                        resolve({
                            statusCode: res.statusCode,
                            data: parseJson(resString),
                            headers: res.headers,
                        });
                    });
                });
                req.on("error", (err) => {
                    reject(err);
                });
                req.on("timeout", () => {
                    req.destroy();
                    reject(new Error(`HTTP Request timeout after ${this.options.timeout}`));
                });
                req.end();
            });
        });
    }
    /**
     * Generic function to make request use in internal function
     * @param action
     * @param params
     * @returns
     */
    makeRequest(action, params = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            const qs = Object.entries(params)
                .map(([key, value]) => `${key}=${value}`)
                .join("&");
            const requestUrl = `${this.apiV3Url + this.withPathParams(action, params)}?${qs}`;
            const res = yield this.httpGet(requestUrl); // await this.http.get<T>(requestUrl);
            if (res.statusCode === 429 && this.options.autoRetry) {
                // console.warn("retrying........", requestUrl, res.headers);
                const retryAfter = +res.headers["retry-after"] * 1000;
                // console.log("retrying after ", retryAfter);
                yield new Promise((r) => setTimeout(r, retryAfter));
                return (yield this.makeRequest(action, params));
            }
            return res.data;
        });
    }
    /**
     * Check API server status
     * @returns {PingResponse}
     */
    ping() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.makeRequest(Enum_1.API_ROUTES.PING);
        });
    }
    /**
     * Search for coins, categories and markets listed on CoinGecko ordered by largest Market Cap first.
     * @param input.query your search query.
     * @returns {SearchResponse}
     */
    search(input) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.makeRequest(Enum_1.API_ROUTES.SEARCH, input);
        });
    }
    /**
     * Top-7 trending coins on CoinGecko as searched by users in the last 24 hours (Ordered by most popular first)
     *
     * @returns {TrendingResponse}
     */
    trending() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.makeRequest(Enum_1.API_ROUTES.SEARCH_TRENDING);
        });
    }
    /**
     * List all supported coins id, name and symbol (no pagination required)
     * Use this to obtain all the coins’ id in order to make API calls
     * @category Coin
     * @param input.include_platform flag to include platform contract addresses (eg. 0x… for Ethereum based tokens).
  valid values: true, false
     * @returns {CoinListResponseItem[]}
     */
    coinList(input) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.makeRequest(Enum_1.API_ROUTES.COIN_LIST, input);
        });
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
    coinMarket(input) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.makeRequest(Enum_1.API_ROUTES.COIN_MARKET, input);
        });
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
    coinId(input) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.makeRequest(Enum_1.API_ROUTES.COIN, input);
        });
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
    coinIdTickers(input) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.makeRequest(Enum_1.API_ROUTES.COIN_TICKERS, input);
        });
    }
    /**
     * Get historical data (name, price, market, stats) at a given date for a coin
     *
     * @category Coin
     * @param input.id pass the coin id (can be obtained from /coins) eg. bitcoin
     * @param input.date The date of data snapshot in dd-mm-yyyy eg. 30-12-2017
     * @param input.localization Set to false to exclude localized languages in response
     * @returns {CoinHistoryResponse}
     */
    coinIdHistory(input) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.makeRequest(Enum_1.API_ROUTES.COIN_HISTORY, input);
        });
    }
    /**
     * Get historical market data include price, market cap, and 24h volume (granularity auto)
     * Minutely data will be used for duration within 1 day, Hourly data will be used for duration between 1 day and 90 days, Daily data will be used for duration above 90 days.
     *
     * @category Coin
     * @param input.id pass the coin id (can be obtained from /coins) eg. bitcoin
     * @param input.vs_currency The target currency of market data (usd, eur, jpy, etc.)
     * @param input.days Data up to number of days ago (eg. 1,14,30,max)
     * @param input.interval Data interval. Possible value: daily
     * @returns {CoinMarketChartResponse}
     */
    coinIdMarketChart(input) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.makeRequest(Enum_1.API_ROUTES.COIN_MARKET_CHART, input);
        });
    }
    /**
     * Get historical market data include price, market cap, and 24h volume within a range of timestamp (granularity auto)
     * Minutely data will be used for duration within 1 day, Hourly data will be used for duration between 1 day and 90 days, Daily data will be used for duration above 90 days.
     *
     * @category Coin
     * @param input.id pass the coin id (can be obtained from /coins) eg. bitcoin
     * @param input.vs_currency The target currency of market data (usd, eur, jpy, etc.)
     * @param input.from From date in UNIX Timestamp (eg. 1392577232)
     * @param input.to To date in UNIX Timestamp (eg. 1618716149)
     * @returns {CoinMarketChartResponse}
     */
    coinIdMarketChartRange(input) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.makeRequest(Enum_1.API_ROUTES.COIN_MARKET_CHART_RANGE, input);
        });
    }
    // /**
    //  * Get status updates for a given coin (beta)
    //  *
    //  * @see https://www.coingecko.com/api/documentations/v3#/coins/get_coins__id__status_updates
    //  * @category Coin
    //  * @param input.id pass the coin id (can be obtained from /coins) eg. bitcoin
    //  * @param input.per_page Total results per page
    //  * @param input.page Page through results
    //  * @returns {CoinStatusUpdateResponse}
    //  */
    // ! Removed from the API
    // public async coinIdStatusUpdates(input: {
    //   id: string,
    //   per_page?: number,
    //   page?: number,
    // }) {
    //   return this.makeRequest<CoinStatusUpdateResponse>(API_ROUTES.COIN_STATUS_UPDATES, input);
    // }
    /**
     * Get coin's OHLC (Beta)
     * ```
     * Candle’s body:
     * 1 - 2 days: 30 minutes
     * 3 - 30 days: 4 hours
     * 31 and before: 4 days
     * ```
     * @see https://www.coingecko.com/api/documentations/v3#/coins/get_coins__id__ohlc
     * @category Coin
     * @param input.id pass the coin id (can be obtained from /coins) eg. bitcoin
     * @param input.vs_currency The target currency of market data (usd, eur, jpy, etc.)
     * @param input.days Data up to number of days ago (1/7/14/30/90/180/365/max)
     * @returns {CoinStatusUpdateResponse}
     * Sample output
     * ```
     * [
     *  [
     *    1618113600000,
     *    79296.36,
     *    79296.36,
     *    79279.94,
     *    79279.94
     *   ]
     * . ... ... . .. . .. . . . . .
     * ]
     *```
     */
    coinIdOHLC(input) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.makeRequest(Enum_1.API_ROUTES.COIN_OHLC, input);
        });
    }
    /**
     * Get the current price of any cryptocurrencies in any other supported currencies that you need.
     * @param input.vs_currencies vs_currency of coins, comma-separated if querying more than 1 vs_currency. *refers to simple/supported_vs_currencies
     * @param input.ids The ids of the coin, comma separated crytocurrency symbols (base). refers to /coins/list. When left empty, returns numbers the coins observing the params limit and start
     * @param input.include_market_cap @default false
     * @returns {SimplePriceResponse}
     * @category Simple
     */
    simplePrice(input) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.makeRequest(Enum_1.API_ROUTES.SIMPLE_PRICE, input);
        });
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
    simpleTokenPrice(input) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.makeRequest(Enum_1.API_ROUTES.SIMPLE_TOKEN_PRICE, input);
        });
    }
    /**
     * Get list of supported_vs_currencies.
     * @returns list of supported_vs_currencies
     * @category Simple
     */
    simpleSupportedCurrencies() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.makeRequest(Enum_1.API_ROUTES.SIMPLE_SUPPORTED_CURRENCIES);
        });
    }
    /**
     * Get historical market data include price, market cap, and 24h volume (granularity auto) from a contract address
     * @see https://www.coingecko.com/api/documentations/v3#/contract/get_coins__id__contract__contract_address_
     * @returns current data for a coin
     * @param input.id Asset platform (only ethereum is supported at this moment)
     * @param input.contract_address Token’s contract address
     * @category Contract
     * @returns {CoinFullInfo}
     */
    contract(input) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.makeRequest(Enum_1.API_ROUTES.CONTRACT, input);
        });
    }
    /**
     * Get historical market data include price, market cap, and 24h volume (granularity auto)
     * @see https://www.coingecko.com/api/documentations/v3#/contract/get_coins__id__contract__contract_address__market_chart_
     * @returns current data for a coin
     * @param input.id Asset platform (only ethereum is supported at this moment)
     * @param input.contract_address Token’s contract address
     * @param input.vs_currency The target currency of market data (usd, eur, jpy, etc.)
     * @param input.days Data up to number of days ago (eg. 1,14,30,max)
     * @category Contract
     * @returns {CoinMarketChartResponse}
     */
    contractMarketChart(input) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.makeRequest(Enum_1.API_ROUTES.CONTRACT_MARKET_CHART, input);
        });
    }
    /**
     * Get historical market data include price, market cap, and 24h volume within a range of timestamp (granularity auto) from a contract address
     * @see https://www.coingecko.com/api/documentations/v3#/contract/get_coins__id__contract__contract_address__market_chart_range
     * @returns current data for a coin
     * @param input.id Asset platform (only ethereum is supported at this moment)
     * @param input.contract_address Token’s contract address
     * @param input.vs_currency The target currency of market data (usd, eur, jpy, etc.)
     * @param input.from From date in UNIX Timestamp (eg. 1392577232)
     * @param input.to From date in UNIX Timestamp (eg. 1618716149)
     * @category Contract
     * @returns {CoinMarketChartResponse} Get historical market data include price, market cap, and 24h volume
     */
    contractMarketChartRange(input) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.makeRequest(Enum_1.API_ROUTES.CONTRACT_MARKET_CHART_RANGE, input);
        });
    }
    /**
     * List all exchanges
     * @see https://www.coingecko.com/api/documentations/v3#/exchanges_(beta)/get_exchanges
     * @returns List all exchanges
     * @param input.per_page Total results per page (valid values: 1…250)
     * @param input.page Page through results
     * @category Exchange
     * @returns {CoinMarketChartResponse} Get historical market data include price, market cap, and 24h volume
     */
    exchanges(input) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.makeRequest(Enum_1.API_ROUTES.EXCHANGES, input);
        });
    }
    /**
     * List all supported markets id and name (no pagination required)
     * @see https://www.coingecko.com/api/documentations/v3#/exchanges_(beta)/get_exchanges_list
     * @returns Use this to obtain all the markets’ id in order to make API calls
     * @category Exchange
     * @returns {NameIdPair[]} Get historical market data include price, market cap, and 24h volume
     */
    exchangeList() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.makeRequest(Enum_1.API_ROUTES.EXCHANGE_LIST);
        });
    }
    /**
     * List all supported markets id and name (no pagination required)
     * @see https://www.coingecko.com/api/documentations/v3#/exchanges_(beta)/get_exchanges__id_
     * @param id the exchange id (can be obtained from /exchanges/list) eg. binance
     * @returns Use this to obtain all the markets’ id in order to make API calls
     * ```
     * IMPORTANT:
     * Ticker object is limited to 100 items, to get more tickers, use /exchanges/{id}/tickers
     * Ticker is_stale is true when ticker that has not been updated/unchanged from the exchange for a while.
     * Ticker is_anomaly is true if ticker’s price is outliered by our system.
     * You are responsible for managing how you want to display these information (e.g. footnote, different background, change opacity, hide)
     * ```
     * @category Exchange
     * @returns {ExchangeId} Get exchange volume in BTC and top 100 tickers only
     */
    exchangeId(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.makeRequest(Enum_1.API_ROUTES.EXCHANGE_ID, { id });
        });
    }
    /**
     * Get exchange tickers (paginated, 100 tickers per page)
     * @see https://www.coingecko.com/api/documentations/v3#/exchanges_(beta)/get_exchanges__id__tickers
     * @param input.id pass the exchange id (can be obtained from /exchanges/list) eg. binance
     * @param input.coin_ids filter tickers by coin_ids (ref: v3/coins/list)
     * @param input.include_exchange_logo flag to show exchange_logo
     * @param input.page Page through results
     * @param input.depth flag to show 2% orderbook depth i.e., cost_to_move_up_usd and cost_to_move_down_usd
     * @returns Use this to obtain all the markets’ id in order to make API calls
     * ```
     * IMPORTANT:
     * Ticker object is limited to 100 items, to get more tickers, use /exchanges/{id}/tickers
     * Ticker is_stale is true when ticker that has not been updated/unchanged from the exchange for a while.
     * Ticker is_anomaly is true if ticker’s price is outliered by our system.
     * You are responsible for managing how you want to display these information (e.g. footnote, different background, change opacity, hide)
     * ```
     * @category Exchange
     * @returns {ExchangeIdTickerResponse} Get exchange volume in BTC and top 100 tickers only
     */
    exchangeIdTickers(input) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.makeRequest(Enum_1.API_ROUTES.EXCHANGE_ID_TICKER, input);
        });
    }
    // /**
    //  * Get status updates for a given exchange (beta)
    //  * @see https://www.coingecko.com/api/documentations/v3#/exchanges_(beta)/get_exchanges__id__status_updates
    //  * @param input.id pass the exchange id (can be obtained from /exchanges/list) eg. binance
    //  * @param input.page Page through results
    //  * @param input.per_page Total results per page
    //  * @returns Get status updates for a given exchange
    //  * @category Exchange
    //  * @returns {CoinStatusUpdateResponse} Get status updates for a given exchange
    //  */
    //  ! Status updates no longer exist on API
    // public async exchangeIdStatusUpdates(input: {
    //   id: string,
    //   page?: number,
    //   per_page?: number,
    // }) {
    //   return this.makeRequest<CoinStatusUpdateResponse>(API_ROUTES.EXCHANGE_ID_STATUS_UPDATES, input);
    // }
    /**
     * Get status updates for a given exchange (beta)
     * @see https://www.coingecko.com/api/documentations/v3#/exchanges_(beta)/get_exchanges__id__volume_chart
     * @param input.id pass the exchange id (can be obtained from /exchanges/list) eg. binance
     * @param input.days Data up to number of days ago (eg. 1,14,30)
     * @returns Get status updates for a given exchange
     * @category Exchange
     * @returns {CoinStatusUpdateResponse} Get status updates for a given exchange
     */
    exchangeIdVolumeChart(input) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.makeRequest(Enum_1.API_ROUTES.EXCHANGE_ID_VOL_CHART, input);
        });
    }
    /**
     * List all finance platforms
     * @see https://www.coingecko.com/api/documentations/v3#/finance_(beta)/get_finance_platforms
     * @param input.per_page Total results per page
     * @param input.page Data up to number of days ago (eg. 1,14,30)
     * @category Finance
     * @returns {Finance[]}
     */
    financePlatforms(input) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.makeRequest(Enum_1.API_ROUTES.FINANCE_PLATFORM, input);
        });
    }
    // /**
    //  * List all finance products
    //  * @see https://www.coingecko.com/api/documentations/v3#/finance_(beta)/get_finance_products
    //  * @param input.per_page Total results per page
    //  * @param input.page Data up to number of days ago (eg. 1,14,30)
    //  * @category Finance
    //  * @returns {Finance[]}
    //  */
    //  ! No longer exists on API
    // public async financeProducts(input?: {
    //   per_page?: number,
    //   page?: number,
    //   start_at?: string,
    //   end_at?: string;
    // }) {
    //   return this.makeRequest<Array<FinanceProduct>>(API_ROUTES.FINANCE_PRODUCT, input);
    // }
    /**
     * List all market indexes
     * @see https://www.coingecko.com/api/documentations/v3#/indexes_(beta)/get_indexes
     * @param input.per_page Total results per page
     * @param input.page Data up to number of days ago (eg. 1,14,30)
     * @category Indexes
     * @returns {IndexItem[]}
     */
    indexes(input) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.makeRequest(Enum_1.API_ROUTES.INDEXES, input);
        });
    }
    /**
     * get market index by market id and index id
     * @see https://www.coingecko.com/api/documentations/v3#/indexes_(beta)/get_indexes__market_id___id_
     * @param input.market_id pass the market id (can be obtained from /exchanges/list)
     * @param input.path_id pass the index id (can be obtained from /indexes/list)
     * @param input.id pass the index id (can be obtained from /indexes/list)
     * @category Indexes
     * @returns {IndexItem[]}
     */
    indexesMarketId(input) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.makeRequest(Enum_1.API_ROUTES.INDEXES_MARKET_ID, input);
        });
    }
    /**
     * list market indexes id and name
     * @see https://www.coingecko.com/api/documentations/v3#/indexes_(beta)/get_indexes_list
     * @category Indexes
     * @returns {NameIdPair[]}
     */
    indexesList() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.makeRequest(Enum_1.API_ROUTES.INDEXES_LIST);
        });
    }
    /**
     * List all derivative tickers
     * @see https://www.coingecko.com/api/documentations/v3#/derivatives_(beta)/get_derivatives
     * @param input.include_tickers 'all’, ‘unexpired’] - expired to show unexpired tickers, all to list all tickers, defaults to unexpired
     * @category Derivatives
     * @returns {Derivative[]}
     */
    derivatives(input) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.makeRequest(Enum_1.API_ROUTES.DERIVATIVES, input);
        });
    }
    /**
     * List all derivative tickers
     * @see https://www.coingecko.com/api/documentations/v3#/derivatives_(beta)/get_derivatives_exchanges
     * @param input.order order results using following params name_asc，name_desc，open_interest_btc_asc，open_interest_btc_desc，trade_volume_24h_btc_asc，trade_volume_24h_btc_desc
     * @param input.page Page through results
     * @param input.per_page  Total results per page
     * @category Derivatives
     * @returns {DerivativeExchange[]}
     */
    derivativesExchanges(input) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.makeRequest(Enum_1.API_ROUTES.DERIVATIVES_EXCHANGES, input);
        });
    }
    /**
     * show derivative exchange data
     * @see https://www.coingecko.com/api/documentations/v3#/derivatives_(beta)/get_derivatives_exchanges__id_
     * @param input.id pass the exchange id (can be obtained from derivatives/exchanges/list) eg. bitmex
     * @param input.include_tickers ['all’, ‘unexpired’] - expired to show unexpired tickers, all to list all tickers, leave blank to omit tickers data in response
     * @category Derivatives
     * @returns {DerivativeExchange}
     */
    derivativesExchangesId(input) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.makeRequest(Enum_1.API_ROUTES.DERIVATIVES_EXCHANGES_ID, input);
        });
    }
    /**
     * List all derivative exchanges name and identifier
     * @see https://www.coingecko.com/api/documentations/v3#/derivatives_(beta)/get_derivatives_exchanges_list
     * @category Derivatives
     * @returns {NameIdPair[]}
     */
    derivativesExchangesList() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.makeRequest(Enum_1.API_ROUTES.DERIVATIVES_EXCHANGES_LIST);
        });
    }
    /**
     * Get BTC-to-Currency exchange rates
     * @see https://www.coingecko.com/api/documentations/v3#/exchange_rates/get_exchange_rates
     * @category Exchange Rates
     * @returns {ExchangeRatesResponse}
     */
    exchangeRates() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.makeRequest(Enum_1.API_ROUTES.EXCHANGE_RATES);
        });
    }
    /**
     * Get cryptocurrency global data
     * @see https://www.coingecko.com/api/documentations/v3#/global/get_global
     * @category Global
     * @returns {GlobalResponse} Get global data - total_volume, total_market_cap, ongoing icos etc
     */
    global() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.makeRequest(Enum_1.API_ROUTES.GLOBAL);
        });
    }
    /**
     * Get cryptocurrency global decentralized finance(defi) data
     * @see https://www.coingecko.com/api/documentations/v3#/global/get_global
     * @category Global
     * @returns {GlobalDefiResponse} Get Top 100 Cryptocurrency Global Eecentralized Finance(defi) data
     */
    globalDefi() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.makeRequest(Enum_1.API_ROUTES.GLOBAL_DEFI);
        });
    }
}
exports.CoinGeckoClient = CoinGeckoClient;
