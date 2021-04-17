import { CoinGeckoClient } from './CoinGeckoClient';

const client = new CoinGeckoClient();
jest.setTimeout(30000)
describe('CoinGeckoClient test', () => {
  it('ping should successful', async () => {
    const ping = await client.ping();
    expect(ping).toEqual({ gecko_says: '(V3) To the Moon!' })
  })

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
    }))
  })

  it('/coins/list should successful', async () => {
    const list = await client.coinList({ include_platform: true });
    expect(list.length).toBeGreaterThan(1)
  })

  it('/coins/market should successful', async () => {
    const list = await client.coinMarket({ vs_currency: 'usd', ids: 'origin-protocol,bitcorn' });
    expect(list.length).toEqual(2)
    expect(list).toMatchSnapshot();
  })

  it.only('/coins/{id}/tickers should successful', async () => {
    const ticker = await client.coinTickers({ id: 'origin-protocol' });
    expect(ticker.name).toEqual("Origin Protocol")
    expect(ticker.tickers.length).toBeGreaterThan(0)
  })


  it.only('/simple/market should successful', async () => {
    const price = await client.simpleTokenPrice({ contract_addresses: '0x8207c1ffc5b6804f6024322ccf34f29c3541ae26', id: 'ethereum', vs_currencies: 'btc,eth' });
    expect(price).toMatchObject({
      '0x8207c1ffc5b6804f6024322ccf34f29c3541ae26': {
        btc: expect.any(Number),
        eth: expect.any(Number)
      }
    });
  })

  it('/simple/supported_vs_currencies should successful', async () => {
    const list = await client.simpleSupportedCurrencies();
    expect(list).toMatchSnapshot();
  })


})
