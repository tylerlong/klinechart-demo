import type { IStockFinancialResults } from '@polygon.io/client-js';
import { Descriptions } from 'antd';
import type { DescriptionsItemType } from 'antd/es/descriptions';
import React from 'react';
import { formatNumber } from './utils';

export const financial = (r: IStockFinancialResults) => {
  const results: React.JSX.Element[] = [];
  const balanceSheet = r.results?.[0].financials.balance_sheet;
  if (balanceSheet) {
    const items: DescriptionsItemType[] = [];
    if (balanceSheet.assets) {
      items.push({
        label: balanceSheet.assets.label,
        key: balanceSheet.assets.label,
        children: `${formatNumber(balanceSheet.assets.value)} ${balanceSheet.assets.unit}`,
      });
    }
    if (balanceSheet.current_assets) {
      items.push({
        label: balanceSheet.current_assets.label,
        key: balanceSheet.current_assets.label,
        children: `${formatNumber(balanceSheet.current_assets.value)} ${balanceSheet.current_assets.unit}`,
      });
    }
    if (balanceSheet.current_liabilities) {
      items.push({
        label: balanceSheet.current_liabilities.label,
        key: balanceSheet.current_liabilities.label,
        children: `${formatNumber(balanceSheet.current_liabilities.value)} ${balanceSheet.current_liabilities.unit}`,
      });
    }
    if (balanceSheet.equity) {
      items.push({
        label: balanceSheet.equity.label,
        key: balanceSheet.equity.label,
        children: `${formatNumber(balanceSheet.equity.value)} ${balanceSheet.equity.unit}`,
      });
    }
    results.push(<Descriptions key="balance_sheet" title="Blance Sheet" items={items} />);
  }
  return results;
};
