import React, { memo } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import {
  Tv,
  Smartphone,
  Globe,
  ShieldCheck,
  GitFork,
  Radio,
  Server,
  Cpu,
  Zap,
  Database,
  HardDrive,
  Layers,
  Archive,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { SystemNodeData, SystemNodeType } from '../../types';

function getNodeIcon(subType: SystemNodeType) {
  switch (subType) {
    case 'smart_tv':
      return Tv;
    case 'mobile':
      return Smartphone;
    case 'browser':
      return Globe;
    case 'api_gateway':
      return ShieldCheck;
    case 'load_balancer':
      return GitFork;
    case 'cdn':
      return Radio;
    case 'web_server':
      return Server;
    case 'worker':
      return Cpu;
    case 'lambda':
      return Zap;
    case 'sql_db':
      return Database;
    case 'nosql_db':
      return HardDrive;
    case 'redis_cache':
      return Layers;
    case 's3_storage':
      return Archive;
    default:
      return Server;
  }
}

function getCategoryColor(category: string) {
  switch (category) {
    case 'client':
      return {
        iconBg: 'bg-sky-50 text-sky-600',
        badge: 'bg-sky-50 text-sky-700 border-sky-200/70'
      };
    case 'network':
      return {
        iconBg: 'bg-blue-50 text-[#0071E3]',
        badge: 'bg-blue-50 text-[#0071E3] border-blue-200/70'
      };
    case 'compute':
      return {
        iconBg: 'bg-purple-50 text-purple-600',
        badge: 'bg-purple-50 text-purple-700 border-purple-200/70'
      };
    case 'storage':
      return {
        iconBg: 'bg-emerald-50 text-emerald-600',
        badge: 'bg-emerald-50 text-emerald-700 border-emerald-200/70'
      };
    default:
      return {
        iconBg: 'bg-neutral-100 text-[#1D1D1F]',
        badge: 'bg-neutral-100 text-[#6E6E73] border-neutral-200'
      };
  }
}

export const SystemNode = memo(({ data, selected }: NodeProps) => {
  const nodeData = data as unknown as SystemNodeData;
  const IconComponent = getNodeIcon(nodeData.subType);
  const colors = getCategoryColor(nodeData.category);

  const configSummary =
    nodeData.config?.mode ||
    (nodeData.config?.replicas ? `${nodeData.config.replicas} Replicas` : null) ||
    nodeData.config?.algorithm ||
    nodeData.config?.cachePolicy ||
    nodeData.subType.replace(/_/g, ' ');

  return (
    <div
      className={`relative w-60 rounded-2xl bg-white border transition-all duration-200 select-none ${
        selected
          ? 'border-[#0071E3] ring-2 ring-[#0071E3]/25 shadow-lg scale-[1.02]'
          : 'border-neutral-200/90 shadow-apple hover:border-neutral-300'
      }`}
    >
      {/* 4 Multi-directional Connection Handles */}
      <Handle
        type="target"
        position={Position.Top}
        id="top"
        className="!bg-[#0071E3] !w-2.5 !h-2.5 !border-2 !border-white"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="bottom"
        className="!bg-[#0071E3] !w-2.5 !h-2.5 !border-2 !border-white"
      />
      <Handle
        type="target"
        position={Position.Left}
        id="left"
        className="!bg-[#0071E3] !w-2.5 !h-2.5 !border-2 !border-white"
      />
      <Handle
        type="source"
        position={Position.Right}
        id="right"
        className="!bg-[#0071E3] !w-2.5 !h-2.5 !border-2 !border-white"
      />

      {/* Node Header */}
      <div className="p-3.5 border-b border-black/[0.06] flex items-center justify-between gap-2 bg-white rounded-t-2xl">
        <div className="flex items-center gap-2 min-w-0">
          <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${colors.iconBg}`}>
            <IconComponent className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="text-xs font-bold text-[#1D1D1F] truncate">{nodeData.label}</div>
            <div className="text-[10px] text-[#86868B] capitalize">{nodeData.category}</div>
          </div>
        </div>

        {/* Health status pill */}
        <div className="shrink-0 flex items-center gap-1">
          {nodeData.status === 'warning' ? (
            <span className="flex items-center gap-0.5 text-[9px] font-mono text-[#FF9500] bg-amber-50 border border-amber-200/70 px-1.5 py-0.2 rounded-full">
              <AlertTriangle className="w-2.5 h-2.5" />
              Warn
            </span>
          ) : (
            <span className="flex items-center gap-0.5 text-[9px] font-mono text-[#34C759] bg-emerald-50 border border-emerald-200/70 px-1.5 py-0.2 rounded-full">
              <CheckCircle2 className="w-2.5 h-2.5" />
              Healthy
            </span>
          )}
        </div>
      </div>

      {/* Node Details Body */}
      <div className="p-3.5 space-y-2 text-xs bg-[#FBFBFD] rounded-b-2xl">
        <div className="flex items-center justify-between gap-1 text-[11px]">
          <span className="text-[#86868B]">Configuration:</span>
          <span className="font-mono text-[#1D1D1F] font-medium truncate max-w-[130px] bg-neutral-100 px-1.5 py-0.2 rounded">
            {configSummary}
          </span>
        </div>

        {/* Metrics readout */}
        {nodeData.metrics && (
          <div className="pt-2 border-t border-black/[0.04] grid grid-cols-2 gap-2 text-[10px] font-mono text-[#86868B]">
            {nodeData.metrics.rps && (
              <div>
                RPS: <strong className="text-[#1D1D1F]">{nodeData.metrics.rps}</strong>
              </div>
            )}
            {nodeData.metrics.latency && (
              <div>
                Latency: <strong className="text-[#1D1D1F]">{nodeData.metrics.latency}</strong>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
});

SystemNode.displayName = 'SystemNode';
