import React from 'react';
import { BarChart3 } from 'lucide-react';

interface ChartButtonProps {
  onClick: () => void;
}

export const ChartButton: React.FC<ChartButtonProps> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1.5 px-2.5 py-1.5 text-white rounded-lg hover:opacity-90 transition-all text-xs font-medium"
      style={{ background: 'linear-gradient(to right, #667eea, #764ba2)' }}
      title="Insert Chart"
    >
      <BarChart3 size={14} strokeWidth={2.5} />
      <span>Chart</span>
    </button>
  );
};
