import React, { Component, type ReactNode } from 'react';
import styled from '@emotion/styled';

const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  padding: 24px;
  text-align: center;
  color: #ef4444;
`;

const ErrorTitle = styled.h1`
  font-size: 24px;
  font-weight: 700;
  margin: 0 0 16px 0;
`;

const ErrorMessage = styled.p`
  font-size: 16px;
  margin: 0 0 24px 0;
  max-width: 600px;
  line-height: 1.5;
`;

const RetryButton = styled.button`
  background: #4f46e5;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #4338ca;
  }
`;

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      return (
        <ErrorContainer>
          <ErrorTitle>문제가 발생했습니다</ErrorTitle>
          <ErrorMessage>
            {this.state.error?.message ||
              '애플리케이션을 렌더링하는 중 예기치 않은 오류가 발생했습니다.'}
          </ErrorMessage>
          <RetryButton onClick={this.handleRetry}>다시 시도</RetryButton>
        </ErrorContainer>
      );
    }

    return this.props.children;
  }
}
