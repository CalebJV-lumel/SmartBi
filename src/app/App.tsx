import React, { useState } from 'react';
import { Header } from './components/Header';
import { DashboardCreator } from './components/DashboardCreator';
import { InsertBar } from './components/InsertBar';
import { DashboardList } from './components/DashboardList';
import { VisualsList } from './components/VisualsList';
import { PropertiesPanel } from './components/PropertiesPanel';
import { useNodeStore } from './store/useNodeStore';
import { useDashboardStore } from './store/useDashboardStore';
import { usePlugin } from './hooks/usePlugin';
import { useDashboard } from './hooks/useDashboard';
import './App.css';

export function App() {
  const { nodes, selectedNodeId, selectNode } = useNodeStore();
  const { dashboards, selectedDashboardId, selectDashboard, getVisualsForDashboard } = useDashboardStore();
  const { updateNode, deleteNode, selectNode: selectPluginNode } = usePlugin();
  useDashboard();
  const [showProperties, setShowProperties] = useState(false);

  const selectedNode = nodes.find((n) => n.id === selectedNodeId);
  const visuals = selectedDashboardId ? getVisualsForDashboard(selectedDashboardId) : [];

  const handleSelectDashboard = (id: string): void => {
    selectDashboard(id);
    selectPluginNode(id);
  };

  const handleSelectVisual = (id: string): void => {
    selectNode(id);
    selectPluginNode(id);
    setShowProperties(true);
  };

  const handleCloseProperties = (): void => {
    setShowProperties(false);
    selectNode(null);
  };

  const handleUpdateProperty = (field: string, value: string | number | boolean): void => {
    if (!selectedNode) return;
    updateNode(selectedNode.id, { [field]: value });
  };

  const handleDeleteNode = (): void => {
    if (!selectedNode) return;
    if (confirm('Delete this element?')) {
      deleteNode([selectedNode.id]);
      handleCloseProperties();
    }
  };

  return (
    <div className="app">
      <Header />
      {!selectedDashboardId && <DashboardCreator />}
      {selectedDashboardId && <InsertBar />}
      <DashboardList 
        dashboards={dashboards} 
        selectedDashboardId={selectedDashboardId} 
        onSelectDashboard={handleSelectDashboard} 
      />
      {selectedDashboardId && (
        <VisualsList 
          visuals={visuals} 
          onSelectVisual={handleSelectVisual} 
        />
      )}
      {showProperties && selectedNode && (
        <PropertiesPanel
          node={selectedNode}
          onClose={handleCloseProperties}
          onUpdate={handleUpdateProperty}
          onDelete={handleDeleteNode}
        />
      )}
    </div>
  );
}
