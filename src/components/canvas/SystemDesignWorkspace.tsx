import React, { useState, useCallback, useRef, useMemo } from 'react';
import {
  ReactFlow,
  ReactFlowProvider,
  Background,
  Controls,
  MiniMap,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  Connection,
  Edge,
  Node,
  BackgroundVariant,
  useReactFlow
} from '@xyflow/react';
import { Lightbulb, RotateCcw, Play, Loader2, Zap, Layers } from 'lucide-react';
import { usePlatformStore } from '../../store/usePlatformStore';
import { Problem, SystemNodeData } from '../../types';
import { audioService } from '../../services/audioService';
import { SystemNode } from './SystemNode';
import { NodePalette } from './NodePalette';
import { NodeConfigPanel } from './NodeConfigPanel';
import { ArchOutputConsole } from './ArchOutputConsole';

const nodeTypes = {
  systemNode: SystemNode
};

interface SystemDesignWorkspaceInnerProps {
  problem: Problem;
}

const SystemDesignWorkspaceInner: React.FC<SystemDesignWorkspaceInnerProps> = ({ problem }) => {
  const {
    canvasData,
    setCanvasData,
    selectedNodeId,
    setSelectedNodeId,
    updateNodeData,
    archEvaluations,
    isEvaluating,
    isConsoleExpanded,
    setConsoleExpanded,
    resetProblem,
    loadSolution,
    runArchEvaluation
  } = usePlatformStore();

  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const { screenToFlowPosition } = useReactFlow();

  const [activeConsoleTab, setActiveConsoleTab] = useState<'scenarios' | 'metrics' | 'recommendations'>('scenarios');
  const [isPaletteOpen, setIsPaletteOpen] = useState(false);

  // Load problem nodes/edges or default
  const currentData = canvasData[problem.id] || {
    nodes: problem.defaultArchNodes || [],
    edges: problem.defaultArchEdges || []
  };

  const nodes = currentData.nodes as Node[];
  const edges = currentData.edges as Edge[];

  // Sync node changes
  const onNodesChange = useCallback(
    (changes: any) => {
      const nextNodes = applyNodeChanges(changes, nodes);
      setCanvasData(problem.id, nextNodes, edges);
    },
    [nodes, edges, problem.id, setCanvasData]
  );

  // Sync edge changes
  const onEdgesChange = useCallback(
    (changes: any) => {
      const nextEdges = applyEdgeChanges(changes, edges);
      setCanvasData(problem.id, nodes, nextEdges);
    },
    [nodes, edges, problem.id, setCanvasData]
  );

  // Connect handles
  const onConnect = useCallback(
    (params: Connection) => {
      const nextEdges = addEdge(
        {
          ...params,
          animated: true,
          style: { stroke: 'var(--accent)', strokeWidth: 2 }
        },
        edges
      );
      setCanvasData(problem.id, nodes, nextEdges);
    },
    [edges, nodes, problem.id, setCanvasData]
  );

  // Node selection for configuration panel
  const onNodeClick = useCallback(
    (_: React.MouseEvent, node: Node) => {
      setSelectedNodeId(node.id);
    },
    [setSelectedNodeId]
  );

  const onPaneClick = useCallback(() => {
    setSelectedNodeId(null);
  }, [setSelectedNodeId]);

  // Drag-and-drop from NodePalette
  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      const rawData = event.dataTransfer.getData('application/reactflow');
      if (!rawData) return;

      try {
        const item = JSON.parse(rawData);
        const position = screenToFlowPosition({
          x: event.clientX,
          y: event.clientY
        });

        const newNodeId = `node-${item.type}-${Date.now()}`;
        const newNode: Node = {
          id: newNodeId,
          type: 'systemNode',
          position,
          data: {
            id: newNodeId,
            label: item.label,
            category: item.category,
            subType: item.type,
            config: { ...item.defaultConfig },
            status: 'healthy',
            metrics: { rps: '5k', latency: '4ms' }
          }
        };

        setCanvasData(problem.id, [...nodes, newNode], edges);
        setSelectedNodeId(newNodeId);
      } catch (err) {
        console.error('Error dropping node onto canvas:', err);
      }
    },
    [screenToFlowPosition, nodes, edges, problem.id, setCanvasData, setSelectedNodeId]
  );

  // Tap-to-add for touch screens / iPad
  const handleAddNodeFromPalette = useCallback(
    (item: any) => {
      const x = 350 + Math.random() * 120;
      const y = 180 + Math.random() * 120;
      const newNodeId = `node-${item.type}-${Date.now()}`;

      const newNode: Node = {
        id: newNodeId,
        type: 'systemNode',
        position: { x, y },
        data: {
          id: newNodeId,
          label: item.label,
          category: item.category,
          subType: item.type,
          config: { ...item.defaultConfig },
          status: 'healthy',
          metrics: { rps: '5k', latency: '4ms' }
        }
      };

      setCanvasData(problem.id, [...nodes, newNode], edges);
      setSelectedNodeId(newNodeId);
    },
    [nodes, edges, problem.id, setCanvasData, setSelectedNodeId]
  );

  // Node duplication & deletion
  const selectedNode = useMemo(() => {
    return nodes.find((n) => n.id === selectedNodeId) || null;
  }, [nodes, selectedNodeId]);

  const handleDeleteSelected = useCallback(() => {
    if (!selectedNodeId) return;
    const nextNodes = nodes.filter((n) => n.id !== selectedNodeId);
    const nextEdges = edges.filter((e) => e.source !== selectedNodeId && e.target !== selectedNodeId);
    setCanvasData(problem.id, nextNodes, nextEdges);
    setSelectedNodeId(null);
  }, [selectedNodeId, nodes, edges, problem.id, setCanvasData, setSelectedNodeId]);

  const handleDuplicateSelected = useCallback(() => {
    if (!selectedNode) return;
    const newNodeId = `node-${selectedNode.data.subType}-${Date.now()}`;
    const newNode: Node = {
      ...selectedNode,
      id: newNodeId,
      position: {
        x: selectedNode.position.x + 32,
        y: selectedNode.position.y + 32
      },
      data: {
        ...(selectedNode.data as unknown as SystemNodeData),
        id: newNodeId,
        label: `${(selectedNode.data as unknown as SystemNodeData).label} (Copy)`
      }
    };
    setCanvasData(problem.id, [...nodes, newNode], edges);
    setSelectedNodeId(newNodeId);
  }, [selectedNode, nodes, edges, problem.id, setCanvasData, setSelectedNodeId]);

  const handleChaosSurge = useCallback(() => {
    audioService.playTap();
    setConsoleExpanded(false);

    // Simulate 10x traffic spike on current topology
    // Find compute and storage nodes without sufficient capacity/redundancy
    const nextNodes = nodes.map((node) => {
      const d = node.data as unknown as SystemNodeData;
      const isDb = d.category === 'storage';
      const isCompute = d.category === 'compute';
      const replicas = d.config?.replicas || 1;
      const mode = d.config?.mode || '';

      // Databases with Single Node or replicas < 2 fail under 100k spike
      if (isDb && (replicas < 2 || mode === 'Single Node' || (!mode.includes('Replica') && !mode.includes('Sharded') && !mode.includes('Multi-AZ')))) {
        return {
          ...node,
          data: {
            ...d,
            status: 'error' as const,
            metrics: { rps: '98k req/s', latency: '1,420ms (SPOF OVERLOAD)' }
          }
        };
      }

      // Compute nodes with single replica under 10x traffic experience high bottleneck
      if (isCompute && replicas < 3) {
        return {
          ...node,
          data: {
            ...d,
            status: 'warning' as const,
            metrics: { rps: '45k req/s', latency: '480ms (CPU Throttling)' }
          }
        };
      }

      // Resilient nodes
      return {
        ...node,
        data: {
          ...d,
          status: 'healthy' as const,
          metrics: { rps: '100k req/s', latency: '8ms (Resilient)' }
        }
      };
    });

    setCanvasData(problem.id, nextNodes, edges);

    const hasFailure = nextNodes.some((n) => (n.data as any).status === 'error');
    if (hasFailure) {
      audioService.playAlert();
    } else {
      audioService.playSuccessChime();
    }
  }, [nodes, edges, problem.id, setCanvasData, setConsoleExpanded]);

  const currentEvaluation = archEvaluations[problem.id] || null;

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-paper relative">
      {/* Middle: Palette + Canvas */}
      <div className="flex-1 flex min-h-0 relative overflow-hidden">
        {/* Node Palette Draggable Tray */}
        {isPaletteOpen && <NodePalette onAddNode={handleAddNodeFromPalette} />}

        {/* Canvas Area */}
        <div ref={reactFlowWrapper} className="flex-1 h-full relative">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={onNodeClick}
            onPaneClick={onPaneClick}
            onDragOver={onDragOver}
            onDrop={onDrop}
            nodeTypes={nodeTypes}
            snapToGrid={true}
            snapGrid={[16, 16]}
            fitView
            fitViewOptions={{ padding: 0.35, includeHiddenNodes: false, maxZoom: 1 }}
            defaultEdgeOptions={{
              animated: true,
              style: { stroke: 'var(--accent)', strokeWidth: 2 }
            }}
          >
            <Background
              variant={BackgroundVariant.Dots}
              gap={16}
              size={1.5}
              color="var(--rule-2)"
            />
            <Controls />
            <MiniMap
              nodeColor={() => 'var(--accent)'}
              maskColor="color-mix(in oklab, var(--paper) 70%, transparent)"
              className="!pointer-events-none !bg-paper-2 !border !border-rule !rounded-xl overflow-hidden"
            />
          </ReactFlow>

          {/* Canvas toolbar: one primary action, the rest as icon buttons */}
          <div
            role="toolbar"
            aria-label="Canvas actions"
            className="absolute top-4 right-4 z-20 flex items-center gap-1 p-1 rounded-full glass"
          >
            <button
              type="button"
              id="btn-toggle-palette"
              onClick={() => setIsPaletteOpen(!isPaletteOpen)}
              className={`btn-icon border-transparent ${isPaletteOpen ? 'text-accent' : ''}`}
              aria-pressed={isPaletteOpen}
              aria-label={isPaletteOpen ? 'Hide components' : 'Show components'}
              title={isPaletteOpen ? 'Hide components' : 'Show components'}
            >
              <Layers className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={handleChaosSurge}
              className="btn-icon border-transparent"
              aria-label="Stress test with a 10x traffic surge"
              title="Stress test with a 10x traffic surge"
            >
              <Zap className="w-4 h-4" />
            </button>

            {problem.solutionArchNodes && (
              <button
                type="button"
                onClick={() => {
                  if (window.confirm('Load reference architecture? This will replace your current canvas with the optimal design.')) {
                    loadSolution(problem.id);
                  }
                }}
                className="btn-icon border-transparent"
                aria-label="Load reference architecture"
                title="Load reference architecture"
              >
                <Lightbulb className="w-4 h-4" />
              </button>
            )}

            <button
              type="button"
              onClick={() => {
                if (window.confirm('Reset canvas to starting nodes? Any unsaved layout changes will be cleared.')) {
                  resetProblem(problem.id);
                }
              }}
              className="btn-icon border-transparent"
              aria-label="Reset canvas"
              title="Reset canvas"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <span className="w-px h-5 bg-rule mx-1" aria-hidden="true" />

            <button
              type="button"
              onClick={() => {
                audioService.playTap();
                setConsoleExpanded(true);
                runArchEvaluation(problem.id);
              }}
              disabled={isEvaluating}
              className="btn-primary"
              title="Run the load and failover scenarios on this design"
            >
              {isEvaluating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Running</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  <span>Run scenarios</span>
                </>
              )}
            </button>
          </div>

          {/* Floating Node Config Panel (when node clicked) */}
          {selectedNode && (
            <NodeConfigPanel
              nodeData={selectedNode.data as unknown as SystemNodeData}
              onUpdate={(patch) => updateNodeData(problem.id, selectedNode.id, patch)}
              onDelete={handleDeleteSelected}
              onDuplicate={handleDuplicateSelected}
              onClose={() => setSelectedNodeId(null)}
            />
          )}
        </div>
      </div>

      {/* Bottom Architecture Validation Console */}
      <ArchOutputConsole
        evaluation={currentEvaluation}
        isEvaluating={isEvaluating}
        isExpanded={isConsoleExpanded}
        onToggleExpanded={() => setConsoleExpanded(!isConsoleExpanded)}
        activeTab={activeConsoleTab}
        onSelectTab={setActiveConsoleTab}
      />
    </div>
  );
};

interface SystemDesignWorkspaceProps {
  problem: Problem;
}

export const SystemDesignWorkspace: React.FC<SystemDesignWorkspaceProps> = ({ problem }) => {
  return (
    <ReactFlowProvider>
      <SystemDesignWorkspaceInner problem={problem} />
    </ReactFlowProvider>
  );
};
