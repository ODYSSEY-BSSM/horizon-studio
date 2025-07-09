import { z } from 'zod';

// Base schemas
const PositionSchema = z.object({
  x: z.number(),
  y: z.number(),
});

const NodeTypeSchema = z.enum(['default', 'milestone', 'task']);

// Request schemas
export const RoadmapRequestSchema = z.object({
  title: z.string().min(1, '제목은 필수입니다'),
  description: z.string().optional(),
  thumbnail: z.instanceof(File).optional(),
  directoryId: z.string().optional(),
});

export const NodeRequestSchema = z.object({
  title: z.string().min(1, '제목은 필수입니다'),
  description: z.string().optional(),
  type: NodeTypeSchema,
  position: PositionSchema,
  data: z.record(z.any()).optional(),
});

export const DirectoryRequestSchema = z.object({
  name: z.string().min(1, '이름은 필수입니다'),
  parentId: z.string().optional(),
});

// Response schemas
export const RoadmapResponseSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().optional(),
  thumbnail: z.string().optional(),
  directoryId: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
  isFavorite: z.boolean(),
  lastAccessedAt: z.string().optional(),
});

export const NodeResponseSchema = z.object({
  id: z.string(),
  roadmapId: z.string(),
  title: z.string(),
  description: z.string().optional(),
  type: NodeTypeSchema,
  position: PositionSchema,
  data: z.record(z.any()).optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

// Type exports (defined first for recursive types)
export type RoadmapRequest = z.infer<typeof RoadmapRequestSchema>;
export type NodeRequest = z.infer<typeof NodeRequestSchema>;
export type DirectoryRequest = z.infer<typeof DirectoryRequestSchema>;
export type RoadmapResponse = z.infer<typeof RoadmapResponseSchema>;
export type NodeResponse = z.infer<typeof NodeResponseSchema>;
export type NodeType = z.infer<typeof NodeTypeSchema>;

export interface DirectoryResponse {
  id: string;
  name: string;
  parentId?: string;
  createdAt: string;
  updatedAt: string;
  children: DirectoryResponse[];
  roadmaps: RoadmapResponse[];
}

export const DirectoryResponseSchema: z.ZodType<DirectoryResponse> = z.object({
  id: z.string(),
  name: z.string(),
  parentId: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
  children: z.array(z.lazy(() => DirectoryResponseSchema)),
  roadmaps: z.array(RoadmapResponseSchema),
});

export const ApiErrorSchema = z.object({
  message: z.string(),
  code: z.string(),
  details: z.record(z.any()).optional(),
});

export type ApiError = z.infer<typeof ApiErrorSchema>;
