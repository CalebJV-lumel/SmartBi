import React, { useState } from 'react';
import { Square, Circle, Type, Minus, Upload } from 'lucide-react';
import { ENodeType } from '../../shared/types/messages';
import { ChartType } from '../../shared/types/charts';
import { ChartButton } from './charts/ChartButton';
import { ChartSelectionModal } from './charts/ChartSelectionModal';
import { ChartFactory } from '../builders/charts/ChartFactory';
import { ChartDataService } from '../services/ChartDataService';
import { usePlugin } from '../hooks/usePlugin';
import { CHART_METADATA } from '../../shared/constants/charts';

const NODE_TYPES = [
  { type: ENodeType.RECTANGLE, name: 'Rectangle', icon: Square },
  { type: ENodeType.ELLIPSE, name: 'Circle', icon: Circle },
  { type: ENodeType.TEXT, name: 'Text', icon: Type },
  { type: ENodeType.LINE, name: 'Line', icon: Minus },
];

export function InsertBar() {
  const { importSVG, createVisual, getOptimizedNewVisualDimension } = usePlugin();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCreateChart = (type: ChartType): void => {
    try {
      const dimension = getOptimizedNewVisualDimension();
      const config = ChartDataService.getDefaultConfig(type);
      config.height = dimension.height;
      config.width = dimension.width;
      const svg = ChartFactory.createChart(type, config);
      const chartName = CHART_METADATA[type].name;
      importSVG(svg, chartName, dimension);
    } catch (error) {
      console.error(`Failed to create ${type} chart:`, error);
    }
  };

  return (
    <>
      <div className="flex justify-between bg-white border-b border-gray-200">
        <div className="flex items-center gap-2 px-3 py-2">
          <div className="flex gap-1">
            {NODE_TYPES.map(({ type, name, icon: Icon }) => (
              <button
                key={type}
                className="flex items-center justify-center size-7 bg-gray-50 border border-gray-200 rounded-lg hover:bg-indigo-50 hover:border-indigo-400 transition-all text-gray-600 hover:text-indigo-600"
                onClick={() =>
                  createVisual({
                    type,
                    name: `New ${type.toLowerCase()}`,
                    width: 200,
                    height: 200,
                  })
                }
                title={name}
              >
                <Icon size={14} strokeWidth={2} />
              </button>
            ))}
          </div>
          <div className="w-px h-5 bg-gray-300"></div>
          <ChartButton onClick={() => setIsModalOpen(true)} />
        </div>
        <div className="flex items-center gap-2 px-3 py-2">
          <button
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-white rounded-lg hover:opacity-90 transition-all text-xs font-medium bg-gray-700"
            title="Insert Chart"
            disabled
          >
            <Upload size={14} strokeWidth={2.5} />
            <span>Export</span>
          </button>
        </div>
      </div>
      <ChartSelectionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSelectChart={handleCreateChart}
      />
    </>
  );
}
