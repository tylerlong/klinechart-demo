// Copied from https://github.com/klinecharts/KLineChart/blob/main/src/extension/indicator/movingAverage.ts
import type { Indicator, IndicatorTemplate, KLineData } from 'klinecharts';
import { IndicatorSeries } from 'klinecharts';

interface Ma {
  ma1?: number;
  ma2?: number;
}

const movingAverage: IndicatorTemplate<Ma> = {
  name: 'MA50200',
  shortName: 'MA',
  series: IndicatorSeries.Price,
  calcParams: [50, 200],
  precision: 2,
  shouldOhlc: true,
  figures: [
    { key: 'ma50', title: 'MA50: ', type: 'line' },
    { key: 'ma200', title: 'MA200: ', type: 'line' },
  ],
  regenerateFigures: (params: any[]) => {
    return params.map((p: number, i: number) => {
      return { key: `ma${i + 1}`, title: `MA${p}: `, type: 'line' };
    });
  },
  calc: (dataList: KLineData[], indicator: Indicator<Ma>) => {
    const { calcParams: params, figures } = indicator;
    const closeSums: number[] = [];
    return dataList.map((kLineData: KLineData, i: number) => {
      const ma = {};
      const close = kLineData.close;
      params.forEach((p: number, index: number) => {
        closeSums[index] = (closeSums[index] ?? 0) + close;
        if (i >= p - 1) {
          ma[figures[index].key] = closeSums[index] / p;
          closeSums[index] -= dataList[i - (p - 1)].close;
        }
      });
      return ma;
    });
  },
};

export default movingAverage;
