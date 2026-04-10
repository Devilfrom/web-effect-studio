/**
 * 表单设计模式
 * 基于大厂规范的表单最佳实践
 */

export const formPatterns = {
  // 表单布局
  layouts: {
    // 水平布局（标签在左侧）
    horizontal: {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
      labelAlign: 'right',
    },
    // 垂直布局（标签在上方）
    vertical: {
      labelCol: { span: 24 },
      wrapperCol: { span: 24 },
      labelAlign: 'left',
    },
    // 行内布局
    inline: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '16px',
    },
  },
  
  // 标签样式
  label: {
    color: 'rgba(0, 0, 0, 0.85)',
    fontSize: '14px',
    requiredMark: "'*'",
    requiredColor: '#ff4d4f',
  },
  
  // 表单项间距
  itemSpacing: {
    marginBottom: '24px',
  },
  
  // 校验反馈
  validation: {
    error: {
      color: '#ff4d4f',
      fontSize: '14px',
      marginTop: '4px',
    },
    success: {
      color: '#52c41a',
    },
    warning: {
      color: '#faad14',
    },
  },
  
  // 帮助文本
  helpText: {
    color: 'rgba(0, 0, 0, 0.45)',
    fontSize: '14px',
    marginTop: '4px',
  },
};

export default formPatterns;
