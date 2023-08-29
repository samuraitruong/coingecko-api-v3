export enum API_ROUTES {
  PING = "/ping",
  SEARCH = "/search",
  SEARCH_TRENDING = "/search/trending",
  COIN = "/coins/{id}",
  COIN_LIST = "/coins/list",
  COIN_MARKET = "/coins/markets",
  COIN_TICKERS = "/coins/{id}/tickers",
  COIN_HISTORY = "/coins/{id}/history",
  COIN_MARKET_CHART = "/coins/{id}/market_chart",
  COIN_MARKET_CHART_RANGE = "/coins/{id}/market_chart/range",
  COIN_OHLC = "/coins/{id}/ohlc",
  SIMPLE_PRICE = "/simple/price",
  SIMPLE_SUPPORTED_CURRENCIES = "/simple/supported_vs_currencies",
  SIMPLE_TOKEN_PRICE = "/simple/token_price/{id}",
  CONTRACT = "/coins/{id}/contract/{contract_address}",
  CONTRACT_MARKET_CHART = "/coins/{id}/contract/{contract_address}/market_chart",
  CONTRACT_MARKET_CHART_RANGE = "/coins/{id}/contract/{contract_address}/market_chart/range",
  EXCHANGES = "/exchanges",
  EXCHANGE_LIST = "/exchanges/list",
  EXCHANGE_ID = "/exchanges/{id}",
  EXCHANGE_ID_TICKER = "/exchanges/{id}/tickers",
  EXCHANGE_ID_VOL_CHART = "/exchanges/{id}/volume_chart",
  FINANCE_PLATFORM = "/asset_platforms",
  INDEXES = "/indexes",
  INDEXES_LIST = "/indexes/list",
  INDEXES_MARKET_ID = "/indexes/{market_id}/{id}",
  INDEXES_LIST_MARKET_AND_ID = "/indexes/list_by_market_and_id/{market_id}/{id}",
  DERIVATIVES = "/derivatives",
  DERIVATIVES_EXCHANGES = "/derivatives/exchanges",
  DERIVATIVES_EXCHANGES_ID = "/derivatives/exchanges/{id}",
  DERIVATIVES_EXCHANGES_LIST = "/derivatives/exchanges/list",
  EXCHANGE_RATES = "/exchange_rates",
  GLOBAL = "/global",
  GLOBAL_DEFI = "/global/decentralized_finance_defi",
}
/**
 * @description if any platform enums is missing please visit https://www.coingecko.com/en/api/documentation
 */
export type PLATFORMS =
  | "ethereum"
  | "polygon-pos"
  | "energi"
  | "harmony-shard-0"
  | "avalanche"
  | "fantom"
  | "binance-smart-chain"
  | "xdai"
  | "aurora"
  | "smartbch"
  | "near-protocol"
  | "arbitrum-one"
  | "solana"
  | "klay-token"
  | "bitgert"
  | "tron"
  | "cardano"
  | "optimistic-ethereum"
  | "sora"
  | "huobi-token"
  | "conflux"
  | "aptos"
  | "polkadot"
  | "moonbeam"
  | "chiliz"
  | "boba"
  | "komodo"
  | "base"
  | "Bitcichain"
  | "zksync"
  | "metis-andromeda"
  | "elrond"
  | "ardor"
  | "qtum"
  | "stellar"
  | "cronos"
  | "osmosis"
  | "syscoin"
  | "stacks"
  | "algorand"
  | "moonriver"
  | "celo"
  | "eos"
  | "astar"
  | "kusama"
  | "the-open-network"
  | "terra"
  | "polygon-zkevm"
  | "telos"
  | "pulsechain"
  | "core"
  | "evmos"
  | "arbitrum-nova"
  | "cosmos"
  | "kardiachain"
  | "okex-chain"
  | "songbird"
  | "terra-2"
  | "proof-of-memes"
  | "velas"
  | "sui"
  | "oasis"
  | "secret"
  | "kava"
  | "ronin"
  | "linea"
  | "icon"
  | "ordinals"
  | "fuse"
  | "nem"
  | "binancecoin"
  | "thundercore"
  | "iotex"
  | "elastos"
  | "milkomeda-cardano"
  | "theta"
  | "meter"
  | "hedera-hashgraph"
  | "hoo"
  | "kucoin-community-chain"
  | "bittorrent"
  | "xdc-network"
  | "zilliqa"
  | "oasys"
  | "nuls"
  | "rootstock"
  | "mixin-network"
  | "canto"
  | "mantle"
  | "fusion-network"
  | "hydra"
  | "xrp"
  | "tomochain"
  | "neo"
  | "tezos"
  | "step-network"
  | "defi-kingdoms-blockchain"
  | "bitkub-chain"
  | "factom"
  | "dogechain"
  | "ethereum-classic"
  | "vechain"
  | "waves"
  | "bitcoin-cash"
  | "empire"
  | "kujira"
  | "everscale"
  | "exosama"
  | "findora"
  | "godwoken"
  | "coinex-smart-chain"
  | "trustless-computer"
  | "ethereumpow"
  | "stratis"
  | "cube"
  | "shiden network"
  | "tombchain"
  | "sx-network"
  | "ontology"
  | "eos-evm"
  | "omni"
  | "onus"
  | "bitshares"
  | "flare-network"
  | "rollux"
  | "wanchain"
  | "function-x"
  | "skale"
  | "callisto"
  | "wemix-network"
  | "tenet"
  | "neon-evm"
  | "thorchain"
  | "gochain"
  | "celer-network"
  | "vite"
  & string
