import React, { useState } from 'react';
import { Button, Input, Space, Typography } from 'antd';
import { auto } from 'manate/react';
import { init, dispose } from 'klinecharts';
import axios from 'axios';

import type { Store } from './store';

const { Title } = Typography;

const App = (props: { store: Store }) => {
  const [ticker, setTicker] = useState('AAPL');
  const [multiplier, setMultiplier] = useState('1');
  const [timespan, setTimespan] = useState('day');
  const [from, setFrom] = useState('2000-01-01');
  const [to, setTo] = useState('2030-01-01');
  const render = () => (
    <>
      <Title>KLineChart Demo</Title>
      <Space>
        <Input onChange={(e) => setTicker(e.target.value)} value={ticker}></Input>
        <Input onChange={(e) => setMultiplier(e.target.value)} value={multiplier}></Input>
        <Input onChange={(e) => setTimespan(e.target.value)} value={timespan}></Input>
        <Input onChange={(e) => setFrom(e.target.value)} value={from}></Input>
        <Input onChange={(e) => setTo(e.target.value)} value={to}></Input>
        <Button
          onClick={async () => {
            console.log('clicked');
            dispose('chart');
            const chart = init('chart', { timezone: 'America/New_York', locale: 'en-US' })!;
            const r = await axios.get(
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
          }}
        >
          Apply
        </Button>
      </Space>
      <div id="chart"></div>
    </>
  );
  return auto(render, props);
};

export default App;
