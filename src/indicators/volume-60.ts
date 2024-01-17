// Copied from https://github.com/klinecharts/KLineChart/blob/main/src/extension/indicator/volume.ts
import type {
  Indicator,
  IndicatorFigure,
  IndicatorFigureStylesCallbackData,
  IndicatorStyle,
  IndicatorTemplate,
  KLineData,
} from 'klinecharts';
import { IndicatorSeries } from 'klinecharts';
import { utils } from 'klinecharts';

interface Vol {
  volume?: number;
  ma1?: number;
  ma2?: number;
  ma3?: number;
}

const volume: IndicatorTemplate<Vol> = {
  name: 'VOL60',
  shortName: 'VOL',
  series: IndicatorSeries.Volume,
  calcParams: [5, 20, 60],
  shouldFormatBigNumber: true,
  precision: 0,
  minValue: 0,
  figures: [
    { key: 'ma1', title: 'MA5: ', type: 'line' },
    { key: 'ma2', title: 'MA20: ', type: 'line' },
    { key: 'ma3', title: 'MA60: ', type: 'line' },
    {
      key: 'volume',
      title: 'VOLUME: ',
      type: 'bar',
      baseValue: 0,
      styles: (data: IndicatorFigureStylesCallbackData<Vol>, indicator: Indicator, defaultStyles: IndicatorStyle) => {
        const kLineData = data.current.kLineData!;
        let color: string;
        if (kLineData.close > kLineData.open) {
          color = utils.formatValue(indicator.styles, 'bars[0].upColor', defaultStyles.bars[0].upColor) as string;
        } else if (kLineData.close < kLineData.open) {
          color = utils.formatValue(indicator.styles, 'bars[0].downColor', defaultStyles.bars[0].downColor) as string;
        } else {
          color = utils.formatValue(
            indicator.styles,
            'bars[0].noChangeColor',
            defaultStyles.bars[0].noChangeColor,
          ) as string;
        }
        return { color };
      },
    },
  ],
  regenerateFigures: (params: any[]) => {
    const figures: Array<IndicatorFigure<Vol>> = params.map((p: number, i: number) => {
      return { key: `ma${i + 1}`, title: `MA${p}: `, type: 'line' };
    });
    figures.push({
      key: 'volume',
      title: 'VOLUME: ',
      type: 'bar',
      baseValue: 0,
      styles: (data: IndicatorFigureStylesCallbackData<Vol>, indicator: Indicator, defaultStyles: IndicatorStyle) => {
        const kLineData = data.current.kLineData!;
        let color: string;
        if (kLineData.close > kLineData.open) {
          color = utils.formatValue(indicator.styles, 'bars[0].upColor', defaultStyles.bars[0].upColor) as string;
        } else if (kLineData.close < kLineData.open) {
          color = utils.formatValue(indicator.styles, 'bars[0].downColor', defaultStyles.bars[0].downColor) as string;
        } else {
          color = utils.formatValue(
            indicator.styles,
            'bars[0].noChangeColor',
            defaultStyles.bars[0].noChangeColor,
          ) as string;
        }
        return { color };
      },
    });
    return figures;
  },
  calc: (dataList: KLineData[], indicator: Indicator<Vol>) => {
    const { calcParams: params, figures } = indicator;
    const volSums: number[] = [];
    return dataList.map((kLineData: KLineData, i: number) => {
      const volume = kLineData.volume ?? 0;
      const vol: Vol = { volume };
      params.forEach((p, index) => {
        volSums[index] = (volSums[index] ?? 0) + volume;
        if (i >= p - 1) {
          vol[figures[index].key] = volSums[index] / p;
          volSums[index] -= dataList[i - (p - 1)].volume ?? 0;
        }
      });
      return vol;
    });
  },
};

export default volume;
