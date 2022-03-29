/* eslint-disable linebreak-style */
import { CoinGeckoClient } from './CoinGeckoClient';

const client = new CoinGeckoClient();
jest.setTimeout(30000);
describe('CoinGeckoClient test', () => {
  it('ping should successful', async () => {
    const ping = await client.ping();
    expect(ping).toEqual({ gecko_says: '(V3) To the Moon!' });
  });

  it('/search/trending should successful', async () => {
    const trending = await client.trending();
    expect(trending.coins?.length).toBeGreaterThan(1);
    trending.coins?.forEach(({ item }) => expect(item).toMatchObject({
      id: expect.any(String),
      large: expect.any(String),
      market_cap_rank: expect.any(Number),
      name: expect.any(String),
      score: expect.any(Number),
      symbol: expect.any(String),
      thumb: expect.any(String),
    }));
  });
  describe('Coins', () => {
    it('/coins/list should successful', async () => {
      const list = await client.coinList({ include_platform: true });
      expect(list.length).toBeGreaterThan(1);
    });
    it('/coins/id should successful', async () => {
      const coin = await client.coinId({ id: 'bitcoin' });
      expect(coin.name).toBe('Bitcoin');
      expect(coin.localization).not.toBeNull();
    });

    it('/coins/market should successful', async () => {
      const list = await client.coinMarket({ vs_currency: 'usd', ids: 'origin-protocol,bitcorn' });
      expect(list.length).toEqual(2);
    });

    it('/coins/{id}/tickers should successful', async () => {
      const ticker = await client.coinIdTickers({ id: 'origin-protocol' });
      expect(ticker.name).toEqual('Origin Protocol');
      expect(ticker.tickers.length).toBeGreaterThan(0);
    });

    it('/coins/{id}/history should successful', async () => {
      const coin = await client.coinIdHistory({ id: 'bitcoin', date: '01-04-2021' });
      expect(coin.name).toEqual('Bitcoin');
      expect(coin.localization).not.toBeNull();
    });

    it('/coins/{id}/history should successful with no localization', async () => {
      const coin = await client.coinIdHistory({ id: 'bitcoin', date: '01-04-2021', localization: false });
      expect(coin.name).toEqual('Bitcoin');
      expect(coin.localization).toEqual(undefined);
    });

    it('/coins/{id}/market_chart should successful', async () => {
      const marketChart = await client.coinIdMarketChart({
        id: 'bitcoin', vs_currency: 'aud', interval: 'hourly', days: 1,
      });
      expect(marketChart.prices.length).toBeGreaterThan(12);
      expect(marketChart.prices[0].length).toBe(2);
      expect(marketChart.prices[0][0]).toBeGreaterThan(0);
      expect(marketChart.prices[0][1]).toBeGreaterThan(0);
    });

    it('/coins/{id}/market_chart/range should successful', async () => {
      const marketChart = await client.coinIdMarketChartRange({
        id: 'bitcoin', vs_currency: 'aud', from: 1392577232, to: 1618716149,
      });
      expect(marketChart.prices.length).toBeGreaterThan(12);
      expect(marketChart.prices[0].length).toBe(2);
      expect(marketChart.prices[0][0]).toBeGreaterThan(0);
      expect(marketChart.prices[0][1]).toBeGreaterThan(0);
    });

    // ! Removed from API
    // it('/coins/{id}/status_updates should successful', async () => {
    //   const statusUpdate = await client.coinIdStatusUpdates({ id: 'litecoin' });
    //   console.log(statusUpdate);
    //   expect(statusUpdate.status_updates.length).toBeGreaterThan(0);
    // });

    it('/coins/{id}/ohlc should successful', async () => {
      const ohlc = await client.coinIdOHLC({ id: 'litecoin', vs_currency: 'aud', days: 30 });
      expect(ohlc.length).toBeGreaterThan(0);
      expect(ohlc[0].length).toBe(5);
    });
  });

  describe('Simple', () => {
    it('/simple/market should successful', async () => {
      const price = await client.simpleTokenPrice({
        contract_addresses: '0x8207c1ffc5b6804f6024322ccf34f29c3541ae26',
        id: 'ethereum',
        vs_currencies: 'btc,eth',
      });
      expect(price).toMatchObject({
        '0x8207c1ffc5b6804f6024322ccf34f29c3541ae26': {
          btc: expect.any(Number),
          eth: expect.any(Number),
        },
      });
    });

    it('/simple/supported_vs_currencies should successful', async () => {
      const list = await client.simpleSupportedCurrencies();
      expect(list.length).toBeGreaterThan(0);
      expect(list.includes('btc')).toBeTruthy();
    });

    it('/simple/prices should successful', async () => {
      const list = await client.simplePrice({ vs_currencies: 'eth', ids: 'bitcoin' });
      expect(list).toEqual({
        bitcoin: {
          eth: expect.any(Number),
        },
      });
    });
  });
  describe('Contract', () => {
    it('/coins/{id}/contract/{contract_address} should successful', async () => {
      const aave = await client.contract({ id: 'ethereum', contract_address: '0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9' });
      expect(aave.name).toBe('Aave');
    });

    it('/coins/{id}/contract/{contract_address}/market_chart should successful', async () => {
      const aave = await client.contractMarketChart({
        id: 'ethereum',
        contract_address: '0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9',
        vs_currency: 'aud',
        days: 5,
      });
      expect(aave.prices.length).toBeGreaterThan(0);
    });

    it('/coins/{id}/contract/{contract_address}/market_chart/range should successful', async () => {
      const aave = await client.contractMarketChartRange({
        id: 'ethereum',
        contract_address: '0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9',
        vs_currency: 'eth',
        from: 1392577232,
        to: 1618716149,
      });
      expect(aave.prices.length).toBeGreaterThan(0);
      expect(aave.market_caps.length).toBeGreaterThan(0);
      expect(aave.total_volumes.length).toBeGreaterThan(0);
    });
  });

  describe('Exchange', () => {
    it('/exchanges should successful', async () => {
      const exchanges = await client.exchanges({
      });
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
    });

    it('/exchange/list should successful', async () => {
      const exchanges = await client.exchangeList();
      expect(exchanges.length).toBeGreaterThan(0);

      expect(exchanges[0]).toEqual({
        id: '1bch',
        name: '1BCH',
      });
    });

    it('/exchange/id should successful', async () => {
      const aave = await client.exchangeId('aave');
      expect(aave.name).toEqual('Aave');
    });

    it('/exchange/id/tickers should successful', async () => {
      const aave = await client.exchangeIdTickers({ id: 'aave' });
      expect(aave.name).toEqual('Aave');
      expect(aave.tickers.length).toBeGreaterThan(1);
    });

    // ! Status updates no longer present on API
    // it('/exchange/id/status_update should successful', async () => {
    //   const aave = await client.exchangeIdStatusUpdates({ id: 'whitebit' });
    //   expect(aave.status_updates.length).toBeGreaterThan(1);
    // });

    it('/exchange/id/volume_chart should successful', async () => {
      const aave = await client.exchangeIdVolumeChart({ id: 'whitebit', days: 1 });
      expect(aave.length).toBeGreaterThan(1);
    });
  });

  describe('Finance', () => {
    it('/finance_platforms should successful', async () => {
      const platform = await client.financePlatforms({});
      expect(platform.length).toBeGreaterThan(0);
    });

    // ! Not present on API
    // it('/finance_products should successful', async () => {
    //   const products = await client.financeProducts({});
    //   expect(products.length).toBeGreaterThan(0);
    // });
  });

  describe('Indexes', () => {
    it('/indexes should successful', async () => {
      const indexes = await client.indexes();
      expect(indexes.length).toBeGreaterThan(0);
      expect(indexes[0]).toEqual({
        id: expect.any(String),
        is_multi_asset_composite: null,
        last: null,
        market: expect.any(String),
        name: expect.any(String),
      });
    });

    it('/indexes/list should successful', async () => {
      const list = await client.indexesList();
      expect(list.length).toBeGreaterThan(0);
    });
  });

  describe('Derivatives', () => {
    it('/derivatives should successful', async () => {
      const list = await client.derivatives({ include_tickers: 'all' });
      expect(list.length).toBeGreaterThan(0);
    });

    it('/derivatives/exchanges should successful', async () => {
      const list = await client.derivativesExchanges({ order: 'name_asc', per_page: 10 });
      expect(list.length).toBeGreaterThan(0);
    });

    it('/derivatives/exchanges/id should successful', async () => {
      const list = await client.derivativesExchangesId({ id: 'bitmex' });
      expect(list).toEqual({
        name: 'BitMEX',
        open_interest_btc: expect.any(Number),
        trade_volume_24h_btc: expect.any(String),
        number_of_perpetual_pairs: expect.any(Number),
        number_of_futures_pairs: expect.any(Number),
        image: expect.any(String),
        year_established: null,
        country: 'Seychelles',
        description: '',
        url: 'https://www.bitmex.com/',
      });
    });

    it('/derivatives/exchanges/list should successful', async () => {
      const list = await client.derivativesExchangesList();
      expect(list.length).toBeGreaterThan(0);
      expect(list[0]).toEqual({
        name: expect.any(String),
        id: expect.any(String),
      });
    });
  });
  //  ! No longer exists on API
  // describe('Status Updates', () => {
  //   it('/status_updates', async () => {
  //     const list = await client.statusUpdates();
  //     expect(list.status_updates.length).toBeGreaterThan(0);
  //   });
  // });

  // ! No longer exists on API
  // describe('Events', () => {
  //   it('/events', async () => {
  //     const list = await client.events();
  //     expect(list.data.length).toBeGreaterThanOrEqual(0);
  //   });

  //   it('/events/countries', async () => {
  //     const list = await client.eventsCountries();
  //     expect(list.data.length).toBeGreaterThan(0);
  //     expect(list.data[2]).toEqual({
  //       country: expect.any(String),
  //       code: expect.any(String),
  //     });
  //   });

  //   it('/events/types', async () => {
  //     const list = await client.eventsTypes();
  //     expect(list.count).toBeGreaterThanOrEqual(0);
  //   });
  // });

  describe('Exchange Rates', () => {
    it('/events', async () => {
      const list = await client.exchangeRates();
      expect(list.rates).not.toBeNull();
    });
  });

  describe('Global', () => {
    it('/global', async () => {
      const list = await client.global();
      expect(list.data).not.toBeNull();
    });

    it('/global/decentralized_finance_defi', async () => {
      const list = await client.globalDefi();
      expect(list.data).not.toBeNull();
    });
  });
});
