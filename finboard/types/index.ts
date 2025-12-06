export type WidgetType = 'CHART' | 'CARD' | 'TABLE';

export type FormatType = 'none' | 'currency' | 'percentage' | 'decimal' | 'integer';

export interface WidgetData {
  symbol: string;
  id: string;
  type: WidgetType;
  title: string;
  description?: string; // User-defined widget description
  
  // New Dynamic API Fields
  apiUrl: string;
  dataKey: string; // The path to the value (e.g., "bitcoin.usd")
  refreshInterval: number; // In milliseconds
  format?: FormatType; // Custom formatting (currency, percentage, etc.)
  
  // Layout
  x: number;
  y: number;
  w: number;
  h: number;
}