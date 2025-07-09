import React, { useCallback, useEffect, useMemo, memo } from 'react';
import {
  ReactFlow,
  addEdge,
  useNodesState,
  useEdgesState,
  Controls,
  MiniMap,
  Background,
  BackgroundVariant,
  type Node,
  type Edge,
  type Connection,
  type EdgeMouseHandler,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useRoadmapStore } from '../stores/roadmapStore';
import { RoadmapNode } from './nodes/RoadmapNode';
import { MilestoneNode } from './nodes/MilestoneNode';
import { TaskNode } from './nodes/TaskNode';

const nodeTypes = {
  default: RoadmapNode,
  milestone: MilestoneNode,
  task: TaskNode,
};

interface RoadmapCanvasProps {
  roadmapId: string;
}

export const RoadmapCanvas: React.FC<RoadmapCanvasProps> = memo(({ roadmapId: _roadmapId }) => {
  const {
    nodes: storeNodes,
    edges: storeEdges,
    setNodes: setStoreNodes,
    setEdges: setStoreEdges,
    addEdge: addStoreEdge,
    setSelectedNode,
  } = useRoadmapStore();

  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  // Initialize with store data once
  useEffect(() => {
    setNodes(storeNodes);
  }, [storeNodes.length]); // Only depend on length to avoid infinite loops

  useEffect(() => {
    setEdges(storeEdges);
  }, [storeEdges.length]); // Only depend on length to avoid infinite loops

  const onConnect = useCallback(
    (params: Connection) => {
      console.log('연결 시도:', params);
      if (!params.source || !params.target) {
        console.log('연결 실패: source 또는 target이 없음');
        return;
      }

      const newEdge = {
        id: `edge-${params.source}-${params.target}`,
        source: params.source,
        target: params.target,
        sourceHandle: params.sourceHandle,
        targetHandle: params.targetHandle,
        type: 'smoothstep',
        animated: true,
        style: {
          stroke: '#4f46e5',
          strokeWidth: 2,
        },
        markerEnd: {
          type: 'arrowclosed',
          color: '#4f46e5',
        },
      };

      console.log('새 연결 생성:', newEdge);
      setEdges((eds) => {
        const updatedEdges = addEdge(newEdge as Edge, eds);
        console.log('업데이트된 연결들:', updatedEdges);
        return updatedEdges;
      });
      addStoreEdge(newEdge as Edge);
    },
    [setEdges, addStoreEdge]
  );

  const onNodeClick = useCallback(
    (_event: React.MouseEvent, node: Node) => {
      setSelectedNode(node);
    },
    [setSelectedNode]
  );

  const onPaneClick = useCallback(() => {
    setSelectedNode(null);
  }, [setSelectedNode]);

  const onEdgeClick: EdgeMouseHandler = useCallback((event, edge) => {
    event.stopPropagation();
    console.log('연결선 클릭됨:', edge);
  }, []);

  const onEdgeDoubleClick: EdgeMouseHandler = useCallback(
    (event, edge) => {
      event.stopPropagation();
      const confirmed = window.confirm('이 연결을 삭제하시겠습니까?');
      if (confirmed) {
        setEdges((eds) => eds.filter((e) => e.id !== edge.id));
        console.log('연결선 삭제됨:', edge.id);
      }
    },
    [setEdges]
  );

  const onNodeDragStop = useCallback(
    (_event: React.MouseEvent, node: Node) => {
      // Update node position in store only if position actually changed
      const currentNode = nodes.find((n) => n.id === node.id);
      if (
        currentNode &&
        (currentNode.position.x !== node.position.x || currentNode.position.y !== node.position.y)
      ) {
        setStoreNodes(nodes.map((n) => (n.id === node.id ? { ...n, position: node.position } : n)));
      }
    },
    [nodes, setStoreNodes]
  );

  const memoizedNodeTypes = useMemo(() => nodeTypes, []);

  return (
    <div style={{ width: '100%', height: '100%', minHeight: '500px' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        onPaneClick={onPaneClick}
        onNodeDragStop={onNodeDragStop}
        onEdgeClick={onEdgeClick}
        onEdgeDoubleClick={onEdgeDoubleClick}
        nodeTypes={memoizedNodeTypes}
        fitView={nodes.length > 0}
        attributionPosition="top-right"
        defaultViewport={{ x: 0, y: 0, zoom: 1 }}
        minZoom={0.2}
        maxZoom={4}
        deleteKeyCode="Delete"
        multiSelectionKeyCode="Shift"
        connectionMode="loose"
        connectionLineType="smoothstep"
        connectionLineStyle={{
          stroke: '#4f46e5',
          strokeWidth: 2,
          strokeDasharray: '5,5',
        }}
        style={{ background: '#f8fafc' }}
      >
        <Controls />
        <MiniMap nodeStrokeColor="#374151" nodeColor="#9ca3af" nodeBorderRadius={2} />
        <Background variant={BackgroundVariant.Dots} gap={12} size={1} color="#e5e7eb" />
      </ReactFlow>

      {/* Usage info */}
      <div
        style={{
          position: 'absolute',
          top: '10px',
          left: '10px',
          background: 'rgba(255, 255, 255, 0.9)',
          padding: '12px',
          borderRadius: '8px',
          fontSize: '12px',
          color: '#6b7280',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
          zIndex: 10,
        }}
      >
        <div>
          <strong>💡 사용법:</strong>
        </div>
        <div>• 노드 연결: 원형 점을 드래그</div>
        <div>• 연결 삭제: 연결선 더블클릭</div>
        <div>• 또는 연결선 선택 후 Delete 키</div>
      </div>

      {/* Debug info for empty canvas */}
      {nodes.length === 0 && (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center',
            color: '#6b7280',
          }}
        >
          <p>표시할 노드가 없습니다</p>
          <p>더블클릭하여 노드를 생성하세요</p>
        </div>
      )}
    </div>
  );
});
