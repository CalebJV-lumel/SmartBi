import React from 'react';
import { Layout, ChevronRight } from 'lucide-react';
import { IDashboardFrame } from '../../shared/types/dashboard';

interface IDashboardListProps {
  dashboards: IDashboardFrame[];
  selectedDashboardId: string | null;
  onSelectDashboard: (id: string) => void;
}

export function DashboardList({ dashboards, selectedDashboardId, onSelectDashboard }: IDashboardListProps) {
  return (
    <div className="nodes-section">
      <div className="section-header">
        <h3>Dashboards</h3>
        <span className="count">{dashboards.length}</span>
      </div>

      <div className="nodes-list">
        {dashboards.length === 0 ? (
          <div className="empty-state">
            <p>No dashboards yet</p>
            <span>Create a dashboard frame to get started</span>
          </div>
        ) : (
          dashboards.map(dashboard => (
            <div
              key={dashboard.id}
              className={`node-item ${selectedDashboardId === dashboard.id ? 'active' : ''}`}
              onClick={() => onSelectDashboard(dashboard.id)}
            >
              <div className="node-content">
                <div className="flex items-center gap-2">
                  <Layout size={14} />
                  <span className="node-name">{dashboard.name}</span>
                </div>
                <span className="node-type">{dashboard.width}×{dashboard.height}</span>
              </div>
              <ChevronRight size={16} className="node-arrow" />
            </div>
          ))
        )}
      </div>
    </div>
  );
}
