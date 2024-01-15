export interface Company {
  name: string;
  description: string;
  branding: { icon_url: string };
}

export interface News {
  id: string;
  title: string;
  article_url: string;
  published_utc: string;
  publisher: { name: string };
}

export interface AggregateBarsParams {
  ticker: string;
  multiplier: number;
  timespan: string;
  from: string;
  to: string;
}

export interface TickerDetailsParams {
  ticker: string;
}

export interface TickerNewsParams {
  ticker: string;
}
