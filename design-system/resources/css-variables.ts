/**
 * CSS Variables - 设计令牌 CSS 变量版本
 * 可用于全局样式定义
 */

export const cssVariables = `
:root {
  /* ========== 颜色系统 ========== */
  
  /* 品牌色 */
  --color-primary-50: #e6f7ff;
  --color-primary-100: #bae7ff;
  --color-primary-200: #91d5ff;
  --color-primary-300: #69c0ff;
  --color-primary-400: #40a9ff;
  --color-primary-500: #1890ff;
  --color-primary-600: #096dd9;
  --color-primary-700: #0050b3;
  --color-primary-800: #003a8c;
  --color-primary-900: #002766;
  
  /* 成功色 */
  --color-success-50: #f6ffed;
  --color-success-100: #d9f7be;
  --color-success-200: #b7eb8f;
  --color-success-300: #95de64;
  --color-success-400: #73d13d;
  --color-success-500: #52c41a;
  --color-success-600: #389e0d;
  --color-success-700: #237804;
  --color-success-800: #135200;
  --color-success-900: #092b00;
  
  /* 警告色 */
  --color-warning-50: #fffbe6;
  --color-warning-100: #fff1b8;
  --color-warning-200: #ffe58f;
  --color-warning-300: #ffd666;
  --color-warning-400: #ffc53d;
  --color-warning-500: #faad14;
  --color-warning-600: #d48806;
  --color-warning-700: #ad6800;
  --color-warning-800: #874d00;
  --color-warning-900: #613400;
  
  /* 错误色 */
  --color-error-50: #fff1f0;
  --color-error-100: #ffccc7;
  --color-error-200: #ffa39e;
  --color-error-300: #ff7875;
  --color-error-400: #ff4d4f;
  --color-error-500: #f5222d;
  --color-error-600: #cf1322;
  --color-error-700: #a8071a;
  --color-error-800: #820014;
  --color-error-900: #5c0011;
  
  /* 中性色 */
  --color-neutral-0: #ffffff;
  --color-neutral-50: #fafafa;
  --color-neutral-100: #f5f5f5;
  --color-neutral-200: #f0f0f0;
  --color-neutral-300: #e8e8e8;
  --color-neutral-400: #d9d9d9;
  --color-neutral-500: #bfbfbf;
  --color-neutral-600: #8c8c8c;
  --color-neutral-700: #595959;
  --color-neutral-800: #434343;
  --color-neutral-900: #262626;
  --color-neutral-1000: #000000;
  
  /* 文字色 */
  --color-text-primary: rgba(0, 0, 0, 0.85);
  --color-text-secondary: rgba(0, 0, 0, 0.65);
  --color-text-tertiary: rgba(0, 0, 0, 0.45);
  --color-text-disabled: rgba(0, 0, 0, 0.25);
  --color-text-inverse: #ffffff;
  
  /* 背景色 */
  --color-bg-base: #ffffff;
  --color-bg-container: #f5f5f5;
  --color-bg-elevated: #ffffff;
  --color-bg-layout: #f0f2f5;
  --color-bg-mask: rgba(0, 0, 0, 0.45);
  
  /* 边框色 */
  --color-border-base: #d9d9d9;
  --color-border-split: #f0f0f0;
  
  /* ========== 字体系统 ========== */
  --font-family-base: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  --font-family-mono: 'SF Mono', Monaco, 'Inconsolata', 'Fira Code', monospace;
  
  --font-size-xs: 12px;
  --font-size-sm: 14px;
  --font-size-base: 14px;
  --font-size-md: 16px;
  --font-size-lg: 18px;
  --font-size-xl: 20px;
  --font-size-2xl: 24px;
  --font-size-3xl: 30px;
  --font-size-4xl: 38px;
  --font-size-5xl: 46px;
  
  --line-height-tight: 1.25;
  --line-height-base: 1.5715;
  --line-height-relaxed: 1.75;
  
  --font-weight-normal: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;
  
  /* ========== 间距系统 ========== */
  --spacing-0: 0;
  --spacing-1: 4px;
  --spacing-2: 8px;
  --spacing-3: 12px;
  --spacing-4: 16px;
  --spacing-5: 20px;
  --spacing-6: 24px;
  --spacing-7: 28px;
  --spacing-8: 32px;
  --spacing-9: 36px;
  --spacing-10: 40px;
  
  /* ========== 圆角系统 ========== */
  --border-radius-none: 0;
  --border-radius-sm: 2px;
  --border-radius-base: 4px;
  --border-radius-md: 6px;
  --border-radius-lg: 8px;
  --border-radius-xl: 12px;
  --border-radius-full: 9999px;
  
  /* ========== 阴影系统 ========== */
  --shadow-none: none;
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow-base: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  
  /* ========== 过渡动画 ========== */
  --transition-base: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
  --transition-fast: all 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
  --transition-slow: all 0.4s cubic-bezier(0.645, 0.045, 0.355, 1);
  
  /* ========== Z-Index 层级 ========== */
  --z-index-dropdown: 1000;
  --z-index-sticky: 1020;
  --z-index-fixed: 1030;
  --z-index-modal-backdrop: 1040;
  --z-index-modal: 1050;
  --z-index-popover: 1060;
  --z-index-tooltip: 1070;
}
`;

export default cssVariables;
