import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { DEFAULT_DASHBOARD_CONFIG } from '../../shared/types/dashboard';
import { ENodeType } from '../../shared/types/messages';
import { usePlugin } from '../hooks/usePlugin';

export function DashboardCreator() {
  const { createNode } = usePlugin();
  const [width, setWidth] = useState(DEFAULT_DASHBOARD_CONFIG.width);
  const [height, setHeight] = useState(DEFAULT_DASHBOARD_CONFIG.height);

  const handleCreate = () => {
    createNode({
      type: ENodeType.FRAME,
      name: `Dashboard ${width}x${height}`,
      width,
      height,
      fills: [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }],
      clipsContent: false
    });
  };

  return (
    <div className="p-3 bg-white border-b border-gray-200">
      <div className="flex items-center gap-2">
        <input
          type="number"
          value={width}
          onChange={(e) => setWidth(Number(e.target.value))}
          placeholder="Width"
          className="w-20 px-2 py-1 text-sm border border-gray-300 rounded"
        />
        <span className="text-gray-400">×</span>
        <input
          type="number"
          value={height}
          onChange={(e) => setHeight(Number(e.target.value))}
          placeholder="Height"
          className="w-20 px-2 py-1 text-sm border border-gray-300 rounded"
        />
        <button
          onClick={handleCreate}
          className="flex items-center gap-1 px-3 py-1 text-sm bg-indigo-600 text-white rounded hover:bg-indigo-700"
        >
          <Plus size={14} />
          Dashboard
        </button>
      </div>
    </div>
  );
}
