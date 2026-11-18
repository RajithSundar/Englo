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
  Archive
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

export const SystemNode = memo(({ data, selected }: NodeProps) => {
  const nodeData = data as unknown as SystemNodeData;
  const IconComponent = getNodeIcon(nodeData.subType);

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

  const isError = nodeData.status === 'error';
  const isWarning = nodeData.status === 'warning';
  const statusLabel = isError ? 'Single point of failure' : isWarning ? 'Bottleneck' : 'Healthy';
  const statusDot = isError ? 'bg-bad' : isWarning ? 'bg-warn' : 'bg-ok';

  let borderClasses = 'border-rule hover:border-rule-2';
  if (selected) {
    borderClasses = 'border-accent shadow-glow-1';
  } else if (isError) {
    borderClasses = 'border-bad/70';
  } else if (isWarning) {
    borderClasses = 'border-warn/70';
  }

  return (
    <div
      id={`system-node-${nodeData.id}`}
      onClick={(e) => {
        e.stopPropagation();
        usePlatformStore.getState().setSelectedNodeId(nodeData.id);
      }}
      className={`relative w-52 rounded-xl bg-paper-2 border transition-[border-color,box-shadow] duration-150 select-none cursor-pointer ${borderClasses}`}
    >
      {/* Lit top edge */}
      <span aria-hidden="true" className="pointer-events-none absolute inset-x-3 top-0 h-px bg-ink/20" />

      {/* 4 Multi-directional Connection Handles */}
      <Handle type="target" position={Position.Top} id="top" />
      <Handle type="source" position={Position.Bottom} id="bottom" />
      <Handle type="target" position={Position.Left} id="left" />
      <Handle type="source" position={Position.Right} id="right" />

      <div className="px-3 py-2.5 flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg border border-rule flex items-center justify-center shrink-0 text-ink-2">
          <IconComponent className="w-4 h-4" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-[13px] font-medium text-ink truncate">{nodeData.label}</div>
          <div className="text-[11px] text-muted capitalize truncate" title={configSummary}>
            {nodeData.category} · {configSummary}
          </div>
        </div>
        <span
          role="img"
          aria-label={statusLabel}
          title={statusLabel}
          className={`w-2 h-2 rounded-full shrink-0 ${statusDot}`}
        />
      </div>
    </div>
  );
});

SystemNode.displayName = 'SystemNode';
