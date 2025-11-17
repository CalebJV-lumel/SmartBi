import React from 'react';
import { X } from 'lucide-react';
import { ChartType, ChartCategory } from '../../../shared/types/charts';
import { CHART_METADATA, CHART_CATEGORIES } from '../../../shared/constants/charts';
import { ChartIcon } from './ChartIcon';

interface ChartSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectChart: (type: ChartType) => void;
}

export const ChartSelectionModal: React.FC<ChartSelectionModalProps> = ({
  isOpen,
  onClose,
  onSelectChart,
}) => {
  if (!isOpen) return null;

  const handleSelect = (type: ChartType) => {
    onSelectChart(type);
    onClose();
  };

  const getChartsByCategory = (category: ChartCategory) => {
    return Object.values(CHART_METADATA).filter((chart) => chart.category === category);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      style={{ backdropFilter: 'blur(4px)' }}
      onClick={onClose}
    >
      <div
        className="relative w-[90%] max-w-md max-h-[80vh] bg-white rounded-2xl shadow-2xl overflow-hidden animate-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="sticky top-0 z-10 flex items-center justify-between px-4 py-3 text-white"
          style={{ background: 'linear-gradient(to right, #667eea, #764ba2)' }}
        >
          <h2 className="text-sm font-bold">Select Chart</h2>
          <button onClick={onClose} className="p-1 rounded-lg transition-all hover:bg-white/20">
            <X size={16} strokeWidth={2.5} />
          </button>
        </div>

        <div className="overflow-y-auto max-h-[calc(80vh-48px)] p-3 bg-gray-50">
          {CHART_CATEGORIES.map(({ key, label }) => {
            const charts = getChartsByCategory(key);
            if (charts.length === 0) return null;

            return (
              <div key={key} className="mb-4 last:mb-0">
                <h3 className="text-xs font-bold text-gray-600 uppercase tracking-wide mb-2 px-1">
                  {label}
                </h3>
                <div className="grid grid-cols-3 gap-2">
                  {charts.map((chart) => (
                    <button
                      key={chart.type}
                      onClick={() => handleSelect(chart.type)}
                      className="group flex flex-col items-center p-3 bg-white border border-gray-200 rounded-xl hover:border-indigo-500 hover:shadow-md transition-all"
                    >
                      <div
                        className="flex items-center justify-center size-10 mb-2 rounded-lg transition-all group-hover:scale-110"
                        style={{ background: 'linear-gradient(to bottom right, #e0e7ff, #f3e8ff)' }}
                      >
                        <ChartIcon icon={chart.icon} className="size-5 text-indigo-600" />
                      </div>
                      <h4 className="text-xs font-medium text-gray-900 text-center">
                        {chart.name}
                      </h4>
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
