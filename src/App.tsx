import { useState, memo, lazy, Suspense } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import styled from '@emotion/styled';
import { RoadmapManager } from './components/RoadmapManager';
import { LoadingSpinner } from './components/LoadingSpinner';
import { LocalModeIndicator } from './components/LocalModeIndicator';
import { ErrorBoundary } from './components/ErrorBoundary';
import { DebugPanel } from './components/DebugPanel';
import { useRoadmapStore } from './stores/roadmapStore';
import { useNodes } from './hooks/useRoadmapQueries';

// Lazy load heavy components
const RoadmapCanvas = lazy(() =>
  import('./components/RoadmapCanvas').then((module) => ({ default: module.RoadmapCanvas }))
);
const NodeEditor = lazy(() =>
  import('./components/NodeEditor').then((module) => ({ default: module.NodeEditor }))
);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
});

const AppContainer = styled.div`
  display: flex;
  height: 100vh;
  overflow: hidden;
`;

const MainContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  position: relative;
`;

const Toolbar = styled.div`
  background: white;
  border-bottom: 1px solid #e2e8f0;
  padding: 12px 24px;
  display: flex;
  align-items: center;
  gap: 12px;
`;

const ToolbarButton = styled.button`
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s ease;

  &:hover {
    background: #f1f5f9;
    border-color: #cbd5e1;
  }

  &:active {
    background: #e2e8f0;
  }
`;

const CanvasContainer = styled.div`
  flex: 1;
  position: relative;
  height: calc(100vh - 64px); /* Subtract toolbar height */
  overflow: hidden;
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #64748b;
  text-align: center;
`;

const EmptyStateTitle = styled.h2`
  margin: 0 0 16px 0;
  font-size: 24px;
  font-weight: 600;
`;

const EmptyStateDescription = styled.p`
  margin: 0;
  font-size: 16px;
  line-height: 1.5;
  max-width: 400px;
`;

const AppContent = memo(() => {
  const [selectedRoadmapId, setSelectedRoadmapId] = useState<string | null>(null);
  const [isNodeEditorOpen, setIsNodeEditorOpen] = useState(false);
  const { currentRoadmap } = useRoadmapStore();

  // Load nodes when roadmap is selected
  useNodes(selectedRoadmapId || '');

  const handleSelectRoadmap = (roadmapId: string) => {
    setSelectedRoadmapId(roadmapId);
  };

  const handleCreateNode = () => {
    if (selectedRoadmapId) {
      setIsNodeEditorOpen(true);
    }
  };

  const handleDoubleClickCanvas = () => {
    if (selectedRoadmapId) {
      setIsNodeEditorOpen(true);
    }
  };

  return (
    <AppContainer>
      <RoadmapManager onSelectRoadmap={handleSelectRoadmap} />

      <MainContent>
        {selectedRoadmapId ? (
          <>
            <Toolbar>
              <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 600 }}>
                {currentRoadmap?.title || '로드맵'}
              </h2>
              <ToolbarButton onClick={handleCreateNode}>+ 노드 추가</ToolbarButton>
              <ToolbarButton onClick={() => window.location.reload()}>새로고침</ToolbarButton>
            </Toolbar>

            <CanvasContainer onDoubleClick={handleDoubleClickCanvas}>
              <ErrorBoundary>
                <Suspense fallback={<LoadingSpinner />}>
                  <RoadmapCanvas roadmapId={selectedRoadmapId} />
                </Suspense>
              </ErrorBoundary>
            </CanvasContainer>

            <Suspense fallback={<div>로딩 중...</div>}>
              <NodeEditor
                isOpen={isNodeEditorOpen}
                onClose={() => setIsNodeEditorOpen(false)}
                roadmapId={selectedRoadmapId}
              />
            </Suspense>
          </>
        ) : (
          <EmptyState>
            <EmptyStateTitle>Horizon Studio에 오신 것을 환영합니다</EmptyStateTitle>
            <EmptyStateDescription>
              프로젝트 타임라인을 시각화하려면 사이드바에서 로드맵을 선택하거나, 새로운 로드맵을
              만들어 시작하세요.
            </EmptyStateDescription>
          </EmptyState>
        )}
      </MainContent>

      <LocalModeIndicator />
      <DebugPanel />

      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#363636',
            color: '#fff',
          },
        }}
      />
    </AppContainer>
  );
});

const App = memo(() => {
  console.log('App component is rendering');

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AppContent />
      </QueryClientProvider>
    </ErrorBoundary>
  );
});

export default App;
