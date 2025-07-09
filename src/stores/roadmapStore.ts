import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { Node, Edge } from '@xyflow/react';
import type { RoadmapResponse, NodeResponse } from '../types/api';

interface RoadmapState {
  currentRoadmap: RoadmapResponse | null;
  roadmaps: RoadmapResponse[];
  nodes: Node[];
  edges: Edge[];
  selectedNode: Node | null;
  isLoading: boolean;
  error: string | null;
}

interface RoadmapActions {
  setCurrentRoadmap: (roadmap: RoadmapResponse | null) => void;
  setRoadmaps: (roadmaps: RoadmapResponse[]) => void;
  addRoadmap: (roadmap: RoadmapResponse) => void;
  updateRoadmap: (id: string, updates: Partial<RoadmapResponse>) => void;
  deleteRoadmap: (id: string) => void;
  setNodes: (nodes: Node[]) => void;
  addNode: (node: Node) => void;
  updateNode: (id: string, updates: Partial<Node>) => void;
  deleteNode: (id: string) => void;
  setEdges: (edges: Edge[]) => void;
  addEdge: (edge: Edge) => void;
  deleteEdge: (id: string) => void;
  setSelectedNode: (node: Node | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

type RoadmapStore = RoadmapState & RoadmapActions;

const initialState: RoadmapState = {
  currentRoadmap: null,
  roadmaps: [],
  nodes: [],
  edges: [],
  selectedNode: null,
  isLoading: false,
  error: null,
};

export const useRoadmapStore = create<RoadmapStore>()(
  devtools(
    (set) => ({
      ...initialState,

      setCurrentRoadmap: (roadmap) => set({ currentRoadmap: roadmap }, false, 'setCurrentRoadmap'),

      setRoadmaps: (roadmaps) => set({ roadmaps: Array.isArray(roadmaps) ? roadmaps : [] }, false, 'setRoadmaps'),

      addRoadmap: (roadmap) =>
        set((state) => ({ roadmaps: [...state.roadmaps, roadmap] }), false, 'addRoadmap'),

      updateRoadmap: (id, updates) =>
        set(
          (state) => ({
            roadmaps: state.roadmaps.map((roadmap) =>
              roadmap.id === id ? { ...roadmap, ...updates } : roadmap
            ),
            currentRoadmap:
              state.currentRoadmap?.id === id
                ? { ...state.currentRoadmap, ...updates }
                : state.currentRoadmap,
          }),
          false,
          'updateRoadmap'
        ),

      deleteRoadmap: (id) =>
        set(
          (state) => ({
            roadmaps: state.roadmaps.filter((roadmap) => roadmap.id !== id),
            currentRoadmap: state.currentRoadmap?.id === id ? null : state.currentRoadmap,
          }),
          false,
          'deleteRoadmap'
        ),

      setNodes: (nodes) => set({ nodes: Array.isArray(nodes) ? nodes : [] }, false, 'setNodes'),

      addNode: (node) => set((state) => ({ nodes: [...state.nodes, node] }), false, 'addNode'),

      updateNode: (id, updates) =>
        set(
          (state) => ({
            nodes: state.nodes.map((node) => (node.id === id ? { ...node, ...updates } : node)),
            selectedNode:
              state.selectedNode?.id === id
                ? { ...state.selectedNode, ...updates }
                : state.selectedNode,
          }),
          false,
          'updateNode'
        ),

      deleteNode: (id) =>
        set(
          (state) => ({
            nodes: state.nodes.filter((node) => node.id !== id),
            edges: state.edges.filter((edge) => edge.source !== id && edge.target !== id),
            selectedNode: state.selectedNode?.id === id ? null : state.selectedNode,
          }),
          false,
          'deleteNode'
        ),

      setEdges: (edges) => set({ edges: Array.isArray(edges) ? edges : [] }, false, 'setEdges'),

      addEdge: (edge) => set((state) => ({ edges: [...state.edges, edge] }), false, 'addEdge'),

      deleteEdge: (id) =>
        set(
          (state) => ({
            edges: state.edges.filter((edge) => edge.id !== id),
          }),
          false,
          'deleteEdge'
        ),

      setSelectedNode: (node) => set({ selectedNode: node }, false, 'setSelectedNode'),

      setLoading: (isLoading) => set({ isLoading }, false, 'setLoading'),

      setError: (error) => set({ error }, false, 'setError'),

      reset: () => set(initialState, false, 'reset'),
    }),
    {
      name: 'roadmap-store',
    }
  )
);

// Helper functions to convert between API and React Flow formats
export const nodeResponseToReactFlowNode = (nodeResponse: NodeResponse): Node => ({
  id: nodeResponse.id,
  type: nodeResponse.type,
  position: nodeResponse.position,
  data: {
    title: nodeResponse.title,
    description: nodeResponse.description,
    ...nodeResponse.data,
  },
});

export const reactFlowNodeToNodeResponse = (
  node: Node,
  roadmapId: string
): Partial<NodeResponse> => ({
  id: node.id,
  roadmapId,
  title: (node.data as { title?: string })?.title || '',
  description: (node.data as { description?: string })?.description || '',
  type: (node.type as 'default' | 'milestone' | 'task') || 'default',
  position: node.position,
  data: node.data,
});
