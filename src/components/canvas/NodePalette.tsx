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
    { id: 'client', label: 'Client Devices', color: 'text-[#354F52] dark:text-[#CAD2C5]' },
    { id: 'network', label: 'Network & Routing', color: 'text-[#52796F] dark:text-[#84A98C]' },
    { id: 'compute', label: 'Compute & Execution', color: 'text-[#52796F] dark:text-[#CAD2C5]' },
    { id: 'storage', label: 'Storage & Caching', color: 'text-[#84A98C]' }
  ];

  const onDragStart = (e: React.DragEvent, item: PaletteItem) => {
    e.dataTransfer.setData('application/reactflow', JSON.stringify(item));
    e.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div
      id="node-palette-sidebar"
      className="w-64 border-r border-[#CAD2C5]/40 dark:border-[#52796F]/30 bg-white dark:bg-[#2F3E46] flex flex-col h-full select-none overflow-y-auto flex-shrink-0"
    >
      {/* Palette Header */}
      <div className="p-3.5 border-b border-[#CAD2C5]/40 dark:border-[#52796F]/30 bg-white dark:bg-[#2F3E46] flex items-center justify-between">
        <div>
          <span className="text-xs font-bold text-[#2F3E46] dark:text-white tracking-tight">Component Palette</span>
          <p className="text-[10px] text-[#52796F] dark:text-[#CAD2C5]/70 font-mono">Drag or tap (+) to place on canvas</p>
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
                className="w-full flex items-center justify-between px-2 py-1 text-xs font-semibold font-mono text-[#52796F] dark:text-[#CAD2C5]/70 hover:text-[#2F3E46] dark:hover:text-white uppercase tracking-wider rounded transition-colors cursor-pointer"
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
                        className="group flex items-center justify-between p-2 rounded-xl bg-[#F4F6F4] dark:bg-[#1E272C] hover:bg-[#CAD2C5]/20 dark:hover:bg-[#354F52]/60 border border-[#CAD2C5]/60 dark:border-[#52796F]/40 hover:border-[#84A98C]/50 dark:hover:border-[#84A98C]/50 cursor-grab active:cursor-grabbing transition-all shadow-2xs"
                        title={`${item.label} - ${item.description}`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <GripVertical className="w-3.5 h-3.5 text-[#CAD2C5] dark:text-[#52796F] group-hover:text-[#52796F] dark:group-hover:text-[#CAD2C5] flex-shrink-0" />
                          <div className="w-7 h-7 rounded-lg bg-white dark:bg-[#2F3E46] flex items-center justify-center text-[#2F3E46] dark:text-white group-hover:text-[#52796F] dark:group-hover:text-[#84A98C] flex-shrink-0 border border-[#CAD2C5]/80 dark:border-[#52796F]/40 shadow-2xs">
                            <Icon className="w-3.5 h-3.5" />
                          </div>
                          <div className="flex flex-col min-w-0">
                            <span className="text-xs font-semibold text-[#2F3E46] dark:text-white truncate">
                              {item.label}
                            </span>
                            <span className="text-[10px] text-[#52796F] dark:text-[#CAD2C5]/70 truncate">
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
                          className="w-6 h-6 rounded-full bg-white dark:bg-[#2F3E46] hover:bg-[#84A98C] dark:hover:bg-[#84A98C] text-[#52796F] dark:text-[#CAD2C5] hover:text-[#2F3E46] dark:hover:text-[#2F3E46] flex items-center justify-center transition-colors flex-shrink-0 border border-[#CAD2C5]/80 dark:border-[#52796F]/40 shadow-2xs active:scale-95 cursor-pointer"
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
