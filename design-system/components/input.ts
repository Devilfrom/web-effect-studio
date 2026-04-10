/**
 * Input 输入框组件规范
 */

export const inputTokens = {
  // 尺寸
  sizes: {
    small: {
      height: '24px',
      padding: '0 7px',
      fontSize: '14px',
    },
    middle: {
      height: '32px',
      padding: '4px 11px',
      fontSize: '14px',
    },
    large: {
      height: '40px',
      padding: '6px 11px',
      fontSize: '16px',
    },
  },
  
  // 基础样式
  base: {
    bg: '#ffffff',
    color: 'rgba(0, 0, 0, 0.85)',
    border: '1px solid #d9d9d9',
    borderRadius: '6px',
    transition: 'all 0.3s',
    placeholderColor: 'rgba(0, 0, 0, 0.25)',
  },
  
  // 状态
  states: {
    hover: {
      borderColor: '#40a9ff',
    },
    focus: {
      borderColor: '#1890ff',
      boxShadow: '0 0 0 2px rgba(24, 144, 255, 0.2)',
    },
    disabled: {
      bg: '#f5f5f5',
      color: 'rgba(0, 0, 0, 0.25)',
      cursor: 'not-allowed',
    },
    error: {
      borderColor: '#ff4d4f',
      hoverBorderColor: '#ff7875',
    },
  },
  
  // 前缀/后缀
  affix: {
    color: 'rgba(0, 0, 0, 0.45)',
    padding: '0 11px',
    bg: '#fafafa',
  },
};

export default inputTokens;
