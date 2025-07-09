import type { RoadmapResponse, NodeResponse, DirectoryResponse } from '../types/api';

const STORAGE_KEYS = {
  roadmaps: 'horizon-studio-roadmaps',
  nodes: 'horizon-studio-nodes',
  directories: 'horizon-studio-directories',
  lastId: 'horizon-studio-last-id',
};

// Helper function to generate IDs
const generateId = (): string => {
  const lastId = parseInt(localStorage.getItem(STORAGE_KEYS.lastId) || '0');
  const newId = lastId + 1;
  localStorage.setItem(STORAGE_KEYS.lastId, newId.toString());
  return newId.toString();
};

// Helper function to get current timestamp
const getCurrentTimestamp = (): string => new Date().toISOString();

// Roadmap Storage Operations
export const roadmapStorage = {
  getAll: (): RoadmapResponse[] => {
    const data = localStorage.getItem(STORAGE_KEYS.roadmaps);
    return data ? JSON.parse(data) : [];
  },

  getById: (id: string): RoadmapResponse | null => {
    const roadmaps = roadmapStorage.getAll();
    return roadmaps.find((r) => r.id === id) || null;
  },

  create: (
    roadmap: Omit<RoadmapResponse, 'id' | 'createdAt' | 'updatedAt' | 'isFavorite'>
  ): RoadmapResponse => {
    const roadmaps = roadmapStorage.getAll();
    const newRoadmap: RoadmapResponse = {
      ...roadmap,
      id: generateId(),
      createdAt: getCurrentTimestamp(),
      updatedAt: getCurrentTimestamp(),
      isFavorite: false,
    };

    roadmaps.push(newRoadmap);
    localStorage.setItem(STORAGE_KEYS.roadmaps, JSON.stringify(roadmaps));
    return newRoadmap;
  },

  update: (id: string, updates: Partial<RoadmapResponse>): RoadmapResponse => {
    const roadmaps = roadmapStorage.getAll();
    const index = roadmaps.findIndex((r) => r.id === id);

    if (index === -1) {
      throw new Error(`Roadmap with id ${id} not found`);
    }

    roadmaps[index] = {
      ...roadmaps[index],
      ...updates,
      id,
      updatedAt: getCurrentTimestamp(),
    };

    localStorage.setItem(STORAGE_KEYS.roadmaps, JSON.stringify(roadmaps));
    return roadmaps[index];
  },

  delete: (id: string): void => {
    const roadmaps = roadmapStorage.getAll();
    const filtered = roadmaps.filter((r) => r.id !== id);
    localStorage.setItem(STORAGE_KEYS.roadmaps, JSON.stringify(filtered));

    // Also delete associated nodes
    const nodes = nodeStorage.getAll();
    const filteredNodes = nodes.filter((n) => n.roadmapId !== id);
    localStorage.setItem(STORAGE_KEYS.nodes, JSON.stringify(filteredNodes));
  },

  toggleFavorite: (id: string): RoadmapResponse => {
    const roadmap = roadmapStorage.getById(id);
    if (!roadmap) {
      throw new Error(`Roadmap with id ${id} not found`);
    }

    return roadmapStorage.update(id, { isFavorite: !roadmap.isFavorite });
  },

  getCount: (): number => {
    return roadmapStorage.getAll().length;
  },

  getLastAccessed: (): RoadmapResponse | null => {
    const roadmaps = roadmapStorage.getAll();
    return (
      roadmaps
        .filter((r) => r.lastAccessedAt)
        .sort(
          (a, b) =>
            new Date(b.lastAccessedAt as string).getTime() -
            new Date(a.lastAccessedAt as string).getTime()
        )[0] || null
    );
  },

  updateLastAccessed: (id: string): void => {
    try {
      roadmapStorage.update(id, { lastAccessedAt: getCurrentTimestamp() });
    } catch (error) {
      console.warn(`Failed to update last accessed time for roadmap ${id}:`, error);
    }
  },
};

// Node Storage Operations
export const nodeStorage = {
  getAll: (): NodeResponse[] => {
    const data = localStorage.getItem(STORAGE_KEYS.nodes);
    return data ? JSON.parse(data) : [];
  },

  getByRoadmap: (roadmapId: string): NodeResponse[] => {
    const nodes = nodeStorage.getAll();
    return nodes.filter((n) => n.roadmapId === roadmapId);
  },

  getById: (id: string): NodeResponse | null => {
    const nodes = nodeStorage.getAll();
    return nodes.find((n) => n.id === id) || null;
  },

  create: (
    roadmapId: string,
    node: Omit<NodeResponse, 'id' | 'roadmapId' | 'createdAt' | 'updatedAt'>
  ): NodeResponse => {
    const nodes = nodeStorage.getAll();
    const newNode: NodeResponse = {
      ...node,
      id: generateId(),
      roadmapId,
      createdAt: getCurrentTimestamp(),
      updatedAt: getCurrentTimestamp(),
    };

    nodes.push(newNode);
    localStorage.setItem(STORAGE_KEYS.nodes, JSON.stringify(nodes));
    return newNode;
  },

  update: (id: string, updates: Partial<NodeResponse>): NodeResponse => {
    const nodes = nodeStorage.getAll();
    const index = nodes.findIndex((n) => n.id === id);

    if (index === -1) {
      throw new Error(`Node with id ${id} not found`);
    }

    nodes[index] = {
      ...nodes[index],
      ...updates,
      id,
      updatedAt: getCurrentTimestamp(),
    };

    localStorage.setItem(STORAGE_KEYS.nodes, JSON.stringify(nodes));
    return nodes[index];
  },

  delete: (id: string): void => {
    const nodes = nodeStorage.getAll();
    const filtered = nodes.filter((n) => n.id !== id);
    localStorage.setItem(STORAGE_KEYS.nodes, JSON.stringify(filtered));
  },
};

// Directory Storage Operations
export const directoryStorage = {
  getAll: (): DirectoryResponse[] => {
    const data = localStorage.getItem(STORAGE_KEYS.directories);
    return data ? JSON.parse(data) : [];
  },

  getRootContents: (): DirectoryResponse[] => {
    const directories = directoryStorage.getAll();
    const roadmaps = roadmapStorage.getAll();

    return directories
      .filter((d) => !d.parentId)
      .map((dir) => ({
        ...dir,
        children: directories.filter((child) => child.parentId === dir.id),
        roadmaps: roadmaps.filter((r) => r.directoryId === dir.id),
      }));
  },

  create: (
    directory: Omit<DirectoryResponse, 'id' | 'createdAt' | 'updatedAt' | 'children' | 'roadmaps'>
  ): DirectoryResponse => {
    const directories = directoryStorage.getAll();
    const newDirectory: DirectoryResponse = {
      ...directory,
      id: generateId(),
      createdAt: getCurrentTimestamp(),
      updatedAt: getCurrentTimestamp(),
      children: [],
      roadmaps: [],
    };

    directories.push(newDirectory);
    localStorage.setItem(STORAGE_KEYS.directories, JSON.stringify(directories));
    return newDirectory;
  },

  update: (id: string, updates: Partial<DirectoryResponse>): DirectoryResponse => {
    const directories = directoryStorage.getAll();
    const index = directories.findIndex((d) => d.id === id);

    if (index === -1) {
      throw new Error(`Directory with id ${id} not found`);
    }

    directories[index] = {
      ...directories[index],
      ...updates,
      id,
      updatedAt: getCurrentTimestamp(),
    };

    localStorage.setItem(STORAGE_KEYS.directories, JSON.stringify(directories));
    return directories[index];
  },

  delete: (id: string): void => {
    const directories = directoryStorage.getAll();
    const filtered = directories.filter((d) => d.id !== id);
    localStorage.setItem(STORAGE_KEYS.directories, JSON.stringify(filtered));
  },
};

// Clear all local storage data and reset
export const clearAllData = () => {
  localStorage.removeItem(STORAGE_KEYS.roadmaps);
  localStorage.removeItem(STORAGE_KEYS.nodes);
  localStorage.removeItem(STORAGE_KEYS.directories);
  localStorage.removeItem(STORAGE_KEYS.lastId);
  console.log('All local storage data cleared');
};

// Initialize with sample data if empty
export const initializeSampleData = () => {
  console.log('Initializing sample data, current roadmaps:', roadmapStorage.getAll().length);
  if (roadmapStorage.getAll().length === 0) {
    // Create sample roadmaps
    const sampleRoadmap1 = roadmapStorage.create({
      title: 'Product Launch Roadmap',
      description: 'Complete roadmap for launching our new product',
    });

    const sampleRoadmap2 = roadmapStorage.create({
      title: 'Technical Architecture',
      description: 'System architecture and technical implementation plan',
    });

    // Create sample nodes for first roadmap
    nodeStorage.create(sampleRoadmap1.id, {
      title: 'Market Research',
      description: 'Conduct comprehensive market analysis',
      type: 'milestone',
      position: { x: 100, y: 100 },
      data: { progress: 100, dueDate: '2024-12-01' },
    });

    nodeStorage.create(sampleRoadmap1.id, {
      title: 'Product Design',
      description: 'Create initial product designs and prototypes',
      type: 'default',
      position: { x: 300, y: 100 },
      data: { status: 'in_progress' },
    });

    nodeStorage.create(sampleRoadmap1.id, {
      title: 'User Testing',
      description: 'Conduct user testing sessions',
      type: 'task',
      position: { x: 500, y: 100 },
      data: { completed: false, priority: 'high', assignee: 'designer' },
    });

    // Create sample nodes for second roadmap
    nodeStorage.create(sampleRoadmap2.id, {
      title: 'Database Design',
      description: 'Design the database schema',
      type: 'milestone',
      position: { x: 150, y: 150 },
      data: { progress: 75 },
    });

    nodeStorage.create(sampleRoadmap2.id, {
      title: 'API Development',
      description: 'Implement REST API endpoints',
      type: 'task',
      position: { x: 350, y: 150 },
      data: { completed: false, priority: 'medium', assignee: 'backend' },
    });
  }
};
