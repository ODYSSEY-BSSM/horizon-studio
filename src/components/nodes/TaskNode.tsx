import React from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';
import styled from '@emotion/styled';
import { motion } from 'framer-motion';

const NodeContainer = styled(motion.div)`
  padding: 14px;
  background: linear-gradient(135deg, #4ecdc4 0%, #44a08d 100%);
  color: white;
  border-radius: 10px;
  min-width: 180px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border: 2px solid transparent;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  &.selected {
    border-color: #26a69a;
    box-shadow: 0 0 0 3px rgba(38, 166, 154, 0.2);
  }
`;

const TaskHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
`;

const TaskCheckbox = styled.div<{ completed: boolean }>`
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.7);
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${(props) => (props.completed ? 'rgba(255, 255, 255, 0.9)' : 'transparent')};
  color: ${(props) => (props.completed ? '#26a69a' : 'transparent')};
  font-weight: bold;
  font-size: 14px;
  transition: all 0.2s ease;
`;

const NodeTitle = styled.h3<{ completed: boolean }>`
  margin: 0;
  font-size: 15px;
  font-weight: 600;
  line-height: 1.3;
  flex: 1;
  margin-left: 8px;
  text-decoration: ${(props) => (props.completed ? 'line-through' : 'none')};
  opacity: ${(props) => (props.completed ? 0.8 : 1)};
`;

const NodeDescription = styled.p`
  margin: 0;
  font-size: 13px;
  opacity: 0.9;
  line-height: 1.4;
`;

const TaskMeta = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 8px;
  font-size: 12px;
  opacity: 0.8;
`;

const PriorityBadge = styled.span<{ priority: string }>`
  display: inline-block;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 500;
  background: ${(props) => {
    switch (props.priority) {
      case 'high':
        return '#ef4444';
      case 'medium':
        return '#f59e0b';
      case 'low':
        return '#6b7280';
      default:
        return '#6b7280';
    }
  }};
`;

interface TaskNodeData {
  title: string;
  description?: string;
  completed?: boolean;
  priority?: 'high' | 'medium' | 'low';
  assignee?: string;
}

export const TaskNode: React.FC<NodeProps> = ({ data, selected }) => {
  const nodeData = data as unknown as TaskNodeData;
  const { title, description, completed = false, priority = 'medium', assignee } = nodeData;

  const handleStyle = {
    background: '#26a69a',
    width: '12px',
    height: '12px',
    border: '2px solid #ffffff',
    borderRadius: '50%',
    zIndex: 10,
  };

  const sourceHandleStyle = {
    ...handleStyle,
    background: '#2196f3',
  };

  return (
    <>
      <Handle type="target" position={Position.Top} style={handleStyle} isConnectable={true} />
      <NodeContainer
        className={selected ? 'selected' : ''}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
        whileHover={{ scale: 1.02 }}
      >
        <TaskHeader>
          <TaskCheckbox completed={completed}>{completed && '✓'}</TaskCheckbox>
          <NodeTitle completed={completed}>{title}</NodeTitle>
        </TaskHeader>
        {description && <NodeDescription>{description}</NodeDescription>}
        <TaskMeta>
          <PriorityBadge priority={priority}>{priority}</PriorityBadge>
          {assignee && <span>@{assignee}</span>}
        </TaskMeta>
      </NodeContainer>
      <Handle
        type="source"
        position={Position.Bottom}
        style={sourceHandleStyle}
        isConnectable={true}
      />
    </>
  );
};
