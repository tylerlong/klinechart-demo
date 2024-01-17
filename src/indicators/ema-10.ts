// Copied from https://github.com/klinecharts/KLineChart/blob/main/src/extension/indicator/exponentialMovingAverage.ts
import type { Indicator, IndicatorTemplate, KLineData } from 'klinecharts';
import { IndicatorSeries } from 'klinecharts';

interface Ema {
  ema1?: number;
}

/**
 * EMA 指数移动平均
 */
const exponentialMovingAverage: IndicatorTemplate<Ema> = {
  name: 'EMA10',
  shortName: 'EMA',
  series: IndicatorSeries.Price,
  calcParams: [10],
  precision: 2,
  shouldOhlc: true,
  figures: [{ key: 'ema1', title: 'EMA10: ', type: 'line' }],
  regenerateFigures: (params: any[]) => {
    return params.map((p: number, i: number) => {
      return { key: `ema${i + 1}`, title: `EMA${p}: `, type: 'line' };
    });
  },
  calc: (dataList: KLineData[], indicator: Indicator<Ema>) => {
    const { calcParams: params, figures } = indicator;
    let closeSum = 0;
    const emaValues: number[] = [];
    return dataList.map((kLineData: KLineData, i: number) => {
      const ema = {};
      const close = kLineData.close;
      closeSum += close;
      params.forEach((p: number, index: number) => {
        if (i >= p - 1) {
          if (i > p - 1) {
            emaValues[index] = (2 * close + (p - 1) * emaValues[index]) / (p + 1);
          } else {
            emaValues[index] = closeSum / p;
          }
          ema[figures[index].key] = emaValues[index];
        }
      });
      return ema;
    });
  },
};

export default exponentialMovingAverage;
