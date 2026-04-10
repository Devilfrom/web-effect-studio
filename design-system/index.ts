/**
 * Design System Index
 * 设计系统入口文件
 * 
 * 使用方式:
 * import { tokens, components, patterns } from './design-system';
 */

// 设计令牌
export * from './tokens';

// 组件规范
export { default as buttonTokens } from './components/button';
export { default as inputTokens } from './components/input';
export { default as cardTokens } from './components/card';

// 设计模式
export { default as formPatterns } from './patterns/form';
export { default as listPatterns } from './patterns/list';
export { default as navigationPatterns } from './patterns/navigation';

// 统一导出
export { default as tokens } from './tokens';
export { default as components } from './components';
export { default as patterns } from './patterns';
