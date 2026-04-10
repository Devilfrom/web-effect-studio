/**
 * 导航设计模式
 */

export const navigationPatterns = {
  // 顶部导航
  header: {
    height: '64px',
    bg: '#ffffff',
    boxShadow: '0 1px 4px rgba(0, 21, 41, 0.08)',
    padding: '0 24px',
    zIndex: 1000,
  },
  
  // 侧边导航
  sidebar: {
    width: '200px',
    collapsedWidth: '80px',
    bg: '#001529',
    color: 'rgba(255, 255, 255, 0.65)',
    selectedColor: '#1890ff',
    selectedBg: '#1890ff',
    hoverBg: 'transparent',
    hoverColor: '#ffffff',
  },
  
  // 面包屑
  breadcrumb: {
    separator: '/',
    separatorColor: 'rgba(0, 0, 0, 0.45)',
    itemColor: 'rgba(0, 0, 0, 0.45)',
    lastItemColor: 'rgba(0, 0, 0, 0.85)',
    fontSize: '14px',
  },
  
  // 标签页
  tabs: {
    inkBarColor: '#1890ff',
    activeColor: '#1890ff',
    inactiveColor: 'rgba(0, 0, 0, 0.85)',
    hoverColor: '#40a9ff',
  },
  
  // 菜单
  menu: {
    itemHeight: '40px',
    itemPadding: '0 16px',
    fontSize: '14px',
    borderRadius: '4px',
  },
};

export default navigationPatterns;
