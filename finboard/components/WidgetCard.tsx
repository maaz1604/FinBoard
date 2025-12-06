/* eslint-disable @typescript-eslint/no-explicit-any */
// components/WidgetCard.tsx
"use client";
import React, { useEffect, useState, useCallback } from 'react';
import { X, RefreshCw, AlertTriangle } from 'lucide-react';
import { WidgetData } from '@/types';
import { useDashboardStore } from '@/store/useDashboardStore';
import { fetchWithCache, getNestedValue, formatValue } from '@/lib/apiClient';
import StockLineChart from './charts/StockLineChart';

interface Props {
  widget: WidgetData;
  style?: React.CSSProperties;
  className?: string;
  onMouseDown?: React.MouseEventHandler;
  onMouseUp?: React.MouseEventHandler;
  onTouchEnd?: React.TouchEventHandler;
  children?: React.ReactNode;
}

const WidgetCard = React.forwardRef<HTMLDivElement, Props>(({ widget, style, className, children, ...props }, ref) => {
  const removeWidget = useDashboardStore((state) => state.removeWidget);
  
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  // eslint-disable-next-line react-hooks/preserve-manual-memoization
  const fetchData = useCallback(async () => {
    // SAFETY CHECK 1: If it's a chart, don't fetch (it handles its own data)
    if (widget.type === 'CHART') return; 

    // SAFETY CHECK 2: If there is no URL, don't try to fetch (Fixes the 404 error)
    if (!widget.apiUrl) {
      setError(true);
      return;
    }

    try {
      const fullResponse = await fetchWithCache(widget.apiUrl);
      const extractedData = getNestedValue(fullResponse, widget.dataKey);
      
      if (extractedData !== undefined) {
        setData(extractedData);
        setError(false);
        setLastUpdated(new Date());
      } else {
        console.warn(`Data key "${widget.dataKey}" not found in response.`);
        setError(true);
      }
    } catch (err) {
      console.error("Widget Fetch Error:", err);
      setError(true);
    }
  }, [widget.type, widget.apiUrl, widget.dataKey]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchData();
    // Only set interval if we actually have a URL
    if (widget.apiUrl) {
        const timer = setInterval(fetchData, widget.refreshInterval || 30000);
        return () => clearInterval(timer);
    }
  }, [fetchData, widget.apiUrl, widget.refreshInterval]);

  return (
    <div
      ref={ref}
      style={style}
      className={`${className} flex flex-col bg-white dark:bg-gray-800 rounded-xl shadow border border-gray-200 dark:border-gray-700 overflow-hidden`}
      {...props}
    >
      <div className="flex justify-between items-center p-3 border-b dark:border-gray-700 bg-gray-50 dark:bg-gray-900 cursor-move shrink-0">
        <h3 className="font-semibold text-gray-700 dark:text-gray-200 text-xs uppercase tracking-wider truncate max-w-[120px]">
          {widget.title}
        </h3>
        <button
          onMouseDown={(e) => e.stopPropagation()} 
          onClick={(e) => { e.stopPropagation(); removeWidget(widget.id); }}
          className="text-gray-400 hover:text-red-500 transition-colors"
        >
          <X size={16} />
        </button>
      </div>

      <div className="flex-1 relative overflow-auto p-4 min-h-0 scrollbar-thin">
        {/* Error State */}
        {error && (
          <div className="flex flex-col items-center justify-center h-full text-red-400 text-center p-2">
            <AlertTriangle size={24} className="mb-2" />
            <span className="text-xs">
              {!widget.apiUrl ? "Missing API URL" : "Data Unavailable"}
            </span>
          </div>
        )}

        {/* Loading State */}
        {!data && !error && widget.type !== 'CHART' && (
          <div className="flex items-center justify-center h-full text-gray-400">
             <RefreshCw className="animate-spin" size={20}/>
          </div>
        )}

        {/* Chart State */}
        {widget.type === 'CHART' && (
          <div className="w-full h-full min-h-[200px]">
            <StockLineChart symbol={widget.symbol || 'BTC'} />
          </div>
        )}

        {/* Card State */}
        {widget.type === 'CARD' && data && (
          <div className="flex flex-col items-center justify-center h-full animate-in fade-in zoom-in duration-300">
            <span className="text-2xl font-bold text-gray-900 dark:text-white break-all text-center">
              {formatValue(data, widget.format)}
            </span>
            {widget.description && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center px-2">
                {widget.description}
              </p>
            )}
          </div>
        )}

        {/* Table State */}
        {widget.type === 'TABLE' && data && (
          <div className="w-full h-full overflow-auto">
            {Array.isArray(data) ? (
              data.length > 0 ? (
                <table className="w-full text-left text-xs">
                  <thead className="bg-gray-50 dark:bg-gray-700 sticky top-0">
                    <tr>
                      {Object.keys(data[0] || {}).map(key => (
                        <th key={key} className="p-2 capitalize text-gray-500 dark:text-gray-300 font-medium whitespace-nowrap">{key}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {data.map((row: any, i: number) => (
                      <tr key={i} className="border-b dark:border-gray-700 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                        {Object.values(row).map((val: any, j: number) => (
                          <td key={j} className="p-2 text-gray-600 dark:text-gray-300 whitespace-nowrap">
                            {typeof val === 'object' && val !== null ? JSON.stringify(val).slice(0, 50) : String(val)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400 text-xs">
                  Empty array - no data to display
                </div>
              )
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400 text-xs">
                Selected data is not an array. Please select an array field for table view.
              </div>
            )}
          </div>
        )}
      </div>

      <div className="bg-gray-50 dark:bg-gray-900 p-2 text-[10px] text-gray-400 flex justify-between border-t dark:border-gray-700">
         <span className="truncate max-w-[100px]">{widget.dataKey || 'Static'}</span>
         <span>{lastUpdated.toLocaleTimeString()}</span>
      </div>

      {children}
    </div>
  );
});

WidgetCard.displayName = "WidgetCard";
export default WidgetCard;