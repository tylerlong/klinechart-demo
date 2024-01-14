import React, { useEffect, useState } from 'react';
import { Button, Input, Space, Typography } from 'antd';
import { auto } from 'manate/react';
import { init, dispose } from 'klinecharts';
import axios from 'axios';

import type { Store } from './store';

const { Title } = Typography;

const App = (props: { store: Store }) => {
  useEffect(() => {
    // 初始化图表
    const chart = init('chart')!;

    // 为图表添加数据
    chart.applyNewData([
      { close: 4976.16, high: 4977.99, low: 4970.12, open: 4972.89, timestamp: 1587660000000, volume: 204 },
      { close: 4977.33, high: 4979.94, low: 4971.34, open: 4973.2, timestamp: 1587660060000, volume: 194 },
      { close: 4977.93, high: 4977.93, low: 4974.2, open: 4976.53, timestamp: 1587660120000, volume: 197 },
      { close: 4966.77, high: 4968.53, low: 4962.2, open: 4963.88, timestamp: 1587660180000, volume: 28 },
      { close: 4961.56, high: 4972.61, low: 4961.28, open: 4961.28, timestamp: 1587660240000, volume: 184 },
      { close: 4964.19, high: 4964.74, low: 4961.42, open: 4961.64, timestamp: 1587660300000, volume: 191 },
      { close: 4968.93, high: 4972.7, low: 4964.55, open: 4966.96, timestamp: 1587660360000, volume: 105 },
      { close: 4979.31, high: 4979.61, low: 4973.99, open: 4977.06, timestamp: 1587660420000, volume: 35 },
      { close: 4977.02, high: 4981.66, low: 4975.14, open: 4981.66, timestamp: 1587660480000, volume: 135 },
      { close: 4985.09, high: 4988.62, low: 4980.3, open: 4986.72, timestamp: 1587660540000, volume: 76 },
    ]);

    return () => {
      // 销毁图表
      dispose('chart');
    };
  }, []);

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
            const chart = init('chart')!;
            const r = await axios.get(
              `https://api.polygon.io/v2/aggs/ticker/${ticker}/range/${multiplier}/${timespan}/${from}/${to}?apiKey=${process.env.POLYGON_API_KEY}&limit=50000`,
            );
            console.log(r.data);
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
          Submit
        </Button>
      </Space>
      <div id="chart"></div>
    </>
  );
  return auto(render, props);
};

export default App;
