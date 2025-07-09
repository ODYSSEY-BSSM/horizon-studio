import { useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { roadmapApi, nodeApi } from '../services/api';
import { useRoadmapStore } from '../stores/roadmapStore';
import { nodeResponseToReactFlowNode } from '../stores/roadmapStore';
import toast from 'react-hot-toast';

// Query keys
const QUERY_KEYS = {
  roadmaps: ['roadmaps'] as const,
  roadmap: (id: string) => ['roadmap', id] as const,
  nodes: (roadmapId: string) => ['nodes', roadmapId] as const,
  roadmapCount: ['roadmapCount'] as const,
  lastAccessed: ['lastAccessed'] as const,
};

// Roadmap queries
export const useRoadmaps = () => {
  const { setRoadmaps } = useRoadmapStore();

  const query = useQuery({
    queryKey: QUERY_KEYS.roadmaps,
    queryFn: roadmapApi.getAll,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  useEffect(() => {
    if (query.data) {
      setRoadmaps(query.data);
    }
  }, [query.data, setRoadmaps]);

  return query;
};

export const useRoadmapCount = () => {
  return useQuery({
    queryKey: QUERY_KEYS.roadmapCount,
    queryFn: roadmapApi.getCount,
    staleTime: 5 * 60 * 1000,
  });
};

export const useLastAccessedRoadmap = () => {
  return useQuery({
    queryKey: QUERY_KEYS.lastAccessed,
    queryFn: roadmapApi.getLastAccessed,
    staleTime: 1 * 60 * 1000, // 1 minute
  });
};

// Node queries
export const useNodes = (roadmapId: string) => {
  const { setNodes } = useRoadmapStore();

  const query = useQuery({
    queryKey: QUERY_KEYS.nodes(roadmapId),
    queryFn: () => nodeApi.getByRoadmap(roadmapId),
    enabled: !!roadmapId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });

  useEffect(() => {
    console.log('useNodes effect:', { roadmapId, enabled: !!roadmapId, data: query.data }); // Debug log
    if (query.data && Array.isArray(query.data)) {
      const reactFlowNodes = query.data.map(nodeResponseToReactFlowNode);
      console.log('Setting nodes:', reactFlowNodes); // Debug log
      setNodes(reactFlowNodes);
    } else if (query.data === null || query.data === undefined) {
      // API에서 null이나 undefined가 반환되면 빈 배열로 설정
      setNodes([]);
    }
  }, [query.data, setNodes, roadmapId]);

  return query;
};

// Roadmap mutations
export const useCreateRoadmap = () => {
  const queryClient = useQueryClient();
  const { addRoadmap } = useRoadmapStore();

  return useMutation({
    mutationFn: roadmapApi.create,
    onSuccess: (data: any) => {
      addRoadmap(data);
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.roadmaps });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.roadmapCount });
      toast.success('Roadmap created successfully');
    },
    onError: (error: any) => {
      console.error('Error creating roadmap:', error);
      toast.error('Failed to create roadmap');
    },
  });
};

export const useUpdateRoadmap = () => {
  const queryClient = useQueryClient();
  const { updateRoadmap } = useRoadmapStore();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => roadmapApi.update(id, data),
    onSuccess: (data: any, variables: any) => {
      updateRoadmap(variables.id, data);
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.roadmaps });
      toast.success('Roadmap updated successfully');
    },
    onError: (error: any) => {
      console.error('Error updating roadmap:', error);
      toast.error('Failed to update roadmap');
    },
  });
};

export const useDeleteRoadmap = () => {
  const queryClient = useQueryClient();
  const { deleteRoadmap } = useRoadmapStore();

  return useMutation({
    mutationFn: roadmapApi.delete,
    onSuccess: (_: any, roadmapId: any) => {
      deleteRoadmap(roadmapId);
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.roadmaps });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.roadmapCount });
      toast.success('Roadmap deleted successfully');
    },
    onError: (error: any) => {
      console.error('Error deleting roadmap:', error);
      toast.error('Failed to delete roadmap');
    },
  });
};

export const useToggleFavorite = () => {
  const queryClient = useQueryClient();
  const { updateRoadmap } = useRoadmapStore();

  return useMutation({
    mutationFn: roadmapApi.toggleFavorite,
    onSuccess: (data: any) => {
      updateRoadmap(data.id, { isFavorite: data.isFavorite });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.roadmaps });
      toast.success(data.isFavorite ? 'Added to favorites' : 'Removed from favorites');
    },
    onError: (error: any) => {
      console.error('Error toggling favorite:', error);
      toast.error('Failed to update favorite status');
    },
  });
};

// Node mutations
export const useCreateNode = () => {
  const queryClient = useQueryClient();
  const { addNode } = useRoadmapStore();

  return useMutation({
    mutationFn: ({ roadmapId, data }: { roadmapId: string; data: any }) =>
      nodeApi.create(roadmapId, data),
    onSuccess: (data: any, variables: any) => {
      const reactFlowNode = nodeResponseToReactFlowNode(data);
      addNode(reactFlowNode);
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.nodes(variables.roadmapId) });
      toast.success('Node created successfully');
    },
    onError: (error: any) => {
      console.error('Error creating node:', error);
      toast.error('Failed to create node');
    },
  });
};

export const useUpdateNode = () => {
  const queryClient = useQueryClient();
  const { updateNode } = useRoadmapStore();

  return useMutation({
    mutationFn: ({ roadmapId, nodeId, data }: { roadmapId: string; nodeId: string; data: any }) =>
      nodeApi.update(roadmapId, nodeId, data),
    onSuccess: (data: any, variables: any) => {
      const reactFlowNode = nodeResponseToReactFlowNode(data);
      updateNode(variables.nodeId, reactFlowNode);
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.nodes(variables.roadmapId) });
      toast.success('Node updated successfully');
    },
    onError: (error: any) => {
      console.error('Error updating node:', error);
      toast.error('Failed to update node');
    },
  });
};

export const useDeleteNode = () => {
  const queryClient = useQueryClient();
  const { deleteNode } = useRoadmapStore();

  return useMutation({
    mutationFn: ({ roadmapId, nodeId }: { roadmapId: string; nodeId: string }) =>
      nodeApi.delete(roadmapId, nodeId),
    onSuccess: (_: any, variables: any) => {
      deleteNode(variables.nodeId);
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.nodes(variables.roadmapId) });
      toast.success('Node deleted successfully');
    },
    onError: (error: any) => {
      console.error('Error deleting node:', error);
      toast.error('Failed to delete node');
    },
  });
};
