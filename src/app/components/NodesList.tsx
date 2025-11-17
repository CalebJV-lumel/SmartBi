import React from 'react';
import { ChevronRight } from 'lucide-react';
import { INodeData } from '../../shared/types/messages';

interface INodesListProps {
  nodes: INodeData[];
  selectedNodeId: string | null;
  onSelectNode: (id: string) => void;
}

export function NodesList({ nodes, selectedNodeId, onSelectNode }: INodesListProps) {
  return (
    <div className="nodes-section">
      <div className="section-header">
        <h3>Your Elements</h3>
        <span className="count">{nodes.length}</span>
      </div>

      <div className="nodes-list">
        {nodes.length === 0 ? (
          <div className="empty-state">
            <p>No elements yet</p>
            <span>Use the insert bar above to create elements</span>
          </div>
        ) : (
          nodes.map(node => (
            <div
              key={node.id}
              className={`node-item ${selectedNodeId === node.id ? 'active' : ''}`}
              onClick={() => onSelectNode(node.id)}
            >
              <div className="node-content">
                <span className="node-name">{node.name}</span>
                <span className="node-type">{node.type}</span>
              </div>
              <ChevronRight size={16} className="node-arrow" />
            </div>
          ))
        )}
      </div>
    </div>
  );
}
