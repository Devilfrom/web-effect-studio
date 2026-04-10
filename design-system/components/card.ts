/**
 * Card 卡片组件规范
 */

export const cardTokens = {
  // 基础样式
  base: {
    bg: '#ffffff',
    border: '1px solid #f0f0f0',
    borderRadius: '8px',
    boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.03)',
  },
  
  // 尺寸
  sizes: {
    default: {
      padding: '24px',
    },
    small: {
      padding: '12px',
    },
  },
  
  // 头部
  header: {
    padding: '16px 24px',
    borderBottom: '1px solid #f0f0f0',
    fontSize: '16px',
    fontWeight: 500,
    color: 'rgba(0, 0, 0, 0.85)',
  },
  
  // 内容区
  body: {
    padding: '24px',
  },
  
  // 底部操作区
  actions: {
    display: 'flex',
    alignItems: 'center',
    padding: '12px 24px',
    borderTop: '1px solid #f0f0f0',
    gap: '8px',
  },
  
  // 悬浮效果
  hover: {
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    transition: 'box-shadow 0.3s',
  },
};

export default cardTokens;
