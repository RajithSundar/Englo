import React, { useState } from 'react';
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
  ChevronDown,
  ChevronRight,
  GripVertical,
  Plus
} from 'lucide-react';
import { SystemNodeCategory, SystemNodeType } from '../../types';

interface PaletteItem {
  type: SystemNodeType;
  label: string;
  category: SystemNodeCategory;
  icon: React.ElementType;
  defaultConfig: Record<string, any>;
  description: string;
}

const PALETTE_ITEMS: PaletteItem[] = [
  // Client Category
  {
    type: 'smart_tv',
    label: 'Smart TV',
    category: 'client',
    icon: Tv,
    defaultConfig: { notes: 'Living room streaming client' },
    description: 'Living room app with strict bandwidth constraints'
  },
  {
    type: 'mobile',
    label: 'Mobile App',
    category: 'client',
    icon: Smartphone,
    defaultConfig: { notes: 'iOS / Android client' },
    description: 'High-frequency mobile device requests'
  },
  {
    type: 'browser',
    label: 'Web Browser',
    category: 'client',
    icon: Globe,
    defaultConfig: { notes: 'Desktop web client' },
    description: 'Standard modern browser client'
  },

  // Network Category
  {
    type: 'api_gateway',
    label: 'API Gateway',
    category: 'network',
    icon: ShieldCheck,
    defaultConfig: { algorithm: 'Token Bucket', capacityRps: 50000 },
    description: 'Rate limiting, auth token validation, routing'
  },
  {
    type: 'load_balancer',
    label: 'Load Balancer',
    category: 'network',
    icon: GitFork,
    defaultConfig: { algorithm: 'Round Robin', replicas: 2 },
    description: 'Distributes traffic evenly across compute instances'
  },
  {
    type: 'cdn',
    label: 'CDN Edge',
    category: 'network',
    icon: Radio,
    defaultConfig: { cachePolicy: 'Edge TTL 24h', mode: 'Multi-Region' },
    description: 'Geographically distributed static/media caching'
  },

  // Compute Category
  {
    type: 'web_server',
    label: 'Web Server',
    category: 'compute',
    icon: Server,
    defaultConfig: { mode: 'Autoscaling', replicas: 3, concurrency: 500 },
    description: 'Stateless application service handling business logic'
  },
  {
    type: 'worker',
    label: 'Async Worker',
    category: 'compute',
    icon: Cpu,
    defaultConfig: { mode: 'Queue-Consumer', replicas: 2 },
    description: 'Background worker for heavy async tasks'
  },
  {
    type: 'lambda',
    label: 'Serverless Lambda',
    category: 'compute',
    icon: Zap,
    defaultConfig: { concurrency: 1000, mode: 'Event-Driven' },
    description: 'On-demand scale-to-zero compute functions'
  },

  // Storage Category
  {
    type: 'sql_db',
    label: 'SQL Database',
    category: 'storage',
    icon: Database,
    defaultConfig: { mode: 'Primary-Replica', replicas: 3 },
    description: 'ACID relational database (Postgres/MySQL)'
  },
  {
    type: 'nosql_db',
    label: 'NoSQL Database',
    category: 'storage',
    icon: HardDrive,
    defaultConfig: { mode: 'Sharded', replicas: 3 },
    description: 'High-scale document/key-value store (Cassandra/Dynamo)'
  },
  {
    type: 'redis_cache',
    label: 'Redis Cache',
    category: 'storage',
    icon: Layers,
    defaultConfig: { cachePolicy: 'LRU', ttlSeconds: 86400, mode: 'Cluster' },
    description: 'Sub-millisecond in-memory cache & Pub/Sub'
  },
  {
    type: 's3_storage',
    label: 'Object Storage (S3)',
    category: 'storage',
    icon: Archive,
    defaultConfig: { storageClass: 'Standard S3', mode: 'Encrypted' },
    description: 'Blob storage for media, videos, and backups'
  }
];

interface NodePaletteProps {
  onAddNode: (item: PaletteItem) => void;
}

export const NodePalette: React.FC<NodePaletteProps> = ({ onAddNode }) => {
  const [collapsedCategories, setCollapsedCategories] = useState<Record<string, boolean>>({
    client: false,
    network: false,
    compute: false,
    storage: false
  });

  const toggleCategory = (cat: string) => {
    setCollapsedCategories((prev) => ({ ...prev, [cat]: !prev[cat] }));
  };

  const categories: { id: SystemNodeCategory; label: string; color: string }[] = [
    { id: 'client', label: 'Client Devices', color: 'text-sky-600' },
    { id: 'network', label: 'Network & Routing', color: 'text-[#0071E3]' },
    { id: 'compute', label: 'Compute & Execution', color: 'text-purple-600' },
    { id: 'storage', label: 'Storage & Caching', color: 'text-emerald-600' }
  ];

  const onDragStart = (e: React.DragEvent, item: PaletteItem) => {
    e.dataTransfer.setData('application/reactflow', JSON.stringify(item));
    e.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div
      id="node-palette-sidebar"
      className="w-64 border-r border-black/[0.06] bg-white flex flex-col h-full select-none overflow-y-auto flex-shrink-0"
    >
      {/* Palette Header */}
      <div className="p-3.5 border-b border-black/[0.06] bg-white flex items-center justify-between">
        <div>
          <span className="text-xs font-bold text-[#1D1D1F] tracking-tight">Component Palette</span>
          <p className="text-[10px] text-[#86868B] font-mono">Drag or tap (+) to place on canvas</p>
        </div>
      </div>

      {/* Categories */}
      <div className="p-2 space-y-3">
        {categories.map((cat) => {
          const isCollapsed = collapsedCategories[cat.id];
          const items = PALETTE_ITEMS.filter((i) => i.category === cat.id);

          return (
            <div key={cat.id} className="space-y-1">
              <button
                type="button"
                onClick={() => toggleCategory(cat.id)}
                className="w-full flex items-center justify-between px-2 py-1 text-xs font-semibold font-mono text-[#86868B] hover:text-[#1D1D1F] uppercase tracking-wider rounded transition-colors"
              >
                <span className={`flex items-center gap-1.5 ${cat.color}`}>
                  {cat.label}
                </span>
                {isCollapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>

              {!isCollapsed && (
                <div className="space-y-1 pl-1">
                  {items.map((item) => {
                    const Icon = item.icon;

                    return (
                      <div
                        key={item.type}
                        draggable
                        onDragStart={(e) => onDragStart(e, item)}
                        className="group flex items-center justify-between p-2 rounded-xl bg-[#FBFBFD] hover:bg-[#F5F5F7] border border-neutral-200/70 hover:border-neutral-300 cursor-grab active:cursor-grabbing transition-all shadow-2xs"
                        title={`${item.label} - ${item.description}`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <GripVertical className="w-3.5 h-3.5 text-neutral-400 group-hover:text-[#6E6E73] flex-shrink-0" />
                          <div className="w-7 h-7 rounded-lg bg-white flex items-center justify-center text-[#1D1D1F] group-hover:text-[#0071E3] flex-shrink-0 border border-neutral-200/80 shadow-2xs">
                            <Icon className="w-3.5 h-3.5" />
                          </div>
                          <div className="flex flex-col min-w-0">
                            <span className="text-xs font-semibold text-[#1D1D1F] truncate">
                              {item.label}
                            </span>
                            <span className="text-[10px] text-[#86868B] truncate">
                              {item.description}
                            </span>
                          </div>
                        </div>

                        {/* Tap to add button */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onAddNode(item);
                          }}
                          className="w-6 h-6 rounded-full bg-white hover:bg-[#0071E3] text-[#6E6E73] hover:text-white flex items-center justify-center transition-colors flex-shrink-0 border border-neutral-200 shadow-2xs active:scale-95"
                          title="Add to canvas"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
