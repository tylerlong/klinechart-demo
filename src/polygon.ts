import type { AxiosInstance } from 'axios';
import axios from 'axios';

import type { AggregateBarsParams as AggregatesBarsParams, TickerDetailsParams, TickerNewsParams } from './types';

class Polygon {
  private axios: AxiosInstance;
  public constructor(apiKey: string) {
    this.axios = axios.create({
      baseURL: 'https://api.polygon.io',
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    });
  }

  public async aggregatesBars(params: AggregatesBarsParams) {
    const r = await this.axios.get(
      `/v2/aggs/ticker/${params.ticker}/range/${params.multiplier}/${params.timespan}/${params.from}/${params.to}`,
      { params: { limit: 50000 } },
    );
    return r.data.results;
  }

  public async tickerDetail(params: TickerDetailsParams) {
    const r = await this.axios.get(`/v3/reference/tickers/${params.ticker}`);
    return r.data.results;
  }

  public async tickerNews(params: TickerNewsParams) {
    const r = await this.axios.get(`/v2/reference/news?ticker=${params.ticker}`, { params: { limit: 1000 } });
    return r.data.results;
  }
}

const polygon = new Polygon(process.env.POLYGON_API_KEY!);
export default polygon;
