/**
 * 列表设计模式
 */

export const listPatterns = {
  // 基础列表
  base: {
    itemPadding: '12px 0',
    itemBorderBottom: '1px solid #f0f0f0',
    hoverBg: '#fafafa',
  },
  
  // 表格列表
  table: {
    headerBg: '#fafafa',
    headerColor: 'rgba(0, 0, 0, 0.85)',
    headerFontWeight: 500,
    rowHoverBg: '#fafafa',
    rowSelectedBg: '#e6f7ff',
    border: '1px solid #f0f0f0',
    borderRadius: '8px',
  },
  
  // 卡片列表
  card: {
    gap: '16px',
    gridColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
  },
  
  // 空状态
  empty: {
    padding: '64px 0',
    textAlign: 'center',
    color: 'rgba(0, 0, 0, 0.25)',
  },
  
  // 分页
  pagination: {
    marginTop: '16px',
    textAlign: 'right',
  },
};

export default listPatterns;
