/**
 * Main Application - Professional Dashboard Creator
 * Enterprise-grade React application with full CRUD operations
 * Uses professional services for type-safe visual management
 */

import React, { useState, useEffect, useCallback } from 'react';
import { EVisualNodeType } from '../plugin/handlers/MessageHandler';

// ============================================================================
// PROFESSIONAL TYPE DEFINITIONS
// ============================================================================

interface IVisualElement {
  id: string;
  type: EVisualNodeType;
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  visible: boolean;
  locked: boolean;
  selected: boolean;
}

interface ICreateVisualRequest {
  visualType: EVisualNodeType;
  name?: string;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  text?: string;
  styling?: {
    color?: { r: number; g: number; b: number };
  };
}

interface IUpdateVisualRequest {
  visualId: string;
  updates: {
    name?: string;
    x?: number;
    y?: number;
    visible?: boolean;
    locked?: boolean;
  };
}

interface IPluginMessage {
  type: string;
  success: boolean;
  message: string;
  data?: Record<string, unknown>;
}

// ============================================================================
// VISUAL LIBRARY COMPONENT
// ============================================================================

type TVisualType = EVisualNodeType | string;

interface IVisualLibraryProps {
  onCreateVisual: (visualType: TVisualType) => void;
  selectedType?: TVisualType | null;
}

const VisualLibrary: React.FC<IVisualLibraryProps> = ({ onCreateVisual, selectedType }) => {
  const visualTypes: Array<{ type: TVisualType; name: string; icon: string; category: string }> = [
    // Dashboard Visuals
    { type: 'line', name: 'Line Chart', icon: '📈', category: 'Charts' },
    { type: 'bar', name: 'Bar Chart', icon: '📊', category: 'Charts' },
    { type: 'pie', name: 'Pie Chart', icon: '🥧', category: 'Charts' },
    { type: 'table', name: 'Data Table', icon: '📋', category: 'Data' },
    { type: 'kpi', name: 'KPI Card', icon: '🎯', category: 'Metrics' },
    { type: 'gauge', name: 'Gauge Chart', icon: '⏲️', category: 'Metrics' },
    
    // Basic Figma Elements
    { type: EVisualNodeType.RECTANGLE, name: 'Rectangle', icon: '⬜', category: 'Basic Shapes' },
    { type: EVisualNodeType.ELLIPSE, name: 'Ellipse', icon: '⭕', category: 'Basic Shapes' },
    { type: EVisualNodeType.TEXT, name: 'Text', icon: '📝', category: 'Typography' },
    { type: EVisualNodeType.FRAME, name: 'Frame', icon: '🖼️', category: 'Layout' },
    { type: EVisualNodeType.COMPONENT, name: 'Component', icon: '🧩', category: 'Advanced' }
  ];

  return (
    <div className="visual-library">
      <h3>Visual Library</h3>
      <div className="visual-grid">
        {visualTypes.map((visual) => (
          <div
            key={visual.type}
            className={`visual-card ${selectedType === visual.type ? 'selected' : ''}`}
            onClick={() => onCreateVisual(visual.type)}
            title={`Create ${visual.name}`}
          >
            <div className="visual-icon">{visual.icon}</div>
            <div className="visual-name">{visual.name}</div>
            <div className="visual-category">{visual.category}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ============================================================================
// VISUAL MANAGER COMPONENT
// ============================================================================

interface IVisualManagerProps {
  visuals: IVisualElement[];
  onSelectVisual: (visualId: string) => void;
  onUpdateVisual: (visualId: string, updates: Partial<IVisualElement>) => void;
  onDeleteVisual: (visualId: string) => void;
  onDuplicateVisual: (visualId: string) => void;
  selectedVisualId?: string | null;
}

const VisualManager: React.FC<IVisualManagerProps> = ({
  visuals,
  onSelectVisual,
  onUpdateVisual,
  onDeleteVisual,
  onDuplicateVisual,
  selectedVisualId
}) => {
  return (
    <div className="visual-manager">
      <h3>Visual Elements ({visuals.length})</h3>
      <div className="visual-list">
        {visuals.length === 0 ? (
          <div className="empty-state">
            <p>No visuals created yet. Use the Visual Library to create elements.</p>
          </div>
        ) : (
          visuals.map((visual) => (
            <div
              key={visual.id}
              className={`visual-item ${selectedVisualId === visual.id ? 'selected' : ''}`}
              onClick={() => onSelectVisual(visual.id)}
            >
              <div className="visual-info">
                <div className="visual-header">
                  <span className="visual-type">{visual.type}</span>
                  <span className="visual-name">{visual.name}</span>
                </div>
                <div className="visual-details">
                  <span>Position: ({visual.x}, {visual.y})</span>
                  <span>Size: {visual.width} × {visual.height}</span>
                </div>
              </div>
              <div className="visual-actions">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onUpdateVisual(visual.id, { visible: !visual.visible });
                  }}
                  className={`action-btn ${visual.visible ? 'visible' : 'hidden'}`}
                  title={visual.visible ? 'Hide' : 'Show'}
                >
                  {visual.visible ? '👁️' : '🙈'}
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onUpdateVisual(visual.id, { locked: !visual.locked });
                  }}
                  className={`action-btn ${visual.locked ? 'locked' : 'unlocked'}`}
                  title={visual.locked ? 'Unlock' : 'Lock'}
                >
                  {visual.locked ? '🔒' : '🔓'}
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDuplicateVisual(visual.id);
                  }}
                  className="action-btn duplicate"
                  title="Duplicate"
                >
                  📋
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteVisual(visual.id);
                  }}
                  className="action-btn delete"
                  title="Delete"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

// ============================================================================
// PROPERTY EDITOR COMPONENT
// ============================================================================

interface IPropertyEditorProps {
  selectedVisual?: IVisualElement | null;
  onUpdateVisual: (visualId: string, updates: Partial<IVisualElement>) => void;
}

const PropertyEditor: React.FC<IPropertyEditorProps> = ({ selectedVisual, onUpdateVisual }) => {
  const [localName, setLocalName] = useState('');
  const [localX, setLocalX] = useState(0);
  const [localY, setLocalY] = useState(0);

  useEffect(() => {
    if (selectedVisual) {
      setLocalName(selectedVisual.name);
      setLocalX(selectedVisual.x);
      setLocalY(selectedVisual.y);
    }
  }, [selectedVisual]);

  const handleUpdateProperty = (property: string, value: string | number | boolean) => {
    if (!selectedVisual) return;
    
    onUpdateVisual(selectedVisual.id, { [property]: value });
  };

  if (!selectedVisual) {
    return (
      <div className="property-editor">
        <h3>Properties</h3>
        <div className="no-selection">
          <p>Select a visual element to edit its properties</p>
        </div>
      </div>
    );
  }

  return (
    <div className="property-editor">
      <h3>Properties - {selectedVisual.type}</h3>
      <div className="property-groups">
        
        {/* Basic Properties */}
        <div className="property-group">
          <h4>Basic</h4>
          <div className="property-field">
            <label>Name:</label>
            <input
              type="text"
              value={localName}
              onChange={(e) => setLocalName(e.target.value)}
              onBlur={() => handleUpdateProperty('name', localName)}
              onKeyPress={(e) => e.key === 'Enter' && handleUpdateProperty('name', localName)}
            />
          </div>
        </div>

        {/* Position Properties */}
        <div className="property-group">
          <h4>Position</h4>
          <div className="property-row">
            <div className="property-field">
              <label>X:</label>
              <input
                type="number"
                value={localX}
                onChange={(e) => setLocalX(Number(e.target.value))}
                onBlur={() => handleUpdateProperty('x', localX)}
              />
            </div>
            <div className="property-field">
              <label>Y:</label>
              <input
                type="number"
                value={localY}
                onChange={(e) => setLocalY(Number(e.target.value))}
                onBlur={() => handleUpdateProperty('y', localY)}
              />
            </div>
          </div>
        </div>

        {/* Size Properties */}
        <div className="property-group">
          <h4>Size</h4>
          <div className="property-row">
            <div className="property-field">
              <label>Width:</label>
              <input
                type="number"
                value={selectedVisual.width}
                onChange={(e) => handleUpdateProperty('width', Number(e.target.value))}
              />
            </div>
            <div className="property-field">
              <label>Height:</label>
              <input
                type="number"
                value={selectedVisual.height}
                onChange={(e) => handleUpdateProperty('height', Number(e.target.value))}
              />
            </div>
          </div>
        </div>

        {/* Visibility Properties */}
        <div className="property-group">
          <h4>Visibility</h4>
          <div className="property-field">
            <label>
              <input
                type="checkbox"
                checked={selectedVisual.visible}
                onChange={(e) => handleUpdateProperty('visible', e.target.checked)}
              />
              Visible
            </label>
          </div>
          <div className="property-field">
            <label>
              <input
                type="checkbox"
                checked={selectedVisual.locked}
                onChange={(e) => handleUpdateProperty('locked', e.target.checked)}
              />
              Locked
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// MAIN APPLICATION COMPONENT
// ============================================================================

export const MainApp: React.FC = () => {
  const [visuals, setVisuals] = useState<IVisualElement[]>([]);
  const [selectedVisualId, setSelectedVisualId] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<TVisualType | null>(null);
  const [message, setMessage] = useState<string>('Dashboard Creator Ready');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Get selected visual
  const selectedVisual = visuals.find(v => v.id === selectedVisualId) || null;

  // ============================================================================
  // PLUGIN COMMUNICATION
  // ============================================================================
  const sendMessageToPlugin = useCallback((message: Record<string, unknown>) => {
    if (typeof parent !== 'undefined' && parent.postMessage) {
      parent.postMessage({ pluginMessage: message }, '*');
    }
  }, []);

  const handlePluginMessage = useCallback((event: MessageEvent) => {
    const message = event.data.pluginMessage as IPluginMessage;
    if (!message) return;

    console.log('[MainApp] Received message:', message);

    switch (message.type) {
      case 'visual-created':
        if (message.success && message.data) {
          refreshVisuals();
          setMessage(`✅ Created ${message.data.name}`);
        } else {
          setMessage(`❌ Failed to create visual: ${message.message}`);
        }
        break;

      case 'visual-updated':
        if (message.success) {
          refreshVisuals();
          setMessage(`✅ Updated visual`);
        } else {
          setMessage(`❌ Failed to update visual: ${message.message}`);
        }
        break;

      case 'visual-deleted':
        if (message.success) {
          refreshVisuals();
          setSelectedVisualId(null);
          setMessage(`✅ Deleted visual`);
        } else {
          setMessage(`❌ Failed to delete visual: ${message.message}`);
        }
        break;

      case 'visual-duplicated':
        if (message.success) {
          refreshVisuals();
          setMessage(`✅ Duplicated visual`);
        } else {
          setMessage(`❌ Failed to duplicate visual: ${message.message}`);
        }
        break;

      case 'visuals-retrieved':
        if (message.success && message.data) {
          const retrievedVisuals = (message.data.visuals as IVisualElement[]) || [];
          setVisuals(retrievedVisuals);
          setMessage(`📊 Retrieved ${retrievedVisuals.length} visuals`);
        }
        setIsLoading(false);
        break;

      case 'error':
        setMessage(`❌ Error: ${message.message}`);
        setIsLoading(false);
        break;

      default:
        console.log('[MainApp] Unknown message type:', message.type);
    }
  }, []);

  // Setup message listener
  useEffect(() => {
    window.addEventListener('message', handlePluginMessage);
    return () => window.removeEventListener('message', handlePluginMessage);
  }, [handlePluginMessage]);

  // Initialize app
  useEffect(() => {
    sendMessageToPlugin({ type: 'ui-ready' });
    refreshVisuals();
  }, [sendMessageToPlugin]);

  // ============================================================================
  // CRUD OPERATIONS
  // ============================================================================

  const refreshVisuals = useCallback(() => {
    setIsLoading(true);
    sendMessageToPlugin({ type: 'get-visuals' });
  }, [sendMessageToPlugin]);

  const handleCreateVisual = useCallback((visualType: TVisualType) => {
    setSelectedType(visualType);
    setMessage(`Creating ${visualType}...`);
    
    // Handle both dashboard visuals and Figma elements
    if (typeof visualType === 'string' && !Object.values(EVisualNodeType).includes(visualType as EVisualNodeType)) {
      // Dashboard visual - use legacy insert-visual message
      sendMessageToPlugin({
        type: 'insert-visual',
        visualType: visualType
      });
    } else {
      // Figma element - use new create-visual message
      const createRequest: ICreateVisualRequest = {
        visualType: visualType as EVisualNodeType,
        name: `New ${visualType}`,
        width: 400,
        height: 300
      };

      sendMessageToPlugin({
        type: 'create-visual',
        payload: createRequest
      });
    }
  }, [sendMessageToPlugin]);

  const handleSelectVisual = useCallback((visualId: string) => {
    setSelectedVisualId(visualId);
    sendMessageToPlugin({
      type: 'select-visual',
      payload: { visualId }
    });
  }, [sendMessageToPlugin]);

  const handleUpdateVisual = useCallback((visualId: string, updates: Partial<IVisualElement>) => {
    const updateRequest: IUpdateVisualRequest = {
      visualId,
      updates
    };

    sendMessageToPlugin({
      type: 'update-visual',
      payload: updateRequest
    });
  }, [sendMessageToPlugin]);

  const handleDeleteVisual = useCallback((visualId: string) => {
    if (confirm('Are you sure you want to delete this visual?')) {
      sendMessageToPlugin({
        type: 'delete-visual',
        payload: { visualId }
      });
    }
  }, [sendMessageToPlugin]);

  const handleDuplicateVisual = useCallback((visualId: string) => {
    sendMessageToPlugin({
      type: 'duplicate-visual',
      payload: { visualId }
    });
  }, [sendMessageToPlugin]);

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <div className="main-app">
      {/* Header */}
      <header className="app-header">
        <h1>Dashboard Creator</h1>
        <div className="status-bar">
          <span className="status-message">{message}</span>
          {isLoading && <span className="loading-indicator">⏳</span>}
        </div>
      </header>

      {/* Main Content */}
      <div className="app-content">
        {/* Left Panel - Visual Library */}
        <div className="left-panel">
          <VisualLibrary
            onCreateVisual={handleCreateVisual}
            selectedType={selectedType}
          />
        </div>

        {/* Center Panel - Visual Manager */}
        <div className="center-panel">
          <VisualManager
            visuals={visuals}
            onSelectVisual={handleSelectVisual}
            onUpdateVisual={handleUpdateVisual}
            onDeleteVisual={handleDeleteVisual}
            onDuplicateVisual={handleDuplicateVisual}
            selectedVisualId={selectedVisualId}
          />
        </div>

        {/* Right Panel - Property Editor */}
        <div className="right-panel">
          <PropertyEditor
            selectedVisual={selectedVisual}
            onUpdateVisual={handleUpdateVisual}
          />
        </div>
      </div>

      {/* Footer */}
      <footer className="app-footer">
        <div className="stats">
          <span>Total Visuals: {visuals.length}</span>
          <span>Selected: {selectedVisual ? selectedVisual.name : 'None'}</span>
        </div>
        <button onClick={refreshVisuals} className="refresh-btn">
          🔄 Refresh
        </button>
      </footer>
    </div>
  );
};
