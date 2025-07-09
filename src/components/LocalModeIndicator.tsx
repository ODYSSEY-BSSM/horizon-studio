import React from 'react';
import styled from '@emotion/styled';
import { motion } from 'framer-motion';

const IndicatorContainer = styled(motion.div)`
  position: fixed;
  top: 16px;
  right: 16px;
  background: linear-gradient(135deg, #10b981, #059669);
  color: white;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  z-index: 1000;
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
  display: flex;
  align-items: center;
  gap: 8px;
`;

const StatusDot = styled.div`
  width: 8px;
  height: 8px;
  background: #ffffff;
  border-radius: 50%;
  animation: pulse 2s infinite;

  @keyframes pulse {
    0% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
    100% {
      opacity: 1;
    }
  }
`;

const isLocalMode = import.meta.env.VITE_USE_LOCAL_API === 'true' || !import.meta.env.VITE_API_URL;

export const LocalModeIndicator: React.FC = () => {
  // Always show the indicator to show current mode
  const modeText = isLocalMode ? '로컬 모드 (개발용)' : '서버 모드';
  const bgColor = isLocalMode
    ? 'linear-gradient(135deg, #10b981, #059669)'
    : 'linear-gradient(135deg, #3b82f6, #1d4ed8)';

  return (
    <IndicatorContainer
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      style={{ background: bgColor }}
    >
      <StatusDot />
      {modeText}
    </IndicatorContainer>
  );
};
