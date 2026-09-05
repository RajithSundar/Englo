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
  AlertTriangle,
  AlertCircle
} from 'lucide-react';
import { SystemNodeData, SystemNodeType } from '../../types';
import { usePlatformStore } from '../../store/usePlatformStore';

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
        iconBg: 'bg-[#CAD2C5]/40 text-[#2F3E46] dark:text-[#CAD2C5]',
        badge: 'bg-[#CAD2C5]/20 text-[#52796F] border-[#CAD2C5]/70'
      };
    case 'network':
      return {
        iconBg: 'bg-[#84A98C]/25 text-[#52796F] dark:text-[#84A98C]',
        badge: 'bg-[#84A98C]/20 text-[#52796F] dark:text-[#84A98C] border-[#84A98C]/40'
      };
    case 'compute':
      return {
        iconBg: 'bg-[#52796F]/25 text-[#354F52] dark:text-[#CAD2C5]',
        badge: 'bg-[#52796F]/20 text-[#354F52] dark:text-[#CAD2C5] border-[#52796F]/40'
      };
    case 'storage':
      return {
        iconBg: 'bg-[#84A98C]/25 text-[#52796F] dark:text-[#84A98C]',
        badge: 'bg-[#84A98C]/20 text-[#52796F] dark:text-[#84A98C] border-[#84A98C]/40'
      };
    default:
      return {
        iconBg: 'bg-[#CAD2C5]/30 text-[#2F3E46] dark:text-[#CAD2C5]',
        badge: 'bg-[#CAD2C5]/20 text-[#52796F] border-[#CAD2C5]'
      };
  }
}

export const SystemNode = memo(({ data, selected }: NodeProps) => {
  const nodeData = data as unknown as SystemNodeData;
  const IconComponent = getNodeIcon(nodeData.subType);
  const colors = getCategoryColor(nodeData.category);

  const replicas = nodeData.config?.replicas;
  const mode = nodeData.config?.mode;
  let configSummary = nodeData.subType.replace(/_/g, ' ');

  if (mode === 'Autoscaling' && replicas) {
    configSummary = `Autoscaling (${replicas} units)`;
  } else if (mode && replicas && replicas > 1) {
    configSummary = `${mode} (${replicas}x)`;
  } else if (replicas && replicas > 1) {
    configSummary = `${replicas} Replicas`;
  } else if (mode) {
    configSummary = mode;
  } else if (nodeData.config?.algorithm) {
    configSummary = nodeData.config.algorithm;
  } else if (nodeData.config?.cachePolicy) {
    configSummary = `${nodeData.config.cachePolicy} Eviction`;
  }

  // Live scaling metrics reflecting real-time slider and mode configuration
  const dynamicRps = (nodeData.category === 'compute' && replicas)
    ? `${(replicas * 2500).toLocaleString()} req/s`
    : (nodeData.category === 'storage' && mode?.includes('Replica') && replicas)
      ? `${(replicas * 3000).toLocaleString()} req/s`
      : nodeData.metrics?.rps;

  const dynamicLatency = (nodeData.category === 'compute' && replicas && replicas >= 2)
    ? `${Math.max(4, Math.round(36 / replicas))}ms`
    : nodeData.metrics?.latency;

  const isError = nodeData.status === 'error';
  const isWarning = nodeData.status === 'warning';

  let borderClasses = 'border-[#CAD2C5]/80 dark:border-[#52796F]/50 shadow-apple hover:border-[#84A98C]/50 dark:hover:border-[#84A98C]/50';
  if (selected) {
    borderClasses = 'border-[#84A98C] ring-2 ring-[#84A98C]/30 shadow-lg scale-[1.02]';
  } else if (isError) {
    borderClasses = 'border-red-500 ring-2 ring-red-500/40 shadow-lg shadow-red-500/10 animate-pulse';
  } else if (isWarning) {
    borderClasses = 'border-amber-400 ring-2 ring-amber-400/40 shadow-lg shadow-amber-500/10 animate-pulse';
  }

  return (
    <div
      id={`system-node-${nodeData.id}`}
      onClick={(e) => {
        e.stopPropagation();
        usePlatformStore.getState().setSelectedNodeId(nodeData.id);
      }}
      className={`relative w-60 rounded-2xl bg-white dark:bg-[#2F3E46] border transition-all duration-200 select-none cursor-pointer ${borderClasses}`}
    >
      {/* 4 Multi-directional Connection Handles */}
      <Handle
        type="target"
        position={Position.Top}
        id="top"
        className="!bg-[#84A98C] !w-2.5 !h-2.5 !border-2 !border-white dark:!border-[#2F3E46]"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="bottom"
        className="!bg-[#84A98C] !w-2.5 !h-2.5 !border-2 !border-white dark:!border-[#2F3E46]"
      />
      <Handle
        type="target"
        position={Position.Left}
        id="left"
        className="!bg-[#84A98C] !w-2.5 !h-2.5 !border-2 !border-white dark:!border-[#2F3E46]"
      />
      <Handle
        type="source"
        position={Position.Right}
        id="right"
        className="!bg-[#84A98C] !w-2.5 !h-2.5 !border-2 !border-white dark:!border-[#2F3E46]"
      />

      {/* Node Header */}
      <div className="p-3.5 border-b border-[#CAD2C5]/40 dark:border-[#52796F]/30 flex items-center justify-between gap-2 bg-white dark:bg-[#2F3E46] rounded-t-2xl">
        <div className="flex items-center gap-2 min-w-0">
          <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${colors.iconBg}`}>
            <IconComponent className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="text-xs font-bold text-[#2F3E46] dark:text-white truncate">{nodeData.label}</div>
            <div className="text-[10px] text-[#52796F] dark:text-[#CAD2C5]/70 capitalize">{nodeData.category}</div>
          </div>
        </div>

        {/* Health status pill */}
        <div className="shrink-0 flex items-center gap-1">
          {isError ? (
            <span className="flex items-center gap-0.5 text-[9px] font-mono text-red-600 bg-red-50 dark:bg-red-950/40 border border-red-200/70 dark:border-red-800/60 px-1.5 py-0.2 rounded-full">
              <AlertCircle className="w-2.5 h-2.5 text-red-500" />
              SPOF Failure
            </span>
          ) : isWarning ? (
            <span className="flex items-center gap-0.5 text-[9px] font-mono text-[#FF9500] bg-amber-50 dark:bg-amber-950/40 border border-amber-200/70 dark:border-amber-800/60 px-1.5 py-0.2 rounded-full">
              <AlertTriangle className="w-2.5 h-2.5 text-[#FF9500]" />
              Bottleneck
            </span>
          ) : (
            <span className="flex items-center gap-0.5 text-[9px] font-mono text-[#84A98C] bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/70 dark:border-emerald-800/60 px-1.5 py-0.2 rounded-full">
              <CheckCircle2 className="w-2.5 h-2.5" />
              Healthy
            </span>
          )}
        </div>
      </div>

      {/* Node Details Body */}
      <div className="p-3.5 space-y-2 text-xs bg-[#F4F6F4] dark:bg-[#1E272C] rounded-b-2xl">
        <div className="flex items-center justify-between gap-1 text-[11px]">
          <span className="text-[#52796F] dark:text-[#CAD2C5]/70">Configuration:</span>
          <span className="font-mono text-[#2F3E46] dark:text-white font-medium truncate max-w-[160px] bg-[#CAD2C5]/30 dark:bg-[#2F3E46] px-1.5 py-0.2 rounded" title={configSummary}>
            {configSummary}
          </span>
        </div>

        {/* Metrics readout */}
        {(dynamicRps || nodeData.metrics) && (
          <div className="pt-2 border-t border-[#CAD2C5]/40 dark:border-[#52796F]/30 grid grid-cols-2 gap-2 text-[10px] font-mono text-[#52796F] dark:text-[#CAD2C5]/70">
            <div>
              RPS: <strong className={isWarning || isError ? 'text-amber-600 dark:text-amber-400 font-bold' : 'text-[#2F3E46] dark:text-white'}>{dynamicRps || nodeData.metrics?.rps || 'N/A'}</strong>
            </div>
            <div>
              Latency: <strong className={isError ? 'text-red-600 dark:text-red-400 font-bold' : isWarning ? 'text-[#FF9500] font-bold' : 'text-[#2F3E46] dark:text-white'}>{dynamicLatency || nodeData.metrics?.latency || 'N/A'}</strong>
            </div>
          </div>
        )}
      </div>
    </div>
  );
});

SystemNode.displayName = 'SystemNode';
