import { RequestOptions } from 'https';
import { PLATFORMS } from './Enum';

export interface PingResponse {
  gecko_says: string;
}

export interface ResponseWithData<T> {
  data: T
}
export interface BasicCoin {
  id?: string;
  name?: string;
  symbol?: string;
}

export interface Coin extends BasicCoin {
  market_cap_rank?: number;
  thumb?: string;
  large?: string;
  score?: number;
}

export interface Exchange {
  id: string;
  name: string;
  year_established: number;
  country: string;
  description: string;
  url: string;
  image: string;
  has_trading_incentive: boolean;
  trust_score: number;
  trust_score_rank: number;
  trade_volume_24h_btc: number;
  trade_volume_24h_btc_normalized: number;
}

export interface CoinItem {
  id?: string,
  name?: string,
  api_symbol?: string,
  symbol?: string,
  market_cap_rank?: number,
  thumb?: string,
  large?: string
}

export interface SearchResponse {
  coins?: CoinItem[];
  exchanges?: Exchange[];
  categories?: string[];
  nfts?: string[];
}

export interface TrendingItem {
  id?: string;
  name?: string;
  symbol?: string;
  market_cap_rank?: number;
  thumb?: string;
  large?: string;
  score?: number;
}

export interface Trending {
  item?: TrendingItem;
}

export interface TrendingResponse {
  coins?: Trending[];
  exchanges?: Exchange[];
}

export interface CoinListResponseItem extends BasicCoin {
  platforms?: {
    [p: string]: string
  }
}

export interface CoinMarket extends BasicCoin {
  image?: string;
  current_price?: number;
  market_cap?: number;
  market_cap_rank?: number;
  fully_diluted_valuation?: null;
  total_volume?: number;
  high_24h?: number;
  low_24h?: number;
  price_change_24h?: number;
  price_change_percentage_24h?: number;
  market_cap_change_24h?: number;
  market_cap_change_percentage_24h?: number;
  circulating_supply?: number;
  total_supply?: number;
  max_supply?: null;
  ath?: number;
  ath_change_percentage?: number;
  ath_date?: Date;
  atl?: number;
  atl_change_percentage?: number;
  atl_date?: Date;
  roi?: null;
  last_updated?: Date;
}

export interface Category {
  category_id: string;
  name: string;
}

export interface CategoryWithMarketData {
  id: string;
  name: string;
  market_cap: number;
  market_cap_change_24h: number;
  content: string;
  top_3_coins: Array<string>;
  volume_24h: number;
  updated_at: string;
}

export interface SimplePriceResponse {
  [coin: string]: {
    /**
     * price of coin for this currency
     */
    [currency: string]: number
  }
}

/**
 * Example output
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
 */
export interface TokenPriceResponse {
  /**
   * ETH contract address same with the input pair
   */
  [contract_address: string]: {
    /**
     * price of coin for this currency
     */
    [currency: string]: number
  }
}

export interface CommunityData {
  facebook_likes?: null;
  twitter_followers?: number;
  reddit_average_posts_48h?: number;
  reddit_average_comments_48h?: number;
  reddit_subscribers?: number;
  reddit_accounts_active_48h?: number;
  telegram_channel_user_count?: number;
}

export interface CodeAdditionsDeletions4_Weeks {
  additions?: number;
  deletions?: number;
}

export interface DeveloperData {
  forks?: number;
  stars?: number;
  subscribers?: number;
  total_issues?: number;
  closed_issues?: number;
  pull_requests_merged?: number;
  pull_request_contributors?: number;
  code_additions_deletions_4_weeks?: CodeAdditionsDeletions4_Weeks;
  commit_count_4_weeks?: number;
  last_4_weeks_commit_activity_series?: number[];
}

export interface ReposURL {
  github?: string[];
  bitbucket?: any[];
}

export interface Links {
  homepage?: string[];
  blockchain_site?: string[];
  official_forum_url?: string[];
  chat_url?: string[];
  announcement_url?: string[];
  twitter_screen_name?: string;
  facebook_username?: string;
  bitcointalk_thread_identifier?: number;
  telegram_channel_identifier?: string;
  subreddit_url?: string;
  repos_url?: ReposURL;
}

export interface PublicInterestStats {
  alexa_rank?: number;
  bing_matches?: null;
}

export interface MarketData {
  current_price?: { [key: string]: number };
  total_value_locked?: null;
  mcap_to_tvl_ratio?: null;
  fdv_to_tvl_ratio?: null;
  roi?: null;
  ath?: { [key: string]: number };
  ath_change_percentage?: { [key: string]: number };
  ath_date?: { [key: string]: Date };
  atl?: { [key: string]: number };
  atl_change_percentage?: { [key: string]: number };
  atl_date?: { [key: string]: Date };
  market_cap?: { [key: string]: number };
  market_cap_rank?: number;
  fully_diluted_valuation?: any;
  total_volume?: { [key: string]: number };
  high_24h?: { [key: string]: number };
  low_24h?: { [key: string]: number };
  price_change_24h?: number;
  price_change_percentage_24h?: number;
  price_change_percentage_7d?: number;
  price_change_percentage_14d?: number;
  price_change_percentage_30d?: number;
  price_change_percentage_60d?: number;
  price_change_percentage_200d?: number;
  price_change_percentage_1y?: number;
  market_cap_change_24h?: number;
  market_cap_change_percentage_24h?: number;
  price_change_24h_in_currency?: { [key: string]: number };
  price_change_percentage_1h_in_currency?: { [key: string]: number };
  price_change_percentage_24h_in_currency?: { [key: string]: number };
  price_change_percentage_7d_in_currency?: { [key: string]: number };
  price_change_percentage_14d_in_currency?: { [key: string]: number };
  price_change_percentage_30d_in_currency?: { [key: string]: number };
  price_change_percentage_60d_in_currency?: { [key: string]: number };
  price_change_percentage_200d_in_currency?: { [key: string]: number };
  price_change_percentage_1y_in_currency?: { [key: string]: number };
  market_cap_change_24h_in_currency?: { [key: string]: number };
  market_cap_change_percentage_24h_in_currency?: { [key: string]: number };
  total_supply?: number;
  max_supply?: null;
  circulating_supply?: number;
  last_updated?: Date;
}

export interface Market {
  name?: string;
  identifier?: string;
  has_trading_incentive?: boolean;
}

export interface Ticker {
  base?: string;
  target?: string;
  market?: Market;
  last?: number;
  volume?: number;
  converted_last?: { [key: string]: number };
  converted_volume?: { [key: string]: number };
  trust_score?: string;
  bid_ask_spread_percentage?: number;
  timestamp?: Date;
  last_traded_at?: Date;
  last_fetch_at?: Date;
  is_anomaly?: boolean;
  is_stale?: boolean;
  trade_url?: string;
  token_info_url?: null;
  coin_id?: string;
  target_coin_id?: string;
}
export interface Image {
  thumb?: string;
  small?: string;
  large?: string;
}

export interface CoinFullInfo {
  id?: string;
  symbol?: string;
  name?: string;
  asset_platform_id?: null;
  platforms?: PLATFORMS;
  block_time_in_minutes?: number;
  hashing_algorithm?: string;
  categories?: string[];
  public_notice?: null;
  additional_notices?: any[];
  localization?: { [x: string]: string },
  description?: { [x: string]: string };
  links?: Links;
  image?: Image;
  country_origin?: string;
  genesis_date?: null;
  sentiment_votes_up_percentage?: null;
  sentiment_votes_down_percentage?: null;
  market_cap_rank?: number;
  coingecko_rank?: number;
  coingecko_score?: number;
  developer_score?: number;
  community_score?: number;
  liquidity_score?: number;
  public_interest_score?: number;
  market_data?: MarketData;
  community_data?: CommunityData;
  developer_data?: DeveloperData;
  public_interest_stats?: PublicInterestStats;
  status_updates?: any[];
  last_updated?: Date;
  tickers?: Ticker[];
}

export interface CoinTickerResponse {
  name: string;
  tickers: Ticker[]
}

export interface Localization {
  en: string;
  de: string;
  es: string;
  fr: string;
  it: string;
  pl: string;
  ro: string;
  hu: string;
  nl: string;
  pt: string;
  sv: string;
  vi: string;
  tr: string;
  ru: string;
  ja: string;
  zh: string;
  'zh-tw': string;
  ko: string;
  ar: string;
  th: string;
  id: string;
  [u: string]: string;
}

export interface CoinHistoryResponse extends BasicCoin {
  localization: Localization;
  image: Image;
  market_data: MarketData;
  community_data: CommunityData;
  developer_data: DeveloperData;
  public_interest_stats: PublicInterestStats;
}

export interface CoinMarketChartResponse {
  prices: Array<Array<number>>,
  market_caps: Array<Array<number>>,
  total_volumes: Array<Array<number>>
}

export interface Project {
  type: string;
  id: string;
  name: string;
  symbol: string;
  image: Image;
}

export interface StatusUpdate {
  description: string;
  category: string;
  created_at: Date;
  user: string;
  user_title: string;
  pin: boolean;
  project: Project;
}

export interface CoinStatusUpdateResponse {
  status_updates: StatusUpdate[];
}

export interface NameIdPair {
  name: string;
  id: string;
}

export interface ExchangeId {
  name: string;
  year_established: number;
  country: null;
  description: string;
  url: string;
  image: string;
  facebook_url: string;
  reddit_url: string;
  telegram_url: string;
  slack_url: string;
  other_url_1: string;
  other_url_2: string;
  twitter_handle: string;
  has_trading_incentive: boolean;
  centralized: boolean;
  public_notice: string;
  alert_notice: string;
  trust_score: null;
  trust_score_rank: number;
  trade_volume_24h_btc: number;
  trade_volume_24h_btc_normalized: number;
  tickers: Ticker[];
  status_updates: any[];
}

export interface ExchangeIdTickerResponse {
  name: string
  tickers: Ticker[]
}

export interface FinancePlatform {
  name?: string;
  facts?: string;
  category?: string;
  centralized?: boolean;
  website_url?: string;
}

export interface FinanceProduct {
  platform?: string;
  identifier?: string;
  supply_rate_percentage?: string;
  borrow_rate_percentage?: null;
  number_duration?: null;
  length_duration?: null;
  start_at?: number;
  end_at?: number;
  value_at?: number;
  redeem_at?: number;
}

export interface IndexItem {
  name?: string;
  id?: string;
  market?: string;
  last?: null;
  is_multi_asset_composite?: null;
}

export interface Derivative {
  market?: string;
  symbol?: string;
  index_id?: string;
  price?: string;
  price_percentage_change_24h?: number;
  contract_type?: string;
  index?: number;
  basis?: number;
  spread?: number;
  funding_rate?: number;
  open_interest?: number;
  volume_24h?: number;
  last_traded_at?: number;
  expired_at?: null;
}

export interface DerivativeExchange {
  name?: string;
  id?: string;
  open_interest_btc?: number;
  trade_volume_24h_btc?: string;
  number_of_perpetual_pairs?: number;
  number_of_futures_pairs?: number;
  image?: string;
  year_established?: number;
  country?: string;
  description?: string;
  url?: string;
}

export interface Country {
  country: string,
  code: string
}

export interface EventCountryResponse {
  count: number;
  data: Country[]
}

export interface EventResponse {
  data: any[],
  count: number;
  page: number
}

export interface EventsTypeResponse {
  data: string[],
  count: number;
}

export interface ExchangeRatesResponse {
  rates: {
    [x: string]: {
      name: string,
      type: string,
      value: number,
      unit: string
    }
  }
}

export interface GlobalData {
  active_cryptocurrencies: number;
  upcoming_icos: number;
  ongoing_icos: number;
  ended_icos: number;
  markets: number;
  total_market_cap: { [key: string]: number };
  total_volume: { [key: string]: number };
  market_cap_percentage: { [key: string]: number };
  market_cap_change_percentage_24h_usd: number;
  updated_at: number;
}

export interface GlobalDefiData {
  /**
   * Defi Market Capitalization in USD
   */
  defi_market_cap: string;
  /**
   * Ethereum Market Capitalization in USD
   */
  eth_market_cap: string;
  defi_to_eth_ratio: string;
  trading_volume_24h: string;
  defi_dominance: string;
  top_coin_name: string;
  top_coin_defi_dominance: number;
}

export type GlobalResponse = ResponseWithData<GlobalData>;

export type GlobalDefiResponse = ResponseWithData<GlobalDefiData>;

export interface Options {
  timeout?: number,
  autoRetry?: boolean,
  extraHTTPSOptions?: RequestOptions
}

export interface HttpResponse<T> {
  data: T,
  statusCode: number,
  headers: { [x: string]: string | string[] }
}
