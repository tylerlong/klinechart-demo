import type { IStockFinancialResults } from '@polygon.io/client-js';
import { Descriptions } from 'antd';
import React from 'react';
import { capitalCase } from 'change-case';

import { formatNumber } from './utils';

interface Item {
  order: number;
  label: string;
  unit: string;
  value: number;
}

export const financial = (r: IStockFinancialResults) => {
  const sections = ['income_statement', 'balance_sheet', 'cash_flow_statement', 'comprehensive_income'];
  return sections.map((section) => {
    const items = Object.values<Item>(r.results?.[0].financials[section])
      .sort((a, b) => a.order - b.order)
      .map(({ label, value, unit }) => ({
        label,
        key: label,
        children: `${formatNumber(value)} ${unit}`,
      }));
    return <Descriptions column={2} key={section} title={capitalCase(section)} items={items} />;
  });
};
