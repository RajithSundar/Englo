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

  const categories: { id: SystemNodeCategory; label: string }[] = [
    { id: 'client', label: 'Client' },
    { id: 'network', label: 'Network' },
    { id: 'compute', label: 'Compute' },
    { id: 'storage', label: 'Storage' }
  ];

  const onDragStart = (e: React.DragEvent, item: PaletteItem) => {
    e.dataTransfer.setData('application/reactflow', JSON.stringify(item));
    e.dataTransfer.effectAllowed = 'move';
  };

  return (
    <aside
      id="node-palette-sidebar"
      aria-label="Components"
      className="w-56 glass-strong rounded-none border-0 border-r flex flex-col h-full select-none overflow-y-auto flex-shrink-0"
    >
      <div className="px-4 pt-4 pb-3">
        <h2 className="text-sm font-medium text-ink">Components</h2>
        <p className="text-xs text-muted mt-0.5">Drag onto the canvas, or press +</p>
      </div>

      <div className="px-2 pb-4 space-y-3">
        {categories.map((cat) => {
          const isCollapsed = collapsedCategories[cat.id];
          const items = PALETTE_ITEMS.filter((i) => i.category === cat.id);

          return (
            <div key={cat.id}>
              <button
                type="button"
                onClick={() => toggleCategory(cat.id)}
                aria-expanded={!isCollapsed}
                className="label w-full flex items-center justify-between px-2 h-7 rounded-lg hover:text-ink transition-colors cursor-pointer"
              >
                <span>{cat.label}</span>
                {isCollapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>

              {!isCollapsed && (
                <ul className="mt-0.5 space-y-0.5">
                  {items.map((item) => {
                    const Icon = item.icon;

                    return (
                      <li
                        key={item.type}
                        draggable
                        onDragStart={(e) => onDragStart(e, item)}
                        className="group flex items-center gap-2.5 h-9 pl-2 pr-1 rounded-lg border border-transparent hover:bg-paper-3 hover:border-rule cursor-grab active:cursor-grabbing transition-colors"
                        title={`${item.label}: ${item.description}`}
                      >
                        <Icon className="w-4 h-4 text-muted group-hover:text-accent shrink-0 transition-colors" />
                        <span className="flex-1 min-w-0 text-[13px] text-ink-2 group-hover:text-ink truncate">
                          {item.label}
                        </span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onAddNode(item);
                          }}
                          className="w-7 h-7 rounded-none flex items-center justify-center text-muted hover:text-accent hover:bg-accent/15 opacity-60 group-hover:opacity-100 focus-visible:opacity-100 transition shrink-0 cursor-pointer"
                          aria-label={`Add ${item.label} to canvas`}
                          title="Add to canvas"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          );
        })}
      </div>
    </aside>
  );
};
