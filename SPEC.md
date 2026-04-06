# Web Effect Studio v2 — 效果库 + 在线 IDE + 分享平台

## 愿景

> 前端炫酷效果的「博物馆 + 实验室 + 社交平台」
> 逛 → 玩 → 改 → 分享，像 jq22 那样丰富，但带实时在线 IDE

---

## 页面结构

### 1. 首页 / 效果库（Home / Gallery）
- 顶部导航栏：Logo、搜索框、分类筛选、"我的项目"、登录
- 效果卡片网格：
  - 封面 GIF/截图（Canvas 效果自动生成缩略）
  - 标题 + 简介
  - 标签（分类标签）
  - 作者头像 + 浏览数
- 左侧分类侧边栏：CSS动画 / Canvas动画 / 粒子特效 / 3D/WebGL / 交互特效 / 小游戏 / UI组件
- 右侧热门/最新切换 Tab
- 点击卡片 → 进入 IDE 页面

### 2. IDE 页面（Editor）
- 顶部：标题（可编辑）、保存、分享按钮、返回画廊
- 左侧/顶部：文件标签切换（HTML / CSS / JS）
- 中间：Monaco Editor
- 右侧：实时预览 iframe
- 底部：控制台输出
- 右上角：运行/停止/全屏预览

### 3. 分享页 / 嵌入
- 生成短链接 `/?p=<id>`
- 可直接嵌入 iframe 展示效果

### 4. 我的项目（My Projects）
- 列表视图：缩略图 + 标题 + 更新时间 + 公开/私有
- 支持删除、编辑、复制

---

## 技术架构

### 前端
- React 18 + Vite + TypeScript（现有）
- Monaco Editor（现有）
- TailwindCSS + shadcn/ui（现有）
- Zustand（现有）
- 路由：React Router v6

### 后端 / 数据层
- Firebase Firestore：存储效果数据、用户信息
- Firebase Auth：邮箱登录（现有）
- Firebase Storage：用户上传资源（可选）

### 数据模型

```typescript
interface Effect {
  id: string              // Firestore doc ID
  title: string
  description: string
  category: Category      // 'css-animation' | 'canvas' | 'particle' | 'webgl' | 'interactive' | 'game' | 'ui'
  tags: string[]
  html: string
  css: string
  js: string
  authorId: string
  authorName: string
  authorAvatar?: string
  previewImage?: string   // 缩略图 URL
  viewCount: number
  likeCount: number
  isPublic: boolean
  createdAt: Timestamp
  updatedAt: Timestamp
}

type Category = 'css-animation' | 'canvas' | 'particle' | 'webgl' | 'interactive' | 'game' | 'ui'
```

---

## 内置效果库（第一期，30个）

### CSS Animation（8个）
1. 渐变文字动画
2. 呼吸灯效果
3. 弹跳加载动画
4. 霓虹灯文字
5. 打字机效果
6. 卡片悬浮3D翻转
7. 进度条动画
8. 脉冲圆点

### Canvas（8个）
1. 粒子连线效果（星空/网络）
2. 动态爱心粒子
3. Canvas 弹球游戏
4. 粒子文字
5. 万花筒
6. 雨滴效果
7. 雪花飘落
8. 火焰效果

### Particle（5个）
1. 烟花绽放
2. 粒子聚合文字
3. 鼠标跟随粒子
4. 粒子漩涡
5. 星系轨道

### WebGL / 3D（4个）
1. Three.js 旋转立方体
2. CSS 3D 卡片堆叠
3. WebGL 着色器渐变
4. 3D 相册轮播

### Interactive（5个）
1. 拖拽元素
2. 视差滚动背景
3. 手势解锁
4. 签名板
5. 颜色拾取器

---

## 分享功能

- 点击「分享」生成唯一链接 `/?effect=<id>`
- 链接可复制、可二维码生成
- 未登录用户只能浏览公开效果
- 登录后可创建/编辑/删除自己的效果

---

## Firebase 数据结构

```
/effects/          — 所有效果（公开+私有）
/effects_public/   — 仅公开效果（用于画廊）
/users/            — 用户信息
```

---

## 开发计划

**Phase 1：框架搭建**
- 安装 react-router-dom
- 创建页面路由
- 重构 App.tsx

**Phase 2：效果库首页**
- Gallery 页面组件
- EffectCard 组件
- 分类侧边栏
- 内置 30 个效果数据

**Phase 3：IDE 页面**
- 复用现有 EditorLayout
- 添加返回按钮、分享按钮
- 效果元数据编辑

**Phase 4：分享与数据层**
- Firebase Firestore 集成
- 保存/加载效果
- 分享链接解析

**Phase 5：我的项目**
- 用户项目列表
- CRUD 操作

---

## 设计风格

- 深色主题（#0d0d0d 背景 + #1a1a2e 卡片）
- 霓虹渐变点缀（紫/青/粉）
- 毛玻璃效果卡片
- 动画丰富但克制（hover 过渡 200ms）
- 效果卡片 hover 放大 + 边框发光
