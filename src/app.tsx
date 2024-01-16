import React, { useState } from 'react';
import { Button, Input, Space, Typography, Divider } from 'antd';
import { auto } from 'manate/react';
import { init, dispose } from 'klinecharts';
import type { ITickerDetails, ITickerNews } from '@polygon.io/client-js';

import type { Store } from './store';
import polygon from './polygon';

const { Title, Paragraph } = Typography;

const App = (props: { store: Store }) => {
  const [ticker, setTicker] = useState('TSLA');
  const [multiplier, setMultiplier] = useState('1');
  const [timespan, setTimespan] = useState('day');
  const [from, setFrom] = useState('2000-01-01');
  const [to, setTo] = useState('2030-01-01');
  const [ticketDetail, setTickerDetail] = useState(undefined as ITickerDetails | undefined);
  const [tickerNews, setTickerNews] = useState(undefined as ITickerNews | undefined);
  const render = () => (
    <>
      <Title>KLineChart Demo</Title>
      <Space>
        <Input onChange={(e) => setTicker(e.target.value.toUpperCase())} value={ticker}></Input>
        <Input onChange={(e) => setMultiplier(e.target.value)} value={multiplier}></Input>
        <Input onChange={(e) => setTimespan(e.target.value)} value={timespan}></Input>
        <Input onChange={(e) => setFrom(e.target.value)} value={from}></Input>
        <Input onChange={(e) => setTo(e.target.value)} value={to}></Input>
        <Button
          onClick={async () => {
            // clean
            dispose('chart');
            setTickerDetail(undefined);
            setTickerNews(undefined);

            // chart
            const chart = init('chart', { timezone: 'America/New_York', locale: 'en-US' })!;
            const aggs = await polygon.stocks.aggregates(ticker, parseInt(multiplier, 10), timespan, from, to, {
              limit: 50000,
            });
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

            // ticker detail
            setTickerDetail(await polygon.reference.tickerDetails(ticker));

            // ticker news
            setTickerNews(await polygon.reference.tickerNews({ ticker, limit: 100 }));
          }}
        >
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
        <ul>
          {tickerNews?.results.map((n) => (
            <li key={n.id}>
              <Space>
                <a href={n.article_url} target="_blank">
                  {n.title}
                </a>
                {new Intl.DateTimeFormat('en-US', {
                  timeZone: 'America/New_York',
                  dateStyle: 'short',
                  timeStyle: 'short',
                }).format(new Date(n.published_utc))}
                {n.publisher.name}
              </Space>
            </li>
          ))}
        </ul>
      </Paragraph>
    </>
  );
  return auto(render, props);
};

export default App;
