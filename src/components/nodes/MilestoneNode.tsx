import React from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';
import styled from '@emotion/styled';
import { motion } from 'framer-motion';

const NodeContainer = styled(motion.div)`
  padding: 20px;
  background: linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%);
  color: white;
  border-radius: 16px;
  min-width: 220px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  border: 2px solid transparent;
  cursor: pointer;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: -2px;
    left: -2px;
    right: -2px;
    bottom: -2px;
    background: linear-gradient(135deg, #ff8a80, #ff5722);
    border-radius: 18px;
    z-index: -1;
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
    
    &::before {
      opacity: 1;
    }
  }

  &.selected {
    border-color: #ff5722;
    box-shadow: 0 0 0 4px rgba(255, 87, 34, 0.2);
  }
`;

const MilestoneIcon = styled.div`
  width: 24px;
  height: 24px;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 12px;
  font-size: 12px;
  font-weight: bold;
`;

const NodeTitle = styled.h3`
  margin: 0 0 8px 0;
  font-size: 18px;
  font-weight: 700;
  line-height: 1.3;
`;

const NodeDescription = styled.p`
  margin: 0;
  font-size: 14px;
  opacity: 0.95;
  line-height: 1.4;
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 6px;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 3px;
  margin-top: 12px;
  overflow: hidden;
`;

const ProgressFill = styled.div<{ progress: number }>`
  height: 100%;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 3px;
  width: ${(props) => props.progress}%;
  transition: width 0.3s ease;
`;

interface MilestoneNodeData {
  title: string;
  description?: string;
  progress?: number;
  dueDate?: string;
}

export const MilestoneNode: React.FC<NodeProps> = ({ data, selected }) => {
  const nodeData = data as unknown as MilestoneNodeData;
  const progress = nodeData.progress || 0;

  const handleStyle = {
    background: '#ff5722',
    width: '12px',
    height: '12px',
    border: '2px solid #ffffff',
    borderRadius: '50%',
    zIndex: 10,
  };

  const sourceHandleStyle = {
    ...handleStyle,
    background: '#4caf50',
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
        <MilestoneIcon>🏆</MilestoneIcon>
        <NodeTitle>{nodeData.title}</NodeTitle>
        {nodeData.description && <NodeDescription>{nodeData.description}</NodeDescription>}
        {nodeData.dueDate && (
          <NodeDescription style={{ marginTop: '8px', fontSize: '12px' }}>
            Due: {new Date(nodeData.dueDate).toLocaleDateString()}
          </NodeDescription>
        )}
        <ProgressBar>
          <ProgressFill progress={progress} />
        </ProgressBar>
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
