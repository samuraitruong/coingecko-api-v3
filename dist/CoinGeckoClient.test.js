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
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable linebreak-style */
const CoinGeckoClient_1 = require("./CoinGeckoClient");
const client = new CoinGeckoClient_1.CoinGeckoClient();
jest.setTimeout(60000);
describe("CoinGeckoClient test", () => {
    it("ping should successful", () => __awaiter(void 0, void 0, void 0, function* () {
        const ping = yield client.ping();
        expect(ping).toEqual({ gecko_says: "(V3) To the Moon!" });
    }));
    it("/search/trending should successful", () => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b;
        const trending = yield client.trending();
        expect((_a = trending.coins) === null || _a === void 0 ? void 0 : _a.length).toBeGreaterThan(1);
        (_b = trending.coins) === null || _b === void 0 ? void 0 : _b.forEach(({ item }) => expect(item).toMatchObject({
            id: expect.any(String),
            large: expect.any(String),
            market_cap_rank: expect.any(Number),
            name: expect.any(String),
            score: expect.any(Number),
            symbol: expect.any(String),
            thumb: expect.any(String),
        }));
    }));
    describe("Coins", () => {
        it("/coins/list should successful", () => __awaiter(void 0, void 0, void 0, function* () {
            const list = yield client.coinList({ include_platform: true });
            expect(list.length).toBeGreaterThan(1);
        }));
        it("/coins/id should successful", () => __awaiter(void 0, void 0, void 0, function* () {
            const coin = yield client.coinId({ id: "bitcoin" });
            expect(coin.name).toBe("Bitcoin");
            expect(coin.localization).not.toBeNull();
        }));
        it("/coins/market should successful", () => __awaiter(void 0, void 0, void 0, function* () {
            const list = yield client.coinMarket({
                vs_currency: "usd",
                ids: "origin-protocol,bitcoin",
            });
            expect(list.length).toEqual(2);
        }));
        it("/coins/{id}/tickers should successful", () => __awaiter(void 0, void 0, void 0, function* () {
            const ticker = yield client.coinIdTickers({ id: "origin-protocol" });
            expect(ticker.name).toEqual("Origin Protocol");
            expect(ticker.tickers.length).toBeGreaterThan(0);
        }));
        it("/coins/{id}/history should successful", () => __awaiter(void 0, void 0, void 0, function* () {
            const coin = yield client.coinIdHistory({
                id: "bitcoin",
                date: "01-04-2021",
            });
            expect(coin.name).toEqual("Bitcoin");
            expect(coin.localization).not.toBeNull();
        }));
        it("/coins/{id}/history should successful with no localization", () => __awaiter(void 0, void 0, void 0, function* () {
            const coin = yield client.coinIdHistory({
                id: "bitcoin",
                date: "01-04-2021",
                localization: false,
            });
            expect(coin.name).toEqual("Bitcoin");
            expect(coin.localization).toEqual(undefined);
        }));
        it("/coins/{id}/market_chart should successful", () => __awaiter(void 0, void 0, void 0, function* () {
            const marketChart = yield client.coinIdMarketChart({
                id: "bitcoin",
                vs_currency: "aud",
                interval: "hourly",
                days: 1,
            });
            expect(marketChart.prices.length).toBeGreaterThan(12);
            expect(marketChart.prices[0].length).toBe(2);
            expect(marketChart.prices[0][0]).toBeGreaterThan(0);
            expect(marketChart.prices[0][1]).toBeGreaterThan(0);
        }));
        it("/coins/{id}/market_chart/range should successful", () => __awaiter(void 0, void 0, void 0, function* () {
            const marketChart = yield client.coinIdMarketChartRange({
                id: "bitcoin",
                vs_currency: "aud",
                from: 1392577232,
                to: 1618716149,
            });
            expect(marketChart.prices.length).toBeGreaterThan(12);
            expect(marketChart.prices[0].length).toBe(2);
            expect(marketChart.prices[0][0]).toBeGreaterThan(0);
            expect(marketChart.prices[0][1]).toBeGreaterThan(0);
        }));
        it("/coins/{id}/ohlc should successful", () => __awaiter(void 0, void 0, void 0, function* () {
            const ohlc = yield client.coinIdOHLC({
                id: "litecoin",
                vs_currency: "aud",
                days: 30,
            });
            expect(ohlc.length).toBeGreaterThan(0);
            expect(ohlc[0].length).toBe(5);
        }));
    });
    describe("Simple", () => {
        it("/simple/market should successful", () => __awaiter(void 0, void 0, void 0, function* () {
            const price = yield client.simpleTokenPrice({
                contract_addresses: "0x8207c1ffc5b6804f6024322ccf34f29c3541ae26",
                id: "ethereum",
                vs_currencies: "btc,eth",
            });
            expect(price).toMatchObject({
                "0x8207c1ffc5b6804f6024322ccf34f29c3541ae26": {
                    btc: expect.any(Number),
                    eth: expect.any(Number),
                },
            });
        }));
        it("/simple/supported_vs_currencies should successful", () => __awaiter(void 0, void 0, void 0, function* () {
            const list = yield client.simpleSupportedCurrencies();
            expect(list.length).toBeGreaterThan(0);
            expect(list.includes("btc")).toBeTruthy();
        }));
        it("/simple/prices should successful", () => __awaiter(void 0, void 0, void 0, function* () {
            const list = yield client.simplePrice({
                vs_currencies: "eth",
                ids: "bitcoin",
            });
            expect(list).toEqual({
                bitcoin: {
                    eth: expect.any(Number),
                },
            });
        }));
    });
    describe("Contract", () => {
        it("/coins/{id}/contract/{contract_address} should successful", () => __awaiter(void 0, void 0, void 0, function* () {
            const aave = yield client.contract({
                id: "ethereum",
                contract_address: "0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9",
            });
            expect(aave.name).toBe("Aave");
        }));
        it("/coins/{id}/contract/{contract_address}/market_chart should successful", () => __awaiter(void 0, void 0, void 0, function* () {
            const aave = yield client.contractMarketChart({
                id: "ethereum",
                contract_address: "0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9",
                vs_currency: "aud",
                days: 5,
            });
            expect(aave.prices.length).toBeGreaterThan(0);
        }));
        it("/coins/{id}/contract/{contract_address}/market_chart/range should successful", () => __awaiter(void 0, void 0, void 0, function* () {
            const aave = yield client.contractMarketChartRange({
                id: "ethereum",
                contract_address: "0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9",
                vs_currency: "eth",
                from: 1392577232,
                to: 1618716149,
            });
            expect(aave.prices.length).toBeGreaterThan(0);
            expect(aave.market_caps.length).toBeGreaterThan(0);
            expect(aave.total_volumes.length).toBeGreaterThan(0);
        }));
    });
    describe("Exchange", () => {
        it("/exchanges should successful", () => __awaiter(void 0, void 0, void 0, function* () {
            const exchanges = yield client.exchanges({});
            expect(exchanges.length).toBeGreaterThan(0);
            expect(exchanges[0]).toEqual({
                id: expect.any(String),
                name: expect.any(String),
                country: expect.any(String),
                description: expect.any(String),
                has_trading_incentive: expect.any(Boolean),
                image: expect.any(String),
                trade_volume_24h_btc: expect.any(Number),
                trade_volume_24h_btc_normalized: expect.any(Number),
                trust_score: expect.any(Number),
                trust_score_rank: expect.any(Number),
                url: expect.any(String),
                year_established: expect.any(Number),
            });
        }));
        it("/exchange/list should successful", () => __awaiter(void 0, void 0, void 0, function* () {
            const exchanges = yield client.exchangeList();
            expect(exchanges.length).toBeGreaterThan(0);
            expect(exchanges[0]).toEqual({
                id: "1bch",
                name: "1BCH",
            });
        }));
        it("/exchange/id should successful", () => __awaiter(void 0, void 0, void 0, function* () {
            const aave = yield client.exchangeId("aave");
            expect(aave.name).toEqual("Aave");
        }));
        it("/exchange/id/tickers should successful", () => __awaiter(void 0, void 0, void 0, function* () {
            const aave = yield client.exchangeIdTickers({ id: "aave" });
            expect(aave.name).toEqual("Aave");
            expect(aave.tickers.length).toBeGreaterThan(1);
        }));
        it("/exchange/id/volume_chart should successful", () => __awaiter(void 0, void 0, void 0, function* () {
            const aave = yield client.exchangeIdVolumeChart({
                id: "whitebit",
                days: 1,
            });
            expect(aave.length).toBeGreaterThan(1);
        }));
    });
    describe("Finance", () => {
        it("/finance_platforms should successful", () => __awaiter(void 0, void 0, void 0, function* () {
            const platform = yield client.financePlatforms({});
            expect(platform.length).toBeGreaterThan(0);
        }));
    });
    describe("Indexes", () => {
        it("/indexes should successful", () => __awaiter(void 0, void 0, void 0, function* () {
            const indexes = yield client.indexes();
            expect(indexes.length).toBeGreaterThan(0);
            expect(indexes[0]).toEqual({
                id: expect.any(String),
                is_multi_asset_composite: false,
                last: expect.any(Number),
                market: expect.any(String),
                name: expect.any(String),
            });
        }));
        it("/indexes/list should successful", () => __awaiter(void 0, void 0, void 0, function* () {
            const list = yield client.indexesList();
            expect(list.length).toBeGreaterThan(0);
        }));
    });
    describe("Derivatives", () => {
        it("/derivatives should successful", () => __awaiter(void 0, void 0, void 0, function* () {
            const list = yield client.derivatives({ include_tickers: "all" });
            expect(list.length).toBeGreaterThan(0);
        }));
        it("/derivatives/exchanges should successful", () => __awaiter(void 0, void 0, void 0, function* () {
            const list = yield client.derivativesExchanges({
                order: "name_asc",
                per_page: 10,
            });
            expect(list.length).toBeGreaterThan(0);
        }));
        it("/derivatives/exchanges/id should successful", () => __awaiter(void 0, void 0, void 0, function* () {
            const item = yield client.derivativesExchangesId({
                id: "binance_futures",
            });
            expect(item).toEqual({
                name: "Binance (Futures)",
                open_interest_btc: expect.any(Number),
                trade_volume_24h_btc: expect.any(String),
                number_of_perpetual_pairs: expect.any(Number),
                number_of_futures_pairs: expect.any(Number),
                image: expect.any(String),
                year_established: 2019,
                country: null,
                description: "",
                url: "https://www.binance.com/",
            });
        }));
        it("/derivatives/exchanges/list should successful", () => __awaiter(void 0, void 0, void 0, function* () {
            const list = yield client.derivativesExchangesList();
            expect(list.length).toBeGreaterThan(0);
            expect(list[0]).toEqual({
                name: expect.any(String),
                id: expect.any(String),
            });
        }));
    });
    describe("Exchange Rates", () => {
        it("/exchange_rates", () => __awaiter(void 0, void 0, void 0, function* () {
            const list = yield client.exchangeRates();
            expect(list.rates).not.toBeNull();
        }));
    });
    describe("Global", () => {
        it("/global", () => __awaiter(void 0, void 0, void 0, function* () {
            const list = yield client.global();
            expect(list.data).not.toBeNull();
        }));
        it("/global/decentralized_finance_defi", () => __awaiter(void 0, void 0, void 0, function* () {
            const list = yield client.globalDefi();
            expect(list.data).not.toBeNull();
        }));
    });
});
