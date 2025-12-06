/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState } from 'react';
import { useDashboardStore } from '@/store/useDashboardStore';
import { fetchWithCache, flattenObjectKeys, getNestedValue } from '@/lib/apiClient';
import { X, RefreshCw, Table, CreditCard, BarChart3, Plus, Trash2 } from 'lucide-react';
import { FormatType, WidgetType } from '@/types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const AddWidgetModal = ({ isOpen, onClose }: Props) => {
  const addWidget = useDashboardStore((state) => state.addWidget);
  
  // State
  const [apiUrl, setApiUrl] = useState('https://api.coinbase.com/v2/prices/BTC-USD/spot');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [refreshInterval, setRefreshInterval] = useState(30);
  const [format, setFormat] = useState<FormatType>('none');
  
  // API Exploration State
  const [isFetching, setIsFetching] = useState(false);
  const [apiData, setApiData] = useState<any>(null);
  const [availablePaths, setAvailablePaths] = useState<string[]>([]);
  const [selectedFields, setSelectedFields] = useState<Array<{path: string, alias: string}>>([]);
  const [displayMode, setDisplayMode] = useState<WidgetType>('CARD');
  const [searchQuery, setSearchQuery] = useState('');
  const [showArraysOnly, setShowArraysOnly] = useState(false);

  if (!isOpen) return null;

  // 1. FETCH THE URL
  const handleFetch = async () => {
    setIsFetching(true);
    setApiData(null);
    setAvailablePaths([]);
    try {
      const data = await fetchWithCache(apiUrl);
      setApiData(data);
      setAvailablePaths(flattenObjectKeys(data));
    } catch (error: any) {
      alert(`Failed to fetch API: ${error.message}`);
    } finally {
      setIsFetching(false);
    }
  };

  // 2. SELECT AN OPTION
  const handleAddField = (path: string) => {
    if (selectedFields.find(f => f.path === path)) return;
    
    const val = getNestedValue(apiData, path);
    setSelectedFields([...selectedFields, { path, alias: path.split('.').pop() || path }]);
    
    // Auto-detect display mode based on first selection
    if (selectedFields.length === 0) {
      if (Array.isArray(val)) {
        setDisplayMode('TABLE');
      } else {
        setDisplayMode('CARD');
      }
    }
  };

  const handleRemoveField = (path: string) => {
    setSelectedFields(selectedFields.filter(f => f.path !== path));
  };

  const handleAliasChange = (path: string, newAlias: string) => {
    setSelectedFields(selectedFields.map(f => 
      f.path === path ? { ...f, alias: newAlias } : f
    ));
  };

  const filteredPaths = availablePaths.filter(path => {
    const matchesSearch = path.toLowerCase().includes(searchQuery.toLowerCase());
    if (!showArraysOnly) return matchesSearch;
    
    const val = getNestedValue(apiData, path);
    return matchesSearch && Array.isArray(val);
  });

  const handleSubmit = () => {
    if (selectedFields.length === 0) return;
    
    const primaryField = selectedFields[0];
    addWidget({
      title: title || 'New Widget',
      description: description || undefined,
      type: displayMode,
      apiUrl,
      dataKey: primaryField.path,
      symbol: title || primaryField.path || '',
      refreshInterval: refreshInterval * 1000,
      format: format,
      x: 0, y: 0, w: displayMode === 'TABLE' ? 6 : 4, h: 4,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-gray-900 w-full max-w-4xl rounded-xl shadow-2xl flex flex-col h-[90vh]">
        
        {/* Header */}
        <div className="p-4 border-b dark:border-gray-800 flex justify-between items-center shrink-0">
          <h2 className="font-bold text-lg">Add Dynamic Widget</h2>
          <button onClick={onClose}><X size={20} /></button>
        </div>

        <div className="p-6 space-y-4 overflow-y-auto flex-1">
          {/* 1. URL Input */}
          <div className="flex gap-2">
            <input 
              value={apiUrl} 
              onChange={(e) => setApiUrl(e.target.value)}
              className="flex-1 p-2 border rounded dark:bg-gray-800 dark:border-gray-700 font-mono text-sm"
              placeholder="Paste API URL here..."
            />
            <button 
              onClick={handleFetch}
              className="bg-blue-600 text-white px-4 rounded hover:bg-blue-700 flex items-center gap-2"
              disabled={isFetching}
            >
              {isFetching ? <RefreshCw className="animate-spin" size={16}/> : 'Fetch'}
            </button>
          </div>

          {/* Display Mode Selection */}
          {apiData && (
            <>
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Display Mode</label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setDisplayMode('CARD')}
                    className={`flex items-center gap-2 px-4 py-2 rounded border transition-colors ${
                      displayMode === 'CARD'
                        ? 'bg-green-600 text-white border-green-600'
                        : 'bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700'
                    }`}
                  >
                    <CreditCard size={16} />
                    Card
                  </button>
                  <button
                    onClick={() => setDisplayMode('TABLE')}
                    className={`flex items-center gap-2 px-4 py-2 rounded border transition-colors ${
                      displayMode === 'TABLE'
                        ? 'bg-green-600 text-white border-green-600'
                        : 'bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700'
                    }`}
                  >
                    <Table size={16} />
                    Table
                  </button>
                  <button
                    onClick={() => setDisplayMode('CHART')}
                    className={`flex items-center gap-2 px-4 py-2 rounded border transition-colors ${
                      displayMode === 'CHART'
                        ? 'bg-green-600 text-white border-green-600'
                        : 'bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700'
                    }`}
                  >
                    <BarChart3 size={16} />
                    Chart
                  </button>
                </div>
              </div>

              {/* Field Selection Section */}
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Select Fields to Display</label>
                
                {/* Search Fields */}
                <div className="mb-3">
                  <input
                    type="text"
                    placeholder="Search for fields..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-700 text-sm"
                  />
                  <label className="flex items-center gap-2 mt-2 text-xs text-gray-600 dark:text-gray-400">
                    <input
                      type="checkbox"
                      checked={showArraysOnly}
                      onChange={(e) => setShowArraysOnly(e.target.checked)}
                      className="rounded"
                    />
                    Show arrays only (for table view)
                  </label>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Available Fields */}
                  <div className="border rounded dark:border-gray-700 flex flex-col h-64">
                    <div className="p-2 bg-gray-50 dark:bg-gray-800 border-b dark:border-gray-700 text-xs font-bold uppercase text-gray-500 shrink-0">
                      Available Fields
                    </div>
                    <div className="overflow-y-auto p-2 space-y-1 flex-1">
                      {filteredPaths.map(path => (
                        <button
                          key={path}
                          onClick={() => handleAddField(path)}
                          disabled={selectedFields.find(f => f.path === path) !== undefined}
                          className={`w-full text-left px-2 py-1 text-xs font-mono rounded truncate flex items-center justify-between group ${
                            selectedFields.find(f => f.path === path)
                              ? 'bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed'
                              : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                          }`}
                        >
                          <span className="truncate">{path}</span>
                          {!selectedFields.find(f => f.path === path) && (
                            <Plus size={14} className="shrink-0 opacity-0 group-hover:opacity-100 text-green-600" />
                          )}
                        </button>
                      ))}
                      {filteredPaths.length === 0 && (
                        <div className="text-xs text-gray-400 text-center py-4">No fields found</div>
                      )}
                    </div>
                  </div>

                  {/* Selected Fields */}
                  <div className="border rounded dark:border-gray-700 flex flex-col h-64">
                    <div className="p-2 bg-gray-50 dark:bg-gray-800 border-b dark:border-gray-700 text-xs font-bold uppercase text-gray-500 shrink-0">
                      Selected Fields
                    </div>
                    <div className="overflow-y-auto p-2 space-y-2 flex-1">
                      {selectedFields.map(field => (
                        <div key={field.path} className="bg-gray-50 dark:bg-gray-800 rounded p-2 space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-mono text-gray-500 dark:text-gray-400 truncate flex-1">
                              {field.path}
                            </span>
                            <button
                              onClick={() => handleRemoveField(field.path)}
                              className="text-red-500 hover:text-red-700 shrink-0 ml-2"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                          <input
                            type="text"
                            value={field.alias}
                            onChange={(e) => handleAliasChange(field.path, e.target.value)}
                            placeholder="Field alias"
                            className="w-full px-2 py-1 text-xs border rounded dark:bg-gray-900 dark:border-gray-700"
                          />
                        </div>
                      ))}
                      {selectedFields.length === 0 && (
                        <div className="text-xs text-gray-400 text-center py-4">No fields selected</div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* 3. Settings */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase">Widget Title</label>
              <input 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-2 border rounded mt-1 dark:bg-gray-800 dark:border-gray-700"
                placeholder="e.g. BTC Price"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase">Refresh (Seconds)</label>
              <input 
                type="number"
                min="5"
                value={refreshInterval}
                onChange={(e) => setRefreshInterval(Number(e.target.value))}
                className="w-full p-2 border rounded mt-1 dark:bg-gray-800 dark:border-gray-700"
              />
            </div>
          </div>

          {/* Description Field */}
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase">Description (Optional)</label>
            <textarea 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2 border rounded mt-1 dark:bg-gray-800 dark:border-gray-700 resize-none"
              placeholder="Add a description for this widget..."
              rows={2}
            />
          </div>

          {/* Format Selection (Only for CARD type) */}
          {displayMode === 'CARD' && (
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase">Data Format</label>
              <select 
                value={format}
                onChange={(e) => setFormat(e.target.value as FormatType)}
                className="w-full p-2 border rounded mt-1 dark:bg-gray-800 dark:border-gray-700"
              >
                <option value="none">None (Raw)</option>
                <option value="currency">Currency ($)</option>
                <option value="percentage">Percentage (%)</option>
                <option value="decimal">Decimal (2 places)</option>
                <option value="integer">Integer</option>
              </select>
            </div>
          )}
        </div>

        <div className="p-4 border-t dark:border-gray-800 bg-gray-50 dark:bg-gray-900 flex justify-between shrink-0">
          <button 
            onClick={onClose}
            className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded font-medium"
          >
            Cancel
          </button>
          <button 
            onClick={handleSubmit}
            disabled={selectedFields.length === 0}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Add Widget
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddWidgetModal;