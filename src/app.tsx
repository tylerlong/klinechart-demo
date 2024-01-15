import React, { useState } from 'react';
import { Button, Input, Space, Typography, Divider } from 'antd';
import { auto } from 'manate/react';
import { init, dispose } from 'klinecharts';

import type { Store } from './store';
import type { Company, News } from './types';
import polygon from './polygon';

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
            // clean
            dispose('chart');
            setCompany(undefined);
            setNews([]);

            // chart
            const chart = init('chart', { timezone: 'America/New_York', locale: 'en-US' })!;
            const aggregatesBars = await polygon.aggregatesBars({
              ticker,
              multiplier: parseInt(multiplier, 10),
              timespan,
              from,
              to,
            });
            chart.applyNewData(
              aggregatesBars.map((data: any) => ({
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
            setCompany(await polygon.tickerDetail({ ticker }));

            // news
            setNews(await polygon.tickerNews({ ticker }));
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
