/* eslint-disable @typescript-eslint/no-explicit-any */
// lib/apiClient.ts

import { FormatType } from '@/types';

interface CacheItem {
  data: any;
  timestamp: number;
}

const apiCache = new Map<string, CacheItem>();

export const getNestedValue = (obj: any, path: string) => {
  if (!path || !obj) return undefined;
  if (path === '(Whole List)') return obj;
  return path.split('.').reduce((acc, part) => acc && acc[part], obj);
};

export const flattenObjectKeys = (obj: any, prefix = ''): string[] => {
  if (!obj) return [];
  if (Array.isArray(obj)) return ['(Whole List)'];

  return Object.keys(obj).reduce((acc: string[], key: string) => {
    const pre = prefix.length ? prefix + '.' : '';
    if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
      acc.push(...flattenObjectKeys(obj[key], pre + key));
    } else {
      acc.push(pre + key);
    }
    return acc;
  }, []);
};

export const fetchWithCache = async (url: string, cacheDuration = 60000) => {
  // Guard clause against empty URLs
  if (!url) throw new Error("URL is empty");

  const now = Date.now();
  const cached = apiCache.get(url);

  if (cached && (now - cached.timestamp < cacheDuration)) {
    return cached.data;
  }

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`API Error: ${res.status} ${res.statusText}`);
  }
  
  const data = await res.json();
  apiCache.set(url, { data, timestamp: now });
  return data;
};

export const formatValue = (value: any, format?: FormatType): string => {
  if (value === null || value === undefined) return 'N/A';
  
  const numValue = typeof value === 'number' ? value : parseFloat(value);
  
  if (isNaN(numValue)) {
    return String(value);
  }
  
  switch (format) {
    case 'currency':
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(numValue);
    
    case 'percentage':
      return `${(numValue * 100).toFixed(2)}%`;
    
    case 'decimal':
      return numValue.toFixed(2);
    
    case 'integer':
      return Math.round(numValue).toLocaleString();
    
    case 'none':
    default:
      return typeof value === 'number' ? numValue.toLocaleString() : String(value);
  }
};

// Clear cache for a specific URL or all cache
export const clearCache = (url?: string) => {
  if (url) {
    apiCache.delete(url);
  } else {
    apiCache.clear();
  }
};