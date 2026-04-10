/**
 * Button 按钮组件规范
 * 基于 Ant Design + Arco Design 融合
 */

export const buttonTokens = {
  // 尺寸
  sizes: {
    small: {
      height: '24px',
      padding: '0 7px',
      fontSize: '14px',
      borderRadius: '4px',
    },
    middle: {
      height: '32px',
      padding: '4px 15px',
      fontSize: '14px',
      borderRadius: '6px',
    },
    large: {
      height: '40px',
      padding: '6px 15px',
      fontSize: '16px',
      borderRadius: '8px',
    },
  },
  
  // 类型样式
  variants: {
    primary: {
      bg: '#1890ff',
      color: '#ffffff',
      border: '1px solid #1890ff',
      hoverBg: '#40a9ff',
      hoverBorder: '#40a9ff',
      activeBg: '#096dd9',
      activeBorder: '#096dd9',
    },
    default: {
      bg: '#ffffff',
      color: 'rgba(0, 0, 0, 0.85)',
      border: '1px solid #d9d9d9',
      hoverBg: '#ffffff',
      hoverColor: '#1890ff',
      hoverBorder: '#1890ff',
      activeBg: '#ffffff',
      activeColor: '#096dd9',
      activeBorder: '#096dd9',
    },
    dashed: {
      bg: '#ffffff',
      color: 'rgba(0, 0, 0, 0.85)',
      border: '1px dashed #d9d9d9',
      hoverColor: '#1890ff',
      hoverBorder: '#1890ff',
    },
    text: {
      bg: 'transparent',
      color: 'rgba(0, 0, 0, 0.85)',
      border: 'none',
      hoverBg: 'rgba(0, 0, 0, 0.06)',
      hoverColor: 'rgba(0, 0, 0, 0.85)',
    },
    link: {
      bg: 'transparent',
      color: '#1890ff',
      border: 'none',
      hoverColor: '#40a9ff',
    },
  },
  
  // 状态
  states: {
    disabled: {
      opacity: 0.6,
      cursor: 'not-allowed',
    },
    loading: {
      opacity: 0.65,
      pointerEvents: 'none',
    },
  },
  
  // 图标按钮
  iconOnly: {
    small: { width: '24px', padding: '0' },
    middle: { width: '32px', padding: '0' },
    large: { width: '40px', padding: '0' },
  },
};

export default buttonTokens;
