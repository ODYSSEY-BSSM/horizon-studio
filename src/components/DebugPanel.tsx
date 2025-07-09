import React from 'react';
import styled from '@emotion/styled';
import { useRoadmapStore } from '../stores/roadmapStore';

const DebugContainer = styled.div`
  position: fixed;
  bottom: 16px;
  left: 16px;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 12px;
  border-radius: 8px;
  font-size: 12px;
  max-width: 300px;
  z-index: 1000;
`;

const DebugItem = styled.div`
  margin-bottom: 4px;
`;

export const DebugPanel: React.FC = () => {
  const { roadmaps, nodes, edges, currentRoadmap } = useRoadmapStore();

  const isLocalMode =
    import.meta.env.VITE_USE_LOCAL_API === 'true' || !import.meta.env.VITE_API_URL;

  return (
    <DebugContainer>
      <DebugItem>
        <strong>Debug Info:</strong>
      </DebugItem>
      <DebugItem>Mode: {isLocalMode ? 'Local' : 'API'}</DebugItem>
      <DebugItem>Roadmaps: {roadmaps.length}</DebugItem>
      <DebugItem>Nodes: {nodes.length}</DebugItem>
      <DebugItem>Edges: {edges.length}</DebugItem>
      <DebugItem>Current: {currentRoadmap?.title || 'None'}</DebugItem>
      <DebugItem>
        Storage:{' '}
        {typeof window !== 'undefined' && localStorage.getItem('horizon-studio-roadmaps')
          ? 'Has data'
          : 'Empty'}
      </DebugItem>
    </DebugContainer>
  );
};
