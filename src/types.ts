export interface AggregatesBar {
  t: number;
  o: number;
  h: number;
  l: number;
  c: number;
  v: number;
  vw: number;
}

export interface TickerDetail {
  name: string;
  description: string;
  branding: { icon_url: string };
}

export interface TickerNews {
  id: string;
  title: string;
  article_url: string;
  published_utc: string;
  publisher: { name: string };
}

export interface AggregatesBarsParams {
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
