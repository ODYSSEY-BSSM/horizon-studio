import React from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';
import styled from '@emotion/styled';
import { motion } from 'framer-motion';

const NodeContainer = styled(motion.div)`
  padding: 16px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 12px;
  min-width: 200px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  border: 2px solid transparent;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
  }

  &.selected {
    border-color: #4f46e5;
    box-shadow: 0 0 0 4px rgba(79, 70, 229, 0.2);
  }
`;

const NodeTitle = styled.h3`
  margin: 0 0 8px 0;
  font-size: 16px;
  font-weight: 600;
  line-height: 1.3;
`;

const NodeDescription = styled.p`
  margin: 0;
  font-size: 14px;
  opacity: 0.9;
  line-height: 1.4;
`;

const NodeBadge = styled.span`
  display: inline-block;
  padding: 4px 8px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
  margin-top: 8px;
`;

interface RoadmapNodeData {
  title: string;
  description?: string;
  status?: 'pending' | 'in_progress' | 'completed';
}

export const RoadmapNode: React.FC<NodeProps> = ({ data, selected }) => {
  const nodeData = data as unknown as RoadmapNodeData;
  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'completed':
        return '#10b981';
      case 'in_progress':
        return '#f59e0b';
      default:
        return '#6b7280';
    }
  };

  const handleStyle = {
    background: '#4f46e5',
    width: '12px',
    height: '12px',
    border: '2px solid #ffffff',
    borderRadius: '50%',
    zIndex: 10,
  };

  const sourceHandleStyle = {
    ...handleStyle,
    background: '#10b981',
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
        <NodeTitle>{nodeData.title}</NodeTitle>
        {nodeData.description && <NodeDescription>{nodeData.description}</NodeDescription>}
        {nodeData.status && (
          <NodeBadge style={{ backgroundColor: getStatusColor(nodeData.status) }}>
            {nodeData.status.replace('_', ' ')}
          </NodeBadge>
        )}
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
