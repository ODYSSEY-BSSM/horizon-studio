import type {
  RoadmapRequest,
  RoadmapResponse,
  NodeRequest,
  NodeResponse,
  DirectoryRequest,
  DirectoryResponse,
} from '../types/api';
import { roadmapStorage, nodeStorage, directoryStorage } from './localStorageService';

// Mock delay to simulate network requests
const delay = (ms = 300) => new Promise((resolve) => setTimeout(resolve, ms));

// Mock Roadmap API
export const mockRoadmapApi = {
  create: async (data: RoadmapRequest): Promise<RoadmapResponse> => {
    await delay();
    const roadmap = roadmapStorage.create({
      title: data.title,
      description: data.description,
      directoryId: data.directoryId,
      thumbnail: data.thumbnail ? URL.createObjectURL(data.thumbnail) : undefined,
    });
    return roadmap;
  },

  update: async (id: string, data: Partial<RoadmapRequest>): Promise<RoadmapResponse> => {
    await delay();
    // Convert File to string URL for storage
    const updateData: Partial<RoadmapResponse> = {
      title: data.title,
      description: data.description,
      directoryId: data.directoryId,
      thumbnail: data.thumbnail ? URL.createObjectURL(data.thumbnail) : undefined,
    };
    const updatedRoadmap = roadmapStorage.update(id, updateData);
    return updatedRoadmap;
  },

  delete: async (id: string): Promise<void> => {
    await delay();
    roadmapStorage.delete(id);
  },

  getAll: async (): Promise<RoadmapResponse[]> => {
    await delay();
    return roadmapStorage.getAll();
  },

  toggleFavorite: async (id: string): Promise<RoadmapResponse> => {
    await delay();
    const roadmap = roadmapStorage.toggleFavorite(id);
    return roadmap;
  },

  getLastAccessed: async (): Promise<RoadmapResponse> => {
    await delay();
    const roadmap = roadmapStorage.getLastAccessed();
    if (!roadmap) {
      throw new Error('No roadmaps found');
    }
    return roadmap;
  },

  getCount: async (): Promise<number> => {
    await delay(100);
    return roadmapStorage.getCount();
  },
};

// Mock Node API
export const mockNodeApi = {
  create: async (roadmapId: string, data: NodeRequest): Promise<NodeResponse> => {
    await delay();

    // Check if roadmap exists before creating node
    const roadmaps = roadmapStorage.getAll();
    const roadmapExists = roadmaps.some(r => r.id === roadmapId);
    
    if (!roadmapExists) {
      throw new Error(`Cannot create node: Roadmap with id ${roadmapId} not found`);
    }

    // Mark roadmap as accessed
    roadmapStorage.updateLastAccessed(roadmapId);

    const node = nodeStorage.create(roadmapId, {
      title: data.title,
      description: data.description,
      type: data.type,
      position: data.position,
      data: data.data,
    });
    return node;
  },

  get: async (roadmapId: string, nodeId: string): Promise<NodeResponse> => {
    await delay();
    const node = nodeStorage.getById(nodeId);
    if (!node || node.roadmapId !== roadmapId) {
      throw new Error(`Node with id ${nodeId} not found in roadmap ${roadmapId}`);
    }
    return node;
  },

  update: async (
    roadmapId: string,
    nodeId: string,
    data: Partial<NodeRequest>
  ): Promise<NodeResponse> => {
    await delay();

    // Verify node belongs to roadmap
    const existingNode = nodeStorage.getById(nodeId);
    if (!existingNode || existingNode.roadmapId !== roadmapId) {
      throw new Error(`Node with id ${nodeId} not found in roadmap ${roadmapId}`);
    }

    const updatedNode = nodeStorage.update(nodeId, data);
    return updatedNode;
  },

  delete: async (roadmapId: string, nodeId: string): Promise<void> => {
    await delay();

    // Verify node belongs to roadmap
    const existingNode = nodeStorage.getById(nodeId);
    if (!existingNode || existingNode.roadmapId !== roadmapId) {
      throw new Error(`Node with id ${nodeId} not found in roadmap ${roadmapId}`);
    }

    nodeStorage.delete(nodeId);
  },

  getByRoadmap: async (roadmapId: string): Promise<NodeResponse[]> => {
    await delay();

    // Mark roadmap as accessed
    roadmapStorage.updateLastAccessed(roadmapId);

    return nodeStorage.getByRoadmap(roadmapId);
  },
};

// Mock Directory API
export const mockDirectoryApi = {
  create: async (data: DirectoryRequest): Promise<DirectoryResponse> => {
    await delay();
    const directory = directoryStorage.create({
      name: data.name,
      parentId: data.parentId,
    });
    return directory;
  },

  update: async (id: string, data: Partial<DirectoryRequest>): Promise<DirectoryResponse> => {
    await delay();
    const updatedDirectory = directoryStorage.update(id, data);
    return updatedDirectory;
  },

  delete: async (id: string): Promise<void> => {
    await delay();
    directoryStorage.delete(id);
  },

  getRootContents: async (): Promise<DirectoryResponse[]> => {
    await delay();
    return directoryStorage.getRootContents();
  },
};
