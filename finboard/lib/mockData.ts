interface StockDataPoint {
  date: string;
  value: number;
}

 // Simulates fetching history data
export const generateMockHistory = (symbol: string): StockDataPoint[] => {
  const data: StockDataPoint[] = [];
  let basePrice = symbol === 'BTC' ? 40000 : 150;
  
  for (let i = 30; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    // Random fluctuation
    basePrice = basePrice + (Math.random() - 0.5) * (basePrice * 0.05);
    data.push({
      date: date.toLocaleDateString(),
      value: parseFloat(basePrice.toFixed(2)),
    });
  }
  return data;
};