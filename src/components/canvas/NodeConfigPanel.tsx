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
      className="absolute top-4 right-4 w-80 bg-white/95 backdrop-blur-md border border-black/[0.08] rounded-2xl shadow-apple-hover p-4 z-40 text-xs text-[#1D1D1F] select-none space-y-4 animate-in fade-in slide-in-from-right-2 duration-200"
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-black/[0.06] pb-2.5">
        <div className="flex items-center gap-2">
          <Settings className="w-4 h-4 text-[#0071E3]" />
          <span className="font-bold text-[#1D1D1F] text-sm">Node Configuration</span>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-full text-[#86868B] hover:text-[#1D1D1F] hover:bg-neutral-100 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Label Name */}
      <div className="space-y-1">
        <label className="text-[11px] font-semibold text-[#86868B]">Component Label</label>
        <input
          type="text"
          value={nodeData.label}
          onChange={(e) => onUpdate({ label: e.target.value })}
          className="w-full px-3 py-1.5 bg-[#F5F5F7] border border-neutral-200/90 rounded-xl text-[#1D1D1F] focus:outline-none focus:ring-2 focus:ring-[#0071E3]/20 focus:border-[#0071E3] text-xs transition-all"
        />
      </div>

      {/* Database Specific Controls */}
      {isDB && (
        <div className="space-y-3 bg-[#FBFBFD] p-3 rounded-xl border border-neutral-200/80">
          <div className="text-[11px] font-semibold text-[#1D1D1F] flex items-center gap-1.5">
            <Database className="w-3.5 h-3.5 text-[#0071E3]" />
            <span>Database Replication Topology</span>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] text-[#86868B]">Architecture Topology</label>
            <select
              value={nodeData.config?.mode || 'Primary-Replica'}
              onChange={(e) => handleConfigChange('mode', e.target.value)}
              className="w-full px-2.5 py-1.5 bg-white border border-neutral-200/90 rounded-xl text-[#1D1D1F] focus:outline-none focus:border-[#0071E3] cursor-pointer text-xs"
            >
              <option value="Primary-Replica">Primary-Replica (Active/Passive Failover)</option>
              <option value="Sharded">Sharded / Distributed Hash Ring</option>
              <option value="Multi-Region">Multi-Region Active-Active</option>
              <option value="Single Node">Single Standalone Node (SPOF)</option>
            </select>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-[10px] text-[#86868B]">
              <span>Read Replicas:</span>
              <span className="font-mono font-bold text-[#1D1D1F]">{nodeData.config?.replicas || 2} nodes</span>
            </div>
            <input
              type="range"
              min="0"
              max="10"
              value={nodeData.config?.replicas || 2}
              onChange={(e) => handleConfigChange('replicas', parseInt(e.target.value))}
              className="w-full accent-[#0071E3] cursor-pointer"
            />
          </div>
        </div>
      )}

      {/* Cache Specific Controls */}
      {isCache && (
        <div className="space-y-3 bg-[#FBFBFD] p-3 rounded-xl border border-neutral-200/80">
          <div className="text-[11px] font-semibold text-[#1D1D1F] flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-[#34C759]" />
            <span>Cache Invalidation &amp; Eviction</span>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] text-[#86868B]">Eviction Algorithm</label>
            <select
              value={nodeData.config?.cachePolicy || 'LRU'}
              onChange={(e) => handleConfigChange('cachePolicy', e.target.value)}
              className="w-full px-2.5 py-1.5 bg-white border border-neutral-200/90 rounded-xl text-[#1D1D1F] focus:outline-none focus:border-[#0071E3] cursor-pointer text-xs"
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
        <div className="space-y-3 bg-[#FBFBFD] p-3 rounded-xl border border-neutral-200/80">
          <div className="text-[11px] font-semibold text-[#1D1D1F] flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5 text-purple-600" />
            <span>Autoscaling &amp; Concurrency</span>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-[10px] text-[#86868B]">
              <span>Instance Count:</span>
              <span className="font-mono font-bold text-[#1D1D1F]">{nodeData.config?.replicas || 3} units</span>
            </div>
            <input
              type="range"
              min="1"
              max="20"
              value={nodeData.config?.replicas || 3}
              onChange={(e) => handleConfigChange('replicas', parseInt(e.target.value))}
              className="w-full accent-[#0071E3] cursor-pointer"
            />
          </div>
        </div>
      )}

      {/* Actions (Duplicate / Delete) */}
      <div className="pt-2 border-t border-black/[0.06] flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={onDuplicate}
          className="flex-1 py-1.5 px-3 rounded-full bg-[#F5F5F7] hover:bg-neutral-200 text-[#1D1D1F] border border-neutral-200 flex items-center justify-center gap-1.5 transition-colors font-medium"
        >
          <Copy className="w-3 h-3 text-[#6E6E73]" />
          <span>Duplicate</span>
        </button>

        <button
          type="button"
          onClick={onDelete}
          className="py-1.5 px-3 rounded-full bg-red-50 hover:bg-red-100 text-[#FF3B30] border border-red-200 flex items-center justify-center gap-1.5 transition-colors font-medium"
        >
          <Trash2 className="w-3 h-3" />
          <span>Remove</span>
        </button>
      </div>
    </div>
  );
};
