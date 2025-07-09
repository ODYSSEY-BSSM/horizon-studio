import type React from 'react';
import styled from '@emotion/styled';
import { motion, AnimatePresence } from 'framer-motion';
import { useRoadmapStore } from '../stores/roadmapStore';
import { RoadmapRequestSchema } from '../schemas/apiSchemas';
import {
  useRoadmaps,
  useCreateRoadmap,
  useUpdateRoadmap,
  useDeleteRoadmap,
  useToggleFavorite,
} from '../hooks/useRoadmapQueries';
import { LoadingSpinner } from './LoadingSpinner';
import toast from 'react-hot-toast';

const ManagerContainer = styled.div`
  padding: 24px;
  background: #f8fafc;
  border-right: 1px solid #e2e8f0;
  width: 350px;
  height: 100vh;
  overflow-y: auto;
`;

const Header = styled.div`
  display: flex;
  justify-content: between;
  align-items: center;
  margin-bottom: 24px;
`;

const Title = styled.h1`
  margin: 0;
  font-size: 24px;
  font-weight: 700;
  color: #1e293b;
`;

const CreateButton = styled.button`
  background: #4f46e5;
  color: white;
  border: none;
  padding: 10px 16px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-left: auto;

  &:hover {
    background: #4338ca;
  }
`;

const RoadmapList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const RoadmapCard = styled(motion.div)<{ isActive: boolean }>`
  background: white;
  border: 2px solid ${(props) => (props.isActive ? '#4f46e5' : '#e2e8f0')};
  border-radius: 12px;
  padding: 16px;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);

  &:hover {
    border-color: #4f46e5;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
`;

const RoadmapTitle = styled.h3`
  margin: 0 0 8px 0;
  font-size: 16px;
  font-weight: 600;
  color: #1e293b;
`;

const RoadmapDescription = styled.p`
  margin: 0;
  font-size: 14px;
  color: #64748b;
  line-height: 1.4;
`;

const RoadmapMeta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 12px;
`;

const FavoriteButton = styled.button<{ isFavorite: boolean }>`
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: ${(props) => (props.isFavorite ? '#f59e0b' : '#9ca3af')};
  transition: color 0.2s ease;

  &:hover {
    color: #f59e0b;
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 8px;
`;

const ActionButton = styled.button<{ variant?: 'edit' | 'delete' }>`
  background: none;
  border: none;
  padding: 4px 8px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  transition: all 0.2s ease;
  
  ${(props) => {
    switch (props.variant) {
      case 'edit':
        return `
          color: #4f46e5;
          &:hover { background: #eef2ff; }
        `;
      case 'delete':
        return `
          color: #ef4444;
          &:hover { background: #fef2f2; }
        `;
      default:
        return `
          color: #6b7280;
          &:hover { background: #f3f4f6; }
        `;
    }
  }}
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 48px 24px;
  color: #64748b;
`;

interface RoadmapManagerProps {
  onSelectRoadmap: (roadmapId: string) => void;
}

export const RoadmapManager: React.FC<RoadmapManagerProps> = ({ onSelectRoadmap }) => {
  const { roadmaps, currentRoadmap, setCurrentRoadmap } = useRoadmapStore();

  // Use React Query hooks
  const { isLoading } = useRoadmaps();
  const createRoadmapMutation = useCreateRoadmap();
  const updateRoadmapMutation = useUpdateRoadmap();
  const deleteRoadmapMutation = useDeleteRoadmap();
  const toggleFavoriteMutation = useToggleFavorite();

  const handleCreateRoadmap = async () => {
    const title = prompt('로드맵 제목을 입력하세요:');
    if (!title) return;

    const description = prompt('로드맵 설명을 입력하세요 (선택사항):');

    try {
      const roadmapData = { title, description: description || undefined };
      const validatedData = RoadmapRequestSchema.parse(roadmapData);

      createRoadmapMutation.mutate(validatedData);
    } catch (error) {
      console.error('Error creating roadmap:', error);
      toast.error('로드맵 생성에 실패했습니다');
    }
  };

  const handleSelectRoadmap = (roadmapId: string) => {
    const roadmap = roadmaps.find((r) => r.id === roadmapId);
    if (roadmap) {
      setCurrentRoadmap(roadmap);
      console.log('Selected roadmap:', roadmap); // Debug log
      onSelectRoadmap(roadmapId);
    } else {
      console.log('Roadmap not found:', roadmapId, 'Available:', roadmaps); // Debug log
    }
  };

  const handleToggleFavorite = (e: React.MouseEvent, roadmapId: string) => {
    e.stopPropagation();
    toggleFavoriteMutation.mutate(roadmapId);
  };

  const handleEditRoadmap = (e: React.MouseEvent, roadmapId: string) => {
    e.stopPropagation();
    const roadmap = roadmaps.find((r) => r.id === roadmapId);
    if (!roadmap) return;

    const title = prompt('로드맵 제목 수정:', roadmap.title);
    if (!title) return;

    const description = prompt('로드맵 설명 수정:', roadmap.description || '');

    try {
      updateRoadmapMutation.mutate({
        id: roadmapId,
        data: { title, description: description || undefined },
      });
    } catch (error) {
      console.error('Error updating roadmap:', error);
      toast.error('로드맵 업데이트에 실패했습니다');
    }
  };

  const handleDeleteRoadmap = (e: React.MouseEvent, roadmapId: string) => {
    e.stopPropagation();
    const confirmed = window.confirm('정말로 이 로드맵을 삭제하시겠습니까?');
    if (!confirmed) return;

    deleteRoadmapMutation.mutate(roadmapId);
  };

  if (isLoading) {
    return (
      <ManagerContainer>
        <Header>
          <Title>로드맵</Title>
        </Header>
        <LoadingSpinner text="로드맵 로딩 중..." />
      </ManagerContainer>
    );
  }

  return (
    <ManagerContainer>
      <Header>
        <Title>로드맵</Title>
        <CreateButton onClick={handleCreateRoadmap}>+ 새로 만들기</CreateButton>
      </Header>

      <RoadmapList>
        <AnimatePresence>
          {!roadmaps || roadmaps.length === 0 ? (
            <EmptyState>
              <p>아직 로드맵이 없습니다.</p>
              <p>첫 번째 로드맵을 만들어 시작해보세요!</p>
            </EmptyState>
          ) : (
            roadmaps.map((roadmap) => (
              <RoadmapCard
                key={roadmap.id}
                isActive={currentRoadmap?.id === roadmap.id}
                onClick={() => handleSelectRoadmap(roadmap.id)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                whileHover={{ scale: 1.02 }}
              >
                <RoadmapTitle>{roadmap.title}</RoadmapTitle>
                {roadmap.description && (
                  <RoadmapDescription>{roadmap.description}</RoadmapDescription>
                )}
                <RoadmapMeta>
                  <FavoriteButton
                    isFavorite={roadmap.isFavorite}
                    onClick={(e) => handleToggleFavorite(e, roadmap.id)}
                  >
                    {roadmap.isFavorite ? '★' : '☆'}
                  </FavoriteButton>
                  <ActionButtons>
                    <ActionButton variant="edit" onClick={(e) => handleEditRoadmap(e, roadmap.id)}>
                      수정
                    </ActionButton>
                    <ActionButton
                      variant="delete"
                      onClick={(e) => handleDeleteRoadmap(e, roadmap.id)}
                    >
                      삭제
                    </ActionButton>
                  </ActionButtons>
                </RoadmapMeta>
              </RoadmapCard>
            ))
          )}
        </AnimatePresence>
      </RoadmapList>
    </ManagerContainer>
  );
};
