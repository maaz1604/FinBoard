// components/DashboardGrid.tsx
"use client";
import React, { useEffect, useState } from 'react';
import GridLayout, { WidthProvider } from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import { useDashboardStore } from '@/store/useDashboardStore';
import WidgetCard from './WidgetCard';

const ResponsiveGridLayout = WidthProvider(GridLayout);

const DashboardGrid = () => {
  const { widgets, updateLayout } = useDashboardStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const layout = widgets.map((w) => ({
    i: w.id,
    x: w.x,
    y: w.y,
    w: w.w,
    h: w.h,
  }));

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleLayoutChange = (newLayout: any[]) => {
    updateLayout(newLayout);
  };

  return (
    <div className="w-full min-h-screen p-4 pb-20">
      {widgets.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-[50vh] text-gray-400 border-2 border-dashed border-gray-300 rounded-xl">
          <p className="mb-2 text-lg">Your dashboard is empty</p>
          <p className="text-sm">Click &quot;Add Widget&quot; to get started</p>
        </div>
      ) : (
        <ResponsiveGridLayout
          className="layout"
          layout={layout}
          cols={12}
          rowHeight={60}
          width={1200}
          onLayoutChange={handleLayoutChange}
          draggableHandle=".cursor-move"
          resizeHandles={['se']} // Only bottom-right resize
        >
          {widgets.map((widget) => (
            // REMOVE WRAPPER DIV - Pass WidgetCard directly
            <WidgetCard key={widget.id} widget={widget} />
          ))}
        </ResponsiveGridLayout>
      )}
    </div>
  );
};

export default DashboardGrid;