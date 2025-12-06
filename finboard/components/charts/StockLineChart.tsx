"use client";
import React, { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { generateMockHistory } from '@/lib/mockData';

type StockDataPoint = {
  date: string;
  value: number;
};

interface Props {
  symbol: string;
}

const StockLineChart = ({ symbol }: Props) => {
  const data = useMemo<StockDataPoint[]>(() => {
    // In a real app, fetch from API here using symbol
    return generateMockHistory(symbol);
  }, [symbol]);

  return (
    <div className="w-full h-full">
      <ResponsiveContainer width="100%" height="100%" minHeight={200}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
          <XAxis dataKey="date" hide />
          <YAxis domain={['auto', 'auto']} hide />
          <Tooltip 
            contentStyle={{ backgroundColor: '#1f2937', border: 'none', color: '#fff' }}
            itemStyle={{ color: '#4ade80' }}
          />
          <Line 
            type="monotone" 
            dataKey="value" 
            stroke="#2563eb" 
            strokeWidth={2} 
            dot={false} 
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default StockLineChart;