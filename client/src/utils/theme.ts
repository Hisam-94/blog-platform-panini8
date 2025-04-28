// Theme inspired by Panini8's website (https://panini8.com/)

const theme = {
  colors: {
    primary: "#4253FF", // Primary blue color from Panini8
    secondary: "#21DDBC", // Green accent color from Panini8
    accent: "#FFA026", // Orange accent color from Panini8
    background: "#FFFFFF", // White background
    card: "#F7F9FC", // Light grey for cards
    text: {
      primary: "#16174A", // Dark blue text color
      secondary: "#5F6368", // Secondary text color
      light: "#FFFFFF", // White text for dark backgrounds
    },
    border: "#E1E4EA", // Light grey border
    error: "#F04438", // Red for errors
    success: "#21DDBC", // Green for success
    warning: "#FFA026", // Yellow for warnings
    gradient: {
      // Blue gradient
      blue: "linear-gradient(45deg, #4253FF, #623BFF)",
      // Green gradient
      green: "linear-gradient(45deg, #1FC7A9, #21DDBC)",
      // Purple gradient
      purple: "linear-gradient(45deg, #7233E9, #A437FE)",
      // Orange gradient
      orange: "linear-gradient(45deg, #FF9209, #FFA026)",
    },
  },
  fonts: {
    body: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    heading:
      "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    code: "source-code-pro, Menlo, Monaco, Consolas, 'Courier New', monospace",
  },
  fontSizes: {
    xs: "0.75rem", // 12px
    sm: "0.875rem", // 14px
    md: "1rem", // 16px
    lg: "1.125rem", // 18px
    xl: "1.25rem", // 20px
    "2xl": "1.5rem", // 24px
    "3xl": "1.875rem", // 30px
    "4xl": "2.25rem", // 36px
    "5xl": "3rem", // 48px
  },
  fontWeights: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  lineHeights: {
    normal: "normal",
    none: 1,
    tight: 1.25,
    base: 1.5,
    loose: 2,
  },
  space: {
    xs: "0.25rem", // 4px
    sm: "0.5rem", // 8px
    md: "1rem", // 16px
    lg: "1.5rem", // 24px
    xl: "2rem", // 32px
    "2xl": "2.5rem", // 40px
    "3xl": "3rem", // 48px
  },
  radii: {
    none: "0",
    sm: "0.125rem", // 2px
    md: "0.25rem", // 4px
    lg: "0.5rem", // 8px
    xl: "1rem", // 16px
    full: "9999px",
  },
  shadows: {
    sm: "0 1px 3px rgba(0, 0, 0, 0.1)",
    md: "0 4px 6px rgba(0, 0, 0, 0.1)",
    lg: "0 10px 15px rgba(0, 0, 0, 0.1)",
    xl: "0 20px 25px rgba(0, 0, 0, 0.1)",
  },
  breakpoints: {
    xs: "0px",
    sm: "576px",
    md: "768px",
    lg: "992px",
    xl: "1200px",
    "2xl": "1400px",
  },
  transitions: {
    fast: "0.2s ease",
    normal: "0.3s ease",
    slow: "0.5s ease",
  },
};

export default theme;
