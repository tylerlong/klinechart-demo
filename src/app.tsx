import React, { useState } from 'react';
import { Button, Input, Space, Typography, Divider } from 'antd';
import { auto } from 'manate/react';
import { init, dispose } from 'klinecharts';
import axios from 'axios';

import type { Store } from './store';
import type { Company, News } from './types';

const { Title, Paragraph } = Typography;

const App = (props: { store: Store }) => {
  const [ticker, setTicker] = useState('TSLA');
  const [multiplier, setMultiplier] = useState('1');
  const [timespan, setTimespan] = useState('day');
  const [from, setFrom] = useState('2000-01-01');
  const [to, setTo] = useState('2030-01-01');
  const [company, setCompany] = useState(undefined as Company | undefined);
  const [news, setNews] = useState([] as News[]);
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
            // chart
            dispose('chart');
            const chart = init('chart', { timezone: 'America/New_York', locale: 'en-US' })!;
            let r = await axios.get(
              `https://api.polygon.io/v2/aggs/ticker/${ticker}/range/${multiplier}/${timespan}/${from}/${to}?apiKey=${process.env.POLYGON_API_KEY}&limit=50000`,
            );
            chart.applyNewData(
              r.data.results.map((data: any) => ({
                timestamp: data.t,
                open: data.o,
                high: data.h,
                low: data.l,
                close: data.c,
                volume: data.v,
                turnover: data.vw,
              })),
            );

            // company
            r = await axios.get(
              `https://api.polygon.io/v3/reference/tickers/${ticker}?apiKey=${process.env.POLYGON_API_KEY}`,
            );
            setCompany(r.data.results);

            // news
            r = await axios.get(
              `https://api.polygon.io/v2/reference/news?ticker=${ticker}&apiKey=${process.env.POLYGON_API_KEY}&limit=1000`,
            );
            setNews(r.data.results);
          }}
        >
          Apply
        </Button>
      </Space>
      <Divider />
      <div id="chart"></div>

      <Divider />

      {company && (
        <>
          <Title level={2}>{company.name}</Title>
          <Paragraph>
            {company.branding.icon_url && (
              <img
                src={`${company.branding.icon_url}?apiKey=${process.env.POLYGON_API_KEY}`}
                alt={`${company.name} icon`}
                className="inline-image"
              />
            )}
            {company.description}
          </Paragraph>
        </>
      )}

      <Paragraph>
        <ul>
          {news.map((n) => (
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
