export interface RoadmapRequest {
  title: string;
  description?: string;
  thumbnail?: File;
  directoryId?: string;
}

export interface RoadmapResponse {
  id: string;
  title: string;
  description?: string;
  thumbnail?: string;
  directoryId?: string;
  createdAt: string;
  updatedAt: string;
  isFavorite: boolean;
  lastAccessedAt?: string;
}

export interface NodeRequest {
  title: string;
  description?: string;
  type: 'default' | 'milestone' | 'task';
  position: { x: number; y: number };
  data?: Record<string, unknown>;
}

export interface NodeResponse {
  id: string;
  roadmapId: string;
  title: string;
  description?: string;
  type: 'default' | 'milestone' | 'task';
  position: { x: number; y: number };
  data?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface DirectoryRequest {
  name: string;
  parentId?: string;
}

export interface DirectoryResponse {
  id: string;
  name: string;
  parentId?: string;
  createdAt: string;
  updatedAt: string;
  children: DirectoryResponse[];
  roadmaps: RoadmapResponse[];
}

export interface ApiError {
  message: string;
  code: string;
  details?: Record<string, unknown>;
}
