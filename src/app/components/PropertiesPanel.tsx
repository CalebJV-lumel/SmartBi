import React from 'react';
import { X } from 'lucide-react';
import { INodeData } from '../../shared/types/messages';

interface IPropertiesPanelProps {
  node: INodeData;
  onClose: () => void;
  onUpdate: (field: string, value: string | number | boolean) => void;
  onDelete: () => void;
}

export function PropertiesPanel({ node, onClose, onUpdate, onDelete }: IPropertiesPanelProps) {
  return (
    <div className="properties-panel">
      <div className="properties-header">
        <h3>Properties</h3>
        <button className="close-btn" onClick={onClose}>
          <X size={20} />
        </button>
      </div>

      <div className="properties-content">
        <div className="property-group">
          <label>Name</label>
          <input
            type="text"
            value={node.name}
            onChange={(e) => onUpdate('name', e.target.value)}
          />
        </div>

        <div className="property-group">
          <label>Position</label>
          <div className="property-row">
            <div className="input-field">
              <span>X</span>
              <input
                type="number"
                value={Math.round(node.x)}
                onChange={(e) => onUpdate('x', Number(e.target.value))}
              />
            </div>
            <div className="input-field">
              <span>Y</span>
              <input
                type="number"
                value={Math.round(node.y)}
                onChange={(e) => onUpdate('y', Number(e.target.value))}
              />
            </div>
          </div>
        </div>

        <div className="property-group">
          <label>Size</label>
          <div className="property-row">
            <div className="input-field">
              <span>W</span>
              <input type="number" value={Math.round(node.width)} readOnly />
            </div>
            <div className="input-field">
              <span>H</span>
              <input type="number" value={Math.round(node.height)} readOnly />
            </div>
          </div>
        </div>

        <div className="property-group">
          <label>Visibility</label>
          <div className="toggle-group">
            <label className="toggle-item">
              <input
                type="checkbox"
                checked={node.visible}
                onChange={(e) => onUpdate('visible', e.target.checked)}
              />
              <span>Visible</span>
            </label>
            <label className="toggle-item">
              <input
                type="checkbox"
                checked={node.locked}
                onChange={(e) => onUpdate('locked', e.target.checked)}
              />
              <span>Locked</span>
            </label>
          </div>
        </div>

        <div className="property-group">
          <label>Info</label>
          <div className="info-box">
            <div className="info-row">
              <span>Type</span>
              <span>{node.type}</span>
            </div>
            <div className="info-row">
              <span>ID</span>
              <span className="mono">{node.id.slice(0, 8)}...</span>
            </div>
          </div>
        </div>

        <button className="delete-btn-full" onClick={onDelete}>
          Delete Element
        </button>
      </div>
    </div>
  );
}
