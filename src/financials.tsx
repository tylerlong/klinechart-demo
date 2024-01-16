import type { IStockFinancialResults } from '@polygon.io/client-js';
import { Descriptions } from 'antd';
import React from 'react';
import { formatNumber } from './utils';

export const financial = (r: IStockFinancialResults) => {
  const results: React.JSX.Element[] = [];
  const balance_sheet = r.results?.[0].financials.balance_sheet;
  if (balance_sheet) {
    const items = Object.values(balance_sheet)
      .sort((a, b) => a.order - b.order)
      .map(({ label, value, unit }) => ({
        label,
        key: label,
        children: `${formatNumber(value)} ${unit}`,
      }));
    results.push(<Descriptions key="balance_sheet" title="Blance Sheet" items={items} />);
  }
  const cash_flow_statement = r.results?.[0].financials.cash_flow_statement;
  if (cash_flow_statement) {
    const items = Object.values(cash_flow_statement)
      .sort((a, b) => a.order - b.order)
      .map(({ label, value, unit }) => ({
        label,
        key: label,
        children: `${formatNumber(value)} ${unit}`,
      }));
    results.push(<Descriptions key="cash_flow_statement" title="Cash Flow Statement" items={items} />);
  }
  return results;
};
