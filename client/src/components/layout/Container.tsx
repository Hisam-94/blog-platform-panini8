import React, { ReactNode } from "react";
import styled from "styled-components";

interface ContainerProps {
  children: ReactNode;
  maxWidth?: string;
  padding?: string;
  withBackground?: boolean;
  fullWidth?: boolean;
}

const StyledContainer = styled.div<{
  maxWidth?: string;
  padding?: string;
  withBackground?: boolean;
  fullWidth?: boolean;
}>`
  width: 100%;
  max-width: ${({ maxWidth, fullWidth }) =>
    fullWidth ? "100%" : maxWidth || "1200px"};
  margin: 0 auto;
  padding: ${({ padding, theme }) => padding || theme.space.md};
  background-color: ${({ withBackground, theme }) =>
    withBackground ? theme.colors.card : "transparent"};
  border-radius: ${({ withBackground, theme }) =>
    withBackground ? theme.radii.lg : "0"};
  box-shadow: ${({ withBackground, theme }) =>
    withBackground ? theme.shadows.sm : "none"};

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: ${({ theme }) => theme.space.md};
  }
`;

const Container: React.FC<ContainerProps> = ({
  children,
  maxWidth,
  padding,
  withBackground = false,
  fullWidth = false,
}) => {
  return (
    <StyledContainer
      maxWidth={maxWidth}
      padding={padding}
      withBackground={withBackground}
      fullWidth={fullWidth}>
      {children}
    </StyledContainer>
  );
};

export default Container;
