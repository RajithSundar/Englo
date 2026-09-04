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
import { Lightbulb, RotateCcw, Play, Sparkles } from 'lucide-react';
import { usePlatformStore } from '../../store/usePlatformStore';
import { Problem, SystemNodeData } from '../../types';
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
          style: { stroke: '#0071E3', strokeWidth: 2 }
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

  const currentEvaluation = archEvaluations[problem.id] || null;

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#FBFBFD] relative">
      {/* Middle: Palette + Canvas */}
      <div className="flex-1 flex min-h-0 relative overflow-hidden">
        {/* Node Palette Draggable Tray */}
        <NodePalette onAddNode={handleAddNodeFromPalette} />

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
            fitViewOptions={{ padding: 0.2 }}
            defaultEdgeOptions={{
              animated: true,
              style: { stroke: '#0071E3', strokeWidth: 2 }
            }}
          >
            <Background
              variant={BackgroundVariant.Dots}
              gap={16}
              size={1.5}
              color="#E5E5EA"
            />
            <Controls className="!bg-white !border-neutral-200/90 !text-[#1D1D1F] !shadow-apple [&>button]:!border-neutral-200 [&>button]:!bg-white [&>button]:!fill-[#1D1D1F] [&>button:hover]:!bg-[#F5F5F7]" />
            <MiniMap
              nodeColor={() => '#0071E3'}
              maskColor="rgba(245, 245, 247, 0.7)"
              className="!bg-white !border-neutral-200/90 !rounded-xl !shadow-apple"
            />
          </ReactFlow>

          {/* Top Canvas Action Bar */}
          <div className="absolute top-4 right-4 z-20 flex items-center gap-2 bg-white/90 backdrop-blur-md p-1.5 rounded-full border border-black/[0.06] shadow-apple">
            <button
              type="button"
              onClick={() => {
                setConsoleExpanded(true);
                runArchEvaluation(problem.id);
              }}
              disabled={isEvaluating}
              className="px-3 py-1 rounded-full bg-[#0071E3] hover:bg-[#0077ED] text-white text-xs font-semibold flex items-center gap-1.5 transition-all active:scale-95 shadow-2xs disabled:opacity-60"
              title="Run distributed system simulation"
            >
              {isEvaluating ? (
                <>
                  <Sparkles className="w-3.5 h-3.5 animate-spin" />
                  <span>Simulating...</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-white" />
                  <span>Simulate Topology</span>
                </>
              )}
            </button>

            {problem.solutionArchNodes && (
              <button
                type="button"
                onClick={() => {
                  if (window.confirm('Load reference architecture? This will replace your current canvas with the optimal design.')) {
                    loadSolution(problem.id);
                  }
                }}
                className="px-3 py-1 rounded-full bg-blue-50 hover:bg-blue-100 text-[#0071E3] border border-blue-200/70 text-xs font-semibold flex items-center gap-1.5 transition-all active:scale-95 shadow-2xs"
                title="Inspect the optimal reference system architecture"
              >
                <Lightbulb className="w-3.5 h-3.5" />
                <span>Reference Architecture</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => {
                if (window.confirm('Reset canvas to starting nodes? Any unsaved layout changes will be cleared.')) {
                  resetProblem(problem.id);
                }
              }}
              className="px-3 py-1 rounded-full bg-[#F5F5F7] hover:bg-neutral-200 text-[#6E6E73] hover:text-[#1D1D1F] border border-neutral-200/80 text-xs font-medium flex items-center gap-1.5 transition-all active:scale-95"
              title="Reset canvas to starter state"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Canvas</span>
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
