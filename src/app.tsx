import React, { useState } from 'react';
import { Button, Input, Space, Typography, Divider } from 'antd';
import { auto } from 'manate/react';
import { init, dispose } from 'klinecharts';
import axios from 'axios';

import type { Store } from './store';

const { Title, Paragraph } = Typography;

const App = (props: { store: Store }) => {
  const [ticker, setTicker] = useState('AAPL');
  const [multiplier, setMultiplier] = useState('1');
  const [timespan, setTimespan] = useState('day');
  const [from, setFrom] = useState('2000-01-01');
  const [to, setTo] = useState('2030-01-01');
  const [companyName, setCompanyName] = useState('');
  const [companyDescription, setCompanyDescription] = useState('');
  const [iconUrl, setIconUrl] = useState('');
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
            r = await axios.get(
              `https://api.polygon.io/v3/reference/tickers/${ticker}?apiKey=${process.env.POLYGON_API_KEY}`,
            );
            const tickerInfo = r.data.results;
            setCompanyName(tickerInfo.name);
            setCompanyDescription(tickerInfo.description);
            setIconUrl(tickerInfo.branding.icon_url);
          }}
        >
          Apply
        </Button>
      </Space>
      <Divider />
      <div id="chart"></div>
      <Divider />
      <Title level={2}>{companyName}</Title>
      <Paragraph>
        {iconUrl && (
          <img src={`${iconUrl}?apiKey=${process.env.POLYGON_API_KEY}`} alt="icon" className="inline-image" />
        )}
        {companyDescription}
      </Paragraph>
    </>
  );
  return auto(render, props);
};

export default App;
