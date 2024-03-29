import React, { useState } from 'react';
import { Button, Input, Space, Typography, Divider, InputNumber, Select, DatePicker } from 'antd';
import { auto } from 'manate/react';
import { init, dispose, registerIndicator } from 'klinecharts';
import type { ITickerDetails, ITickerNews } from '@polygon.io/client-js';
import dayjs from 'dayjs';

import type { Store } from './store';
import polygon from './polygon';
import type { TimeSpan } from './types';
import { formatDateTime } from './utils';
import vol60 from './indicators/vol-60';
import ma50200 from './indicators/ma-50-200';
import ema1020 from './indicators/ema-10-20';

registerIndicator(vol60);
registerIndicator(ma50200);
registerIndicator(ema1020);
const { Title, Paragraph } = Typography;

const App = (props: { store: Store }) => {
  const [ticker, setTicker] = useState('TSLA');
  const [multiplier, setMultiplier] = useState(1 as number);
  const [timespan, setTimespan] = useState('day' as TimeSpan);
  const [from, setFrom] = useState(dayjs('2019-01-01'));
  const [to, setTo] = useState(dayjs('2030-01-01'));
  const [ticketDetail, setTickerDetail] = useState(undefined as ITickerDetails | undefined);
  const [tickerNews, setTickerNews] = useState(undefined as ITickerNews | undefined);

  const apply = async () => {
    // clean
    dispose('chart');
    setTickerDetail(undefined);
    setTickerNews(undefined);

    // chart
    const chart = init('chart', { timezone: 'America/New_York', locale: 'en-US' })!;
    const aggs = await polygon.stocks.aggregates(
      ticker,
      multiplier,
      timespan,
      from.format('YYYY-MM-DD'),
      to.format('YYYY-MM-DD'),
      {
        limit: 50000,
      },
    );
    chart.applyNewData(
      aggs.results!.map((item) => ({
        timestamp: item.t!,
        open: item.o!,
        high: item.h!,
        low: item.l!,
        close: item.c!,
        volume: item.v,
        turnover: item.vw,
      })),
    );

    // indicators
    chart.createIndicator('VOL60');
    // chart.createIndicator('RSI');
    chart.createIndicator('MA50200');
    // chart.createIndicator('EMA1020');

    // ticker detail
    setTickerDetail(await polygon.reference.tickerDetails(ticker));

    // ticker news
    setTickerNews(await polygon.reference.tickerNews({ ticker, limit: 16 }));
  };

  const render = () => (
    <>
      <Title>KLineChart Demo</Title>
      <Space>
        <Input
          onChange={(e) => setTicker(e.target.value.toUpperCase())}
          value={ticker}
          required
          onKeyDown={(e) => e.key === 'Enter' && apply()}
        ></Input>
        <InputNumber min={1} step={1} value={multiplier} onChange={(v) => setMultiplier(v!)} required />
        <Select
          style={{ width: 128 }}
          options={[
            { value: 'second', label: 'second' },
            { value: 'minute', label: 'minute' },
            { value: 'hour', label: 'hour' },
            { value: 'day', label: 'day' },
            { value: 'week', label: 'week' },
            { value: 'month', label: 'month' },
            { value: 'quarter', label: 'quarter' },
            { value: 'year', label: 'year' },
          ]}
          value={timespan}
          onChange={(v) => setTimespan(v)}
        ></Select>
        <DatePicker onChange={(d) => setFrom(d!)} value={from}></DatePicker>
        <DatePicker onChange={(d) => setTo(d!)} value={to}></DatePicker>
        <Button type="primary" onClick={apply}>
          Apply
        </Button>
      </Space>
      <Divider />
      <div id="chart"></div>
      <Divider />
      {ticketDetail?.results && (
        <>
          <Title level={2}>{ticketDetail.results?.name}</Title>
          <Paragraph>
            {ticketDetail.results?.branding?.icon_url && (
              <img
                src={`${ticketDetail.results.branding.icon_url}?apiKey=${process.env.POLYGON_API_KEY}`}
                alt={`${ticketDetail.results.name} icon`}
                className="inline-image"
              />
            )}
            {ticketDetail.results?.description}
          </Paragraph>
        </>
      )}
      <Divider />
      <Paragraph>
        Check{' '}
        <a href={`https://finance.yahoo.com/quote/${ticker}`} target="_blank">
          {ticker} on Yahoo Finance
        </a>
        .
      </Paragraph>
      <Paragraph>
        <ul>
          {tickerNews?.results.map((n) => (
            <li key={n.id}>
              <Space>
                <a href={n.article_url} target="_blank">
                  {n.title}
                </a>
                {formatDateTime(n.published_utc)}
                {n.publisher.name}
              </Space>
            </li>
          ))}
        </ul>
      </Paragraph>
      <Paragraph>
        <Title level={2}>Quick References</Title>
        <ul>
          <li>
            <a
              href="https://www.barchart.com/stocks/highs-lows?timeFrame=1y&orderBy=volume&orderDir=desc"
              target="_blank"
            >
              52-week highs
            </a>
          </li>
          <li>
            <a href="https://www.finviz.com/screener.ashx?v=111&f=ta_sma50_cross200a&ft=3" target="_blank">
              MA50 cross above MA200
            </a>
          </li>
          <li>
            <a
              href="https://finviz.com/screener.ashx?v=111&f=cap_midunder,sh_short_o10,ta_highlow52w_nh&ft=4&o=-volume"
              target="_blank"
            >
              Powerful screener
            </a>
          </li>
        </ul>
      </Paragraph>
    </>
  );
  return auto(render, props);
};

export default App;
