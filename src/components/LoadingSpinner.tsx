import React from 'react';
import styled from '@emotion/styled';
import { motion } from 'framer-motion';

const SpinnerContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48px;
  color: #6b7280;
`;

const Spinner = styled(motion.div)`
  width: 32px;
  height: 32px;
  border: 3px solid #e5e7eb;
  border-top: 3px solid #4f46e5;
  border-radius: 50%;
  margin-bottom: 16px;
`;

const LoadingText = styled.p`
  margin: 0;
  font-size: 14px;
  font-weight: 500;
`;

interface LoadingSpinnerProps {
  text?: string;
  size?: 'small' | 'medium' | 'large';
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  text = '로딩 중...',
  size = 'medium',
}) => {
  const spinnerSize = {
    small: '20px',
    medium: '32px',
    large: '48px',
  }[size];

  return (
    <SpinnerContainer>
      <Spinner
        style={{ width: spinnerSize, height: spinnerSize }}
        animate={{ rotate: 360 }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: 'linear',
        }}
      />
      <LoadingText>{text}</LoadingText>
    </SpinnerContainer>
  );
};
