import React from 'react';
import { X, Trash2, Copy } from 'lucide-react';
import { SystemNodeData } from '../../types';

interface NodeConfigPanelProps {
  nodeData: SystemNodeData;
  onUpdate: (patch: Partial<SystemNodeData>) => void;
  onDelete: () => void;
  onDuplicate: () => void;
  onClose: () => void;
}

export const NodeConfigPanel: React.FC<NodeConfigPanelProps> = ({
  nodeData,
  onUpdate,
  onDelete,
  onDuplicate,
  onClose
}) => {
  const isDB = nodeData.subType === 'sql_db' || nodeData.subType === 'nosql_db';
  const isCache = nodeData.subType === 'redis_cache';
  const isCompute = nodeData.category === 'compute';

  const handleConfigChange = (key: string, value: any) => {
    onUpdate({
      config: {
        ...nodeData.config,
        [key]: value
      }
    });
  };

  return (
    <div
      id="node-config-panel"
      role="dialog"
      aria-label={`Configure ${nodeData.label}`}
      className="absolute top-[4.5rem] right-4 w-72 max-h-[calc(100%-5.5rem)] overflow-y-auto glass-strong rounded-xl p-4 z-40 text-sm text-ink-2 space-y-4"
    >
      <div className="flex items-center justify-between gap-2">
        <div className="min-w-0">
          <h2 className="text-sm font-medium text-ink truncate">Configure</h2>
          <p className="text-xs text-muted capitalize">{nodeData.category} · {nodeData.subType.replace(/_/g, ' ')}</p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="btn-icon border-transparent w-8 h-8"
          aria-label="Close configuration"
          title="Close"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-1.5">
        <label htmlFor="node-label-input" className="label block">Label</label>
        <input
          id="node-label-input"
          type="text"
          value={nodeData.label}
          onChange={(e) => onUpdate({ label: e.target.value })}
          className="field"
        />
      </div>

      {isDB && (
        <div className="space-y-4 pt-4 border-t border-rule">
          <div className="space-y-1.5">
            <label htmlFor="db-mode-select" className="label block">Replication topology</label>
            <select
              id="db-mode-select"
              value={nodeData.config?.mode || 'Primary-Replica'}
              onChange={(e) => handleConfigChange('mode', e.target.value)}
              className="field cursor-pointer"
            >
              <option value="Primary-Replica">Primary-replica (failover)</option>
              <option value="Sharded">Sharded (hash ring)</option>
              <option value="Multi-Region">Multi-region active-active</option>
              <option value="Single Node">Single node (single point of failure)</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between items-baseline">
              <label htmlFor="db-replicas-input" className="label">Read replicas</label>
              <span className="text-xs text-ink tabular-nums">{nodeData.config?.replicas || 2}</span>
            </div>
            <input
              id="db-replicas-input"
              type="range"
              min="0"
              max="10"
              value={nodeData.config?.replicas || 2}
              onChange={(e) => handleConfigChange('replicas', parseInt(e.target.value))}
              className="w-full accent-accent cursor-pointer"
            />
          </div>
        </div>
      )}

      {isCache && (
        <div className="space-y-1.5 pt-4 border-t border-rule">
          <label htmlFor="cache-policy-select" className="label block">Eviction policy</label>
          <select
            id="cache-policy-select"
            value={nodeData.config?.cachePolicy || 'LRU'}
            onChange={(e) => handleConfigChange('cachePolicy', e.target.value)}
            className="field cursor-pointer"
          >
            <option value="LRU">Least recently used (LRU)</option>
            <option value="LFU">Least frequently used (LFU)</option>
            <option value="FIFO">First in, first out (FIFO)</option>
          </select>
        </div>
      )}

      {isCompute && (
        <div className="space-y-1.5 pt-4 border-t border-rule">
          <div className="flex justify-between items-baseline">
            <label htmlFor="compute-replicas-input" className="label">Instances</label>
            <span className="text-xs text-ink tabular-nums">{nodeData.config?.replicas || 3}</span>
          </div>
          <input
            id="compute-replicas-input"
            type="range"
            min="1"
            max="20"
            value={nodeData.config?.replicas || 3}
            onChange={(e) => handleConfigChange('replicas', parseInt(e.target.value))}
            className="w-full accent-accent cursor-pointer"
          />
        </div>
      )}

      <div className="pt-4 border-t border-rule flex items-center gap-2">
        <button type="button" onClick={onDuplicate} className="btn flex-1">
          <Copy className="w-3.5 h-3.5" />
          <span>Duplicate</span>
        </button>
        <button
          type="button"
          onClick={onDelete}
          className="btn text-bad border-bad/50 hover:border-bad"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Remove</span>
        </button>
      </div>
    </div>
  );
};
