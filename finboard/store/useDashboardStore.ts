// store/useDashboardStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { WidgetData } from '@/types';

interface DashboardState {
  widgets: WidgetData[];
  isEditMode: boolean;
  addWidget: (widget: Omit<WidgetData, 'id'>) => void;
  removeWidget: (id: string) => void;
  updateWidget: (id: string, updates: Partial<WidgetData>) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  updateLayout: (layout: any[]) => void;
  toggleEditMode: () => void;
}

export const useDashboardStore = create<DashboardState>()(
  persist(
    (set) => ({
      widgets: [], // Start empty or add default widgets here
      isEditMode: true, // Allow dragging by default

      addWidget: (newWidget) =>
        set((state) => ({
          widgets: [
            ...state.widgets,
            { 
              ...newWidget, 
              id: crypto.randomUUID(),
              // Auto-arrange in rows: calculate next position
              x: (state.widgets.length * (newWidget.w || 4)) % 12,
              y: Math.floor((state.widgets.length * (newWidget.w || 4)) / 12) * (newWidget.h || 4),
            },
          ],
        })),

      removeWidget: (id) =>
        set((state) => ({
          widgets: state.widgets.filter((w) => w.id !== id),
        })),

      updateWidget: (id, updates) =>
        set((state) => ({
          widgets: state.widgets.map((w) => 
            w.id === id ? { ...w, ...updates } : w
          ),
        })),

      updateLayout: (layout) =>
        set((state) => ({
          widgets: state.widgets.map((widget) => {
            const layoutItem = layout.find((l) => l.i === widget.id);
            if (layoutItem) {
              return {
                ...widget,
                x: layoutItem.x,
                y: layoutItem.y,
                w: layoutItem.w,
                h: layoutItem.h,
              };
            }
            return widget;
          }),
        })),

      toggleEditMode: () => set((state) => ({ isEditMode: !state.isEditMode })),
    }),
    {
      name: 'finboard-storage', // Key for localStorage
    }
  )
);