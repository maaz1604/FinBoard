"use client";
import React, { useState } from 'react';
import DashboardGrid from '@/components/DashboardGrid';
import AddWidgetModal from '@/components/AddWidgetModal';
import { PlusCircle, LayoutDashboard } from 'lucide-react';

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100">
      
      {/* Navbar */}
      <nav className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <LayoutDashboard className="text-blue-600" />
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-500">
              FinBoard
            </span>
          </div>
          
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all shadow-lg shadow-blue-600/20"
          >
            <PlusCircle size={18} />
            Add Widget
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-[1400px] mx-auto">
        <DashboardGrid />
      </div>

      <AddWidgetModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </main>
  );
}