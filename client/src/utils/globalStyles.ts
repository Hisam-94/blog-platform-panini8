import { createGlobalStyle } from "styled-components";
import theme from "./theme";

const GlobalStyles = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
  
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }
  
  html, body {
    height: 100%;
    width: 100%;
    font-family: ${theme.fonts.body};
    font-size: 16px;
    line-height: ${theme.lineHeights.base};
    color: ${theme.colors.text.primary};
    background-color: ${theme.colors.background};
    overflow-x: hidden;
  }
  
  #root {
    min-height: 100vh;
    width: 100%;
    display: flex;
    flex-direction: column;
  }
  
  .app {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    width: 100%;
    // margin-top: 35rem;
  }
  
  .main-content {
    flex: 1;
    width: 100%;
    padding: 0;
  }
  
  a {
    color: ${theme.colors.primary};
    text-decoration: none;
    transition: all ${theme.transitions.fast};
    
    &:hover {
      color: ${theme.colors.secondary};
      transform: translateY(-2px);
    }
  }
  
  h1, h2, h3, h4, h5, h6 {
    font-family: ${theme.fonts.heading};
    font-weight: ${theme.fontWeights.bold};
    line-height: ${theme.lineHeights.tight};
    margin-bottom: ${theme.space.md};
    color: ${theme.colors.text.primary};
  }
  
  h1 {
    font-size: ${theme.fontSizes["4xl"]};
  }
  
  h2 {
    font-size: ${theme.fontSizes["3xl"]};
  }
  
  h3 {
    font-size: ${theme.fontSizes["2xl"]};
  }
  
  h4 {
    font-size: ${theme.fontSizes.xl};
  }
  
  h5 {
    font-size: ${theme.fontSizes.lg};
  }
  
  h6 {
    font-size: ${theme.fontSizes.md};
  }
  
  p {
    margin-bottom: ${theme.space.md};
    color: ${theme.colors.text.secondary};
    line-height: 1.7;
  }
  
  button {
    font-family: ${theme.fonts.body};
    cursor: pointer;
    transition: all ${theme.transitions.fast};
  }
  
  img {
    max-width: 100%;
    height: auto;
  }
  
  ul, ol {
    margin-bottom: ${theme.space.md};
    padding-left: ${theme.space.xl};
    color: ${theme.colors.text.secondary};
  }
  
  code {
    font-family: ${theme.fonts.code};
    background-color: ${theme.colors.card};
    padding: ${theme.space.xs} ${theme.space.sm};
    border-radius: ${theme.radii.md};
    color: ${theme.colors.primary};
  }
  
  input, textarea, select {
    font-family: ${theme.fonts.body};
    font-size: ${theme.fontSizes.md};
    transition: all ${theme.transitions.fast};
  }
`;

export default GlobalStyles;
