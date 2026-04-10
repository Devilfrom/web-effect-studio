# 🚀 Web Effect Studio 部署指南

## 快速开始

### 方式一：本地开发
```bash
npm install
npm run dev      # 开发模式 http://localhost:5173
npm run build    # 构建生产版本
```

### 方式二：手动部署
```bash
npm run build
# 将 dist 目录上传到 Vercel / Netlify / Cloudflare Pages
```

---

## GitHub Actions 自动部署（推荐）

### 准备工作

#### 1. 获取 Vercel Token
1. 登录 [Vercel](https://vercel.com)
2. Settings → Tokens → Create
3. 复制 Token

#### 2. 获取 Vercel Org ID 和 Project ID
```bash
npx vercel link --token YOUR_TOKEN
# 或在 Vercel Dashboard 查看项目设置
```

#### 3. 获取 Netlify Token
1. 登录 [Netlify](https://app.netlify.com)
2. User settings → OAuth → Personal access tokens → Create new token

#### 4. Firebase 项目配置
1. 登录 [Firebase Console](https://console.firebase.google.com)
2. 创建项目（或使用现有项目）
3. Project Settings → Your apps → Add app（选择 Web）
4. 复制 Firebase SDK 配置信息
5. 在 Firebase Console 开启：
   - Authentication → Sign-in method → Email/Password
   - Firestore Database → Create database（测试模式）

### 配置 GitHub Secrets

在 GitHub 仓库 Settings → Secrets and variables → Actions 中添加：

| Secret 名称 | 说明 | 来源 |
|------------|------|------|
| `VERCEL_TOKEN` | Vercel API Token | Vercel Settings |
| `VERCEL_ORG_ID` | Vercel Organization ID | `vercel team ls` |
| `VERCEL_PROJECT_ID` | Vercel Project ID | Vercel 项目设置 |
| `NETLIFY_AUTH_TOKEN` | Netlify Token | Netlify 设置 |
| `NETLIFY_SITE_ID` | Netlify Site ID | `.netlify/state.json` |
| `VITE_FIREBASE_API_KEY` | Firebase API Key | Firebase Console |
| `VITE_FIREBASE_AUTH_DOMAIN` | Firebase Auth Domain | Firebase Console |
| `VITE_FIREBASE_PROJECT_ID` | Firebase Project ID | Firebase Console |
| `VITE_FIREBASE_STORAGE_BUCKET` | Firebase Storage Bucket | Firebase Console |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Firebase Sender ID | Firebase Console |
| `VITE_FIREBASE_APP_ID` | Firebase App ID | Firebase Console |

### 触发部署

推送到 `main` 分支会自动触发部署：
```bash
git push origin main
```

或手动触发：GitHub Actions → "Deploy to Vercel" / "Deploy to Netlify" → Run workflow

---

## Firebase 部署后配置

### Firestore 安全规则（发布前）
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // 任何人都可以读取评论
    match /effects/{effectId}/comments/{commentId} {
      allow read: if true;
      allow write: if request.auth != null
                    && request.resource.data.author.size() > 0
                    && request.resource.data.content.size() > 0;
    }
  }
}
```

### Authentication 设置
- 开启 Email/Password 登录（目前支持）
- 可后续添加 Google 登录（需在 Firebase Console 配置）

---

## 部署平台对比

| 平台 | 优点 | 缺点 |
|------|------|------|
| **Vercel** | 自动配置 HTTPS、内置 CDN、最适合 React | 冷启动较慢 |
| **Netlify** | 固定域名、自动部署、历史版本 | 免费版有流量限制 |
| **Cloudflare Pages** | 全球 CDN、无限带宽 | 配置相对复杂 |
| **GitHub Pages** | 免费、完全免费 | 仅静态托管、无法处理路由 |

---

## 故障排除

### Vercel build 失败
```bash
# 本地先测试 build
npm run build
```

### Firebase 连接失败
- 检查 VITE_FIREBASE_* 环境变量是否正确
- 确认 Firebase 项目已启用相应服务

### 评论不显示
- 检查 Firestore 安全规则
- 确认已开启 Anonymous/Email 认证
