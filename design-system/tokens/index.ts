/**
 * Design Tokens - 设计令牌
 * 基于大厂设计规范提取的核心变量
 */

// ==================== 颜色系统 ====================

// 主色调
export const colors = {
  // 品牌色
  primary: {
    50: '#e6f7ff',
    100: '#bae7ff',
    200: '#91d5ff',
    300: '#69c0ff',
    400: '#40a9ff',
    500: '#1890ff',  // 主色
    600: '#096dd9',
    700: '#0050b3',
    800: '#003a8c',
    900: '#002766',
  },
  
  // 成功色
  success: {
    50: '#f6ffed',
    100: '#d9f7be',
    200: '#b7eb8f',
    300: '#95de64',
    400: '#73d13d',
    500: '#52c41a',
    600: '#389e0d',
    700: '#237804',
    800: '#135200',
    900: '#092b00',
  },
  
  // 警告色
  warning: {
    50: '#fffbe6',
    100: '#fff1b8',
    200: '#ffe58f',
    300: '#ffd666',
    400: '#ffc53d',
    500: '#faad14',
    600: '#d48806',
    700: '#ad6800',
    800: '#874d00',
    900: '#613400',
  },
  
  // 错误色
  error: {
    50: '#fff1f0',
    100: '#ffccc7',
    200: '#ffa39e',
    300: '#ff7875',
    400: '#ff4d4f',
    500: '#f5222d',
    600: '#cf1322',
    700: '#a8071a',
    800: '#820014',
    900: '#5c0011',
  },
  
  // 中性色
  neutral: {
    0: '#ffffff',
    50: '#fafafa',
    100: '#f5f5f5',
    200: '#f0f0f0',
    300: '#e8e8e8',
    400: '#d9d9d9',
    500: '#bfbfbf',
    600: '#8c8c8c',
    700: '#595959',
    800: '#434343',
    900: '#262626',
    1000: '#000000',
  },
  
  // 文字色
  text: {
    primary: 'rgba(0, 0, 0, 0.85)',
    secondary: 'rgba(0, 0, 0, 0.65)',
    tertiary: 'rgba(0, 0, 0, 0.45)',
    disabled: 'rgba(0, 0, 0, 0.25)',
    inverse: '#ffffff',
  },
  
  // 背景色
  bg: {
    base: '#ffffff',
    container: '#f5f5f5',
    elevated: '#ffffff',
    layout: '#f0f2f5',
    mask: 'rgba(0, 0, 0, 0.45)',
  },
  
  // 边框色
  border: {
    base: '#d9d9d9',
    split: '#f0f0f0',
    disabled: '#d9d9d9',
  },
};

// ==================== 字体系统 ====================

export const typography = {
  // 字体族
  fontFamily: {
    base: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    mono: '"SF Mono", Monaco, "Inconsolata", "Fira Code", monospace',
  },
  
  // 字号
  fontSize: {
    xs: '12px',
    sm: '14px',
    base: '14px',
    md: '16px',
    lg: '18px',
    xl: '20px',
    '2xl': '24px',
    '3xl': '30px',
    '4xl': '38px',
    '5xl': '46px',
  },
  
  // 行高
  lineHeight: {
    tight: 1.25,
    base: 1.5715,
    relaxed: 1.75,
  },
  
  // 字重
  fontWeight: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  
  // 标题样式
  heading: {
    h1: { size: '38px', weight: 600, lineHeight: 1.2105 },
    h2: { size: '30px', weight: 600, lineHeight: 1.2667 },
    h3: { size: '24px', weight: 600, lineHeight: 1.3333 },
    h4: { size: '20px', weight: 600, lineHeight: 1.4 },
    h5: { size: '16px', weight: 600, lineHeight: 1.5 },
  },
};

// ==================== 间距系统 ====================

export const spacing = {
  0: '0',
  1: '4px',
  2: '8px',
  3: '12px',
  4: '16px',
  5: '20px',
  6: '24px',
  7: '28px',
  8: '32px',
  9: '36px',
  10: '40px',
  11: '44px',
  12: '48px',
  14: '56px',
  16: '64px',
  20: '80px',
  24: '96px',
  28: '112px',
  32: '128px',
};

// ==================== 圆角系统 ====================

export const borderRadius = {
  none: '0',
  sm: '2px',
  base: '4px',
  md: '6px',
  lg: '8px',
  xl: '12px',
  full: '9999px',
};

// ==================== 阴影系统 ====================

export const shadows = {
  none: 'none',
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  base: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
  outline: '0 0 0 3px rgba(24, 144, 255, 0.2)',
};

// ==================== 过渡动画 ====================

export const transitions = {
  base: 'all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1)',
  fast: 'all 0.2s cubic-bezier(0.645, 0.045, 0.355, 1)',
  slow: 'all 0.4s cubic-bezier(0.645, 0.045, 0.355, 1)',
};

// ==================== Z-Index 层级 ====================

export const zIndex = {
  base: 0,
  dropdown: 1000,
  sticky: 1020,
  fixed: 1030,
  modalBackdrop: 1040,
  modal: 1050,
  popover: 1060,
  tooltip: 1070,
};

// ==================== 断点系统 ====================

export const breakpoints = {
  xs: '480px',
  sm: '576px',
  md: '768px',
  lg: '992px',
  xl: '1200px',
  '2xl': '1600px',
};

// ==================== 导出默认配置 ====================

export default {
  colors,
  typography,
  spacing,
  borderRadius,
  shadows,
  transitions,
  zIndex,
  breakpoints,
};
