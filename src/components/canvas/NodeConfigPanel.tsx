import React from 'react';
import {
  X,
  Settings,
  Trash2,
  Copy,
  Layers,
  CheckCircle2,
  Server,
  Database,
  Cpu,
  Radio
} from 'lucide-react';
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
  const isNetwork = nodeData.category === 'network';

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
      className="absolute top-4 right-4 w-80 bg-white/95 dark:bg-[#2F3E46]/95 backdrop-blur-md border border-[#CAD2C5] dark:border-[#52796F]/50 rounded-2xl shadow-apple-hover p-4 z-40 text-xs text-[#2F3E46] dark:text-[#CAD2C5] select-none space-y-4 animate-in fade-in slide-in-from-right-2 duration-200"
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#CAD2C5]/40 dark:border-[#52796F]/30 pb-2.5">
        <div className="flex items-center gap-2">
          <Settings className="w-4 h-4 text-[#52796F] dark:text-[#84A98C]" />
          <span className="font-bold text-[#2F3E46] dark:text-white text-sm">Node Configuration</span>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-full text-[#52796F] dark:text-[#CAD2C5]/70 hover:text-[#2F3E46] dark:hover:text-white hover:bg-[#CAD2C5]/30 dark:hover:bg-white/10 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Label Name */}
      <div className="space-y-1">
        <label className="text-[11px] font-semibold text-[#52796F] dark:text-[#CAD2C5]/70">Component Label</label>
        <input
          type="text"
          value={nodeData.label}
          onChange={(e) => onUpdate({ label: e.target.value })}
          className="w-full px-3 py-1.5 bg-[#F4F6F4] dark:bg-[#1E272C] border border-[#CAD2C5]/80 dark:border-[#52796F]/50 rounded-xl text-[#2F3E46] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#84A98C]/30 focus:border-[#84A98C] text-xs transition-all"
        />
      </div>

      {/* Database Specific Controls */}
      {isDB && (
        <div className="space-y-3 bg-[#F4F6F4] dark:bg-[#1E272C] p-3 rounded-xl border border-[#CAD2C5]/60 dark:border-[#52796F]/40">
          <div className="text-[11px] font-semibold text-[#2F3E46] dark:text-white flex items-center gap-1.5">
            <Database className="w-3.5 h-3.5 text-[#52796F] dark:text-[#84A98C]" />
            <span>Database Replication Topology</span>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] text-[#52796F] dark:text-[#CAD2C5]/70">Architecture Topology</label>
            <select
              id="db-mode-select"
              value={nodeData.config?.mode || 'Primary-Replica'}
              onChange={(e) => handleConfigChange('mode', e.target.value)}
              className="w-full px-2.5 py-1.5 bg-white dark:bg-[#2F3E46] border border-[#CAD2C5]/80 dark:border-[#52796F]/40 rounded-xl text-[#2F3E46] dark:text-white focus:outline-none focus:border-[#84A98C] cursor-pointer text-xs"
            >
              <option value="Primary-Replica">Primary-Replica (Active/Passive Failover)</option>
              <option value="Sharded">Sharded / Distributed Hash Ring</option>
              <option value="Multi-Region">Multi-Region Active-Active</option>
              <option value="Single Node">Single Standalone Node (SPOF)</option>
            </select>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-[10px] text-[#52796F] dark:text-[#CAD2C5]/70">
              <span>Read Replicas:</span>
              <span className="font-mono font-bold text-[#2F3E46] dark:text-white">{nodeData.config?.replicas || 2} nodes</span>
            </div>
            <input
              id="db-replicas-input"
              type="range"
              min="0"
              max="10"
              value={nodeData.config?.replicas || 2}
              onChange={(e) => handleConfigChange('replicas', parseInt(e.target.value))}
              className="w-full accent-[#84A98C] cursor-pointer"
            />
          </div>
        </div>
      )}

      {/* Cache Specific Controls */}
      {isCache && (
        <div className="space-y-3 bg-[#F4F6F4] dark:bg-[#1E272C] p-3 rounded-xl border border-[#CAD2C5]/60 dark:border-[#52796F]/40">
          <div className="text-[11px] font-semibold text-[#2F3E46] dark:text-white flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-[#84A98C]" />
            <span>Cache Invalidation &amp; Eviction</span>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] text-[#52796F] dark:text-[#CAD2C5]/70">Eviction Algorithm</label>
            <select
              value={nodeData.config?.cachePolicy || 'LRU'}
              onChange={(e) => handleConfigChange('cachePolicy', e.target.value)}
              className="w-full px-2.5 py-1.5 bg-white dark:bg-[#2F3E46] border border-[#CAD2C5]/80 dark:border-[#52796F]/40 rounded-xl text-[#2F3E46] dark:text-white focus:outline-none focus:border-[#84A98C] cursor-pointer text-xs"
            >
              <option value="LRU">Least Recently Used (LRU)</option>
              <option value="LFU">Least Frequently Used (LFU)</option>
              <option value="FIFO">First In First Out (FIFO)</option>
            </select>
          </div>
        </div>
      )}

      {/* Compute Specific Controls */}
      {isCompute && (
        <div className="space-y-3 bg-[#F4F6F4] dark:bg-[#1E272C] p-3 rounded-xl border border-[#CAD2C5]/60 dark:border-[#52796F]/40">
          <div className="text-[11px] font-semibold text-[#2F3E46] dark:text-white flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5 text-[#52796F] dark:text-[#CAD2C5]" />
            <span>Autoscaling &amp; Concurrency</span>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-[10px] text-[#52796F] dark:text-[#CAD2C5]/70">
              <span>Instance Count:</span>
              <span className="font-mono font-bold text-[#2F3E46] dark:text-white">{nodeData.config?.replicas || 3} units</span>
            </div>
            <input
              type="range"
              min="1"
              max="20"
              value={nodeData.config?.replicas || 3}
              onChange={(e) => handleConfigChange('replicas', parseInt(e.target.value))}
              className="w-full accent-[#84A98C] cursor-pointer"
            />
          </div>
        </div>
      )}

      {/* Actions (Duplicate / Delete) */}
      <div className="pt-2 border-t border-black/[0.06] dark:border-white/10 flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={onDuplicate}
          className="flex-1 py-1.5 px-3 rounded-full bg-[#F5F5F7] dark:bg-white/[0.06] hover:bg-neutral-200 dark:hover:bg-white/10 text-[#1D1D1F] dark:text-white border border-neutral-200 dark:border-white/10 flex items-center justify-center gap-1.5 transition-colors font-medium cursor-pointer"
        >
          <Copy className="w-3 h-3 text-[#6E6E73] dark:text-neutral-400" />
          <span>Duplicate</span>
        </button>

        <button
          type="button"
          onClick={onDelete}
          className="py-1.5 px-3 rounded-full bg-red-50 dark:bg-red-950/40 hover:bg-red-100 dark:hover:bg-red-900/50 text-[#FF3B30] border border-red-200 dark:border-red-800/60 flex items-center justify-center gap-1.5 transition-colors font-medium cursor-pointer"
        >
          <Trash2 className="w-3 h-3" />
          <span>Remove</span>
        </button>
      </div>
    </div>
  );
};
