import axios from 'axios';
import type {
  RoadmapRequest,
  RoadmapResponse,
  NodeRequest,
  NodeResponse,
  DirectoryRequest,
  DirectoryResponse,
} from '../types/api';
import { mockRoadmapApi, mockNodeApi, mockDirectoryApi } from './mockApi';
import { initializeSampleData, clearAllData } from './localStorageService';

// Check if we should use local mode
const useLocalApiEnv = import.meta.env.VITE_USE_LOCAL_API;
const apiUrlEnv = import.meta.env.VITE_API_URL;
const isLocalMode = useLocalApiEnv === 'true' || !apiUrlEnv;

console.log('Environment check:', {
  VITE_USE_LOCAL_API: useLocalApiEnv,
  VITE_API_URL: apiUrlEnv,
  isLocalMode,
  DEV: import.meta.env.DEV,
  PROD: import.meta.env.PROD
});

// Initialize sample data if in local mode
if (isLocalMode) {
  clearAllData(); // Clear all data to fix ID mismatch
  initializeSampleData();
}

const api = axios.create({
  baseURL: import.meta.env.DEV ? '/api' : import.meta.env.VITE_API_URL || 'http://localhost:3000',
  timeout: 10000,
});

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    if (error.response?.status === 404) {
      console.warn('API endpoint not found, falling back to local mode');
      // Could implement fallback to local mode here if needed
    }
    return Promise.reject(error);
  }
);

// Roadmap API
export const roadmapApi = {
  create: async (data: RoadmapRequest): Promise<RoadmapResponse> => {
    if (isLocalMode) {
      return mockRoadmapApi.create(data);
    }

    const formData = new FormData();
    formData.append('title', data.title);
    if (data.description) formData.append('description', data.description);
    if (data.thumbnail) formData.append('thumbnail', data.thumbnail);
    if (data.directoryId) formData.append('directoryId', data.directoryId);

    console.log('Creating roadmap with data:', data);
    console.log('FormData entries:', Array.from(formData.entries()));

    const response = await api.post('/roadmap/create', formData);
    return response.data;
  },

  update: async (id: string, data: Partial<RoadmapRequest>): Promise<RoadmapResponse> => {
    if (isLocalMode) {
      return mockRoadmapApi.update(id, data);
    }

    const response = await api.put(`/roadmap/update/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    if (isLocalMode) {
      return mockRoadmapApi.delete(id);
    }

    await api.delete(`/roadmap/delete/${id}`);
  },

  getAll: async (): Promise<RoadmapResponse[]> => {
    if (isLocalMode) {
      return mockRoadmapApi.getAll();
    }

    const response = await api.get('/roadmap/all');
    return response.data;
  },

  toggleFavorite: async (id: string): Promise<RoadmapResponse> => {
    if (isLocalMode) {
      return mockRoadmapApi.toggleFavorite(id);
    }

    const response = await api.post(`/roadmap/favorite/${id}`);
    return response.data;
  },

  getLastAccessed: async (): Promise<RoadmapResponse> => {
    if (isLocalMode) {
      return mockRoadmapApi.getLastAccessed();
    }

    const response = await api.get('/roadmap/last-accessed');
    return response.data;
  },

  getCount: async (): Promise<number> => {
    if (isLocalMode) {
      return mockRoadmapApi.getCount();
    }

    const response = await api.get('/roadmap/count');
    return response.data;
  },
};

// Node API
export const nodeApi = {
  create: async (roadmapId: string, data: NodeRequest): Promise<NodeResponse> => {
    if (isLocalMode) {
      return mockNodeApi.create(roadmapId, data);
    }

    const response = await api.post(`/roadmap/${roadmapId}/nodes`, data);
    return response.data;
  },

  get: async (roadmapId: string, nodeId: string): Promise<NodeResponse> => {
    if (isLocalMode) {
      return mockNodeApi.get(roadmapId, nodeId);
    }

    const response = await api.get(`/roadmap/${roadmapId}/nodes/${nodeId}`);
    return response.data;
  },

  update: async (
    roadmapId: string,
    nodeId: string,
    data: Partial<NodeRequest>
  ): Promise<NodeResponse> => {
    if (isLocalMode) {
      return mockNodeApi.update(roadmapId, nodeId, data);
    }

    const response = await api.put(`/roadmap/${roadmapId}/nodes/${nodeId}`, data);
    return response.data;
  },

  delete: async (roadmapId: string, nodeId: string): Promise<void> => {
    if (isLocalMode) {
      return mockNodeApi.delete(roadmapId, nodeId);
    }

    await api.delete(`/roadmap/${roadmapId}/nodes/${nodeId}`);
  },

  getByRoadmap: async (roadmapId: string): Promise<NodeResponse[]> => {
    if (isLocalMode) {
      return mockNodeApi.getByRoadmap(roadmapId);
    }

    const response = await api.get(`/roadmap/${roadmapId}/nodes`);
    return response.data;
  },
};

// Directory API
export const directoryApi = {
  create: async (data: DirectoryRequest): Promise<DirectoryResponse> => {
    if (isLocalMode) {
      return mockDirectoryApi.create(data);
    }

    const response = await api.post('/directories/create', data);
    return response.data;
  },

  update: async (id: string, data: Partial<DirectoryRequest>): Promise<DirectoryResponse> => {
    if (isLocalMode) {
      return mockDirectoryApi.update(id, data);
    }

    const response = await api.put(`/directories/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    if (isLocalMode) {
      return mockDirectoryApi.delete(id);
    }

    await api.delete(`/directories/${id}`);
  },

  getRootContents: async (): Promise<DirectoryResponse[]> => {
    if (isLocalMode) {
      return mockDirectoryApi.getRootContents();
    }

    const response = await api.get('/directories/root-contents');
    return response.data;
  },
};

export { api };
