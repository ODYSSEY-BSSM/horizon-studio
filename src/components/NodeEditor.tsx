import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { motion, AnimatePresence } from 'framer-motion';
import { useRoadmapStore } from '../stores/roadmapStore';
import { NodeRequestSchema, type NodeType } from '../schemas/apiSchemas';
import { useCreateNode, useUpdateNode, useDeleteNode } from '../hooks/useRoadmapQueries';
import toast from 'react-hot-toast';

const EditorOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const EditorPanel = styled(motion.div)`
  background: white;
  border-radius: 16px;
  padding: 24px;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
`;

const EditorHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;

const EditorTitle = styled.h2`
  margin: 0;
  font-size: 24px;
  font-weight: 700;
  color: #1f2937;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #6b7280;
  padding: 4px;
  border-radius: 4px;
  transition: all 0.2s ease;

  &:hover {
    background: #f3f4f6;
    color: #374151;
  }
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: #374151;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 16px;
  transition: border-color 0.2s ease;

  &:focus {
    outline: none;
    border-color: #4f46e5;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 12px;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 16px;
  resize: vertical;
  min-height: 100px;
  transition: border-color 0.2s ease;

  &:focus {
    outline: none;
    border-color: #4f46e5;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 12px;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 16px;
  background: white;
  transition: border-color 0.2s ease;

  &:focus {
    outline: none;
    border-color: #4f46e5;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 24px;
`;

const Button = styled.button<{ variant?: 'primary' | 'secondary' | 'danger' }>`
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  
  ${(props) => {
    switch (props.variant) {
      case 'primary':
        return `
          background: #4f46e5;
          color: white;
          &:hover { background: #4338ca; }
        `;
      case 'danger':
        return `
          background: #ef4444;
          color: white;
          &:hover { background: #dc2626; }
        `;
      default:
        return `
          background: #f3f4f6;
          color: #374151;
          &:hover { background: #e5e7eb; }
        `;
    }
  }}
`;

interface NodeEditorProps {
  isOpen: boolean;
  onClose: () => void;
  roadmapId: string;
}

export const NodeEditor: React.FC<NodeEditorProps> = ({ isOpen, onClose, roadmapId }) => {
  const { selectedNode } = useRoadmapStore();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'default' as NodeType,
  });

  // Use mutation hooks
  const createNodeMutation = useCreateNode();
  const updateNodeMutation = useUpdateNode();
  const deleteNodeMutation = useDeleteNode();

  const isLoading =
    createNodeMutation.isPending || updateNodeMutation.isPending || deleteNodeMutation.isPending;

  useEffect(() => {
    if (selectedNode) {
      setFormData({
        title: (selectedNode.data as any)?.title || '',
        description: (selectedNode.data as any)?.description || '',
        type: (selectedNode.type as NodeType) || 'default',
      });
    } else {
      setFormData({
        title: '',
        description: '',
        type: 'default',
      });
    }
  }, [selectedNode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const nodeData = {
        ...formData,
        position: selectedNode?.position || { x: 100, y: 100 },
      };

      const validatedData = NodeRequestSchema.parse(nodeData);

      if (selectedNode) {
        // Update existing node
        updateNodeMutation.mutate(
          {
            roadmapId,
            nodeId: selectedNode.id,
            data: validatedData,
          },
          {
            onSuccess: () => {
              onClose();
            },
          }
        );
      } else {
        // Create new node
        createNodeMutation.mutate(
          {
            roadmapId,
            data: validatedData,
          },
          {
            onSuccess: () => {
              onClose();
            },
          }
        );
      }
    } catch (error) {
      console.error('Error saving node:', error);
      toast.error('노드 저장에 실패했습니다');
    }
  };

  const handleDelete = () => {
    if (!selectedNode) return;

    const confirmed = window.confirm('이 노드를 삭제하시겠습니까?');
    if (!confirmed) return;

    deleteNodeMutation.mutate(
      {
        roadmapId,
        nodeId: selectedNode.id,
      },
      {
        onSuccess: () => {
          onClose();
        },
      }
    );
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <EditorOverlay
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <EditorPanel
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <EditorHeader>
              <EditorTitle>{selectedNode ? '노드 편집' : '노드 생성'}</EditorTitle>
              <CloseButton onClick={onClose}>×</CloseButton>
            </EditorHeader>

            <form onSubmit={handleSubmit}>
              <FormGroup>
                <Label htmlFor="title">제목</Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </FormGroup>

              <FormGroup>
                <Label htmlFor="description">설명</Label>
                <TextArea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                />
              </FormGroup>

              <FormGroup>
                <Label htmlFor="type">타입</Label>
                <Select id="type" name="type" value={formData.type} onChange={handleChange}>
                  <option value="default">기본</option>
                  <option value="milestone">마일스톤</option>
                  <option value="task">작업</option>
                </Select>
              </FormGroup>

              <ButtonGroup>
                {selectedNode && (
                  <Button
                    type="button"
                    variant="danger"
                    onClick={handleDelete}
                    disabled={isLoading}
                  >
                    삭제
                  </Button>
                )}
                <Button type="button" onClick={onClose} disabled={isLoading}>
                  취소
                </Button>
                <Button type="submit" variant="primary" disabled={isLoading}>
                  {isLoading ? '저장 중...' : selectedNode ? '수정' : '생성'}
                </Button>
              </ButtonGroup>
            </form>
          </EditorPanel>
        </EditorOverlay>
      )}
    </AnimatePresence>
  );
};
