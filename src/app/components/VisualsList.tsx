import React from 'react';
import { BarChart3 } from 'lucide-react';
import { IVisual } from '../../shared/types/dashboard';

interface IVisualsListProps {
  visuals: IVisual[];
  onSelectVisual: (id: string) => void;
}

export function VisualsList({ visuals, onSelectVisual }: IVisualsListProps) {
  return (
    <div className="nodes-section">
      <div className="section-header">
        <h3>Visuals</h3>
        <span className="count">{visuals.length}</span>
      </div>

      <div className="nodes-list">
        {visuals.length === 0 ? (
          <div className="empty-state">
            <p>No visuals yet</p>
            <span>Insert visuals into the selected dashboard</span>
          </div>
        ) : (
          visuals.map(visual => (
            <div
              key={visual.id}
              className="node-item"
              onClick={() => onSelectVisual(visual.id)}
            >
              <div className="node-content">
                <div className="flex items-center gap-2">
                  <BarChart3 size={14} />
                  <span className="node-name">{visual.name}</span>
                </div>
                <span className="node-type">{visual.type}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
