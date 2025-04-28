import React, { InputHTMLAttributes } from "react";
import styled from "styled-components";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
}

const InputContainer = styled.div<{ fullWidth?: boolean }>`
  display: flex;
  flex-direction: column;
  margin-bottom: ${({ theme }) => theme.space.md};
  width: ${({ fullWidth }) => (fullWidth ? "100%" : "auto")};
`;

const InputLabel = styled.label`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  margin-bottom: ${({ theme }) => theme.space.xs};
  color: ${({ theme }) => theme.colors.text.primary};
`;

const StyledInput = styled.input<{ hasError?: boolean }>`
  padding: ${({ theme }) => theme.space.sm} ${({ theme }) => theme.space.md};
  font-size: ${({ theme }) => theme.fontSizes.md};
  border: 1px solid
    ${({ theme, hasError }) =>
      hasError ? theme.colors.error : theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.full};
  background-color: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text.primary};
  transition: all ${({ theme }) => theme.transitions.fast};
  box-shadow: ${({ hasError, theme }) =>
    hasError ? `0 0 0 2px ${theme.colors.error}20` : "none"};

  &:focus {
    outline: none;
    border-color: ${({ theme, hasError }) =>
      hasError ? theme.colors.error : theme.colors.primary};
    box-shadow: ${({ theme, hasError }) =>
      hasError
        ? `0 0 0 3px ${theme.colors.error}30`
        : `0 0 0 3px ${theme.colors.primary}30`};
  }

  &::placeholder {
    color: ${({ theme }) => theme.colors.text.secondary};
  }

  &:disabled {
    background-color: ${({ theme }) => theme.colors.card};
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.div`
  color: ${({ theme }) => theme.colors.error};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  margin-top: ${({ theme }) => theme.space.xs};
`;

const Input: React.FC<InputProps> = ({
  label,
  error,
  fullWidth = false,
  id,
  ...props
}) => {
  // Generate a unique ID if none is provided
  const inputId = id || `input-${Math.random().toString(36).substring(2, 9)}`;

  return (
    <InputContainer fullWidth={fullWidth}>
      {label && <InputLabel htmlFor={inputId}>{label}</InputLabel>}
      <StyledInput id={inputId} hasError={!!error} {...props} />
      {error && <ErrorMessage>{error}</ErrorMessage>}
    </InputContainer>
  );
};

export default Input;
