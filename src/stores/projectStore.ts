import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface Project {
  id: string
  userId?: string
  title: string
  html: string
  css: string
  js: string
  createdAt?: number
  updatedAt?: number
  isPublic?: boolean
}

interface ProjectState {
  currentProject: Project | null
  projects: Project[]
  setCurrentProject: (project: Project | null) => void
  updateCode: (type: 'html' | 'css' | 'js' | 'javascript', code: string) => void
  setProjects: (projects: Project[]) => void
  addProject: (project: Project) => void
  updateProject: (id: string, updates: Partial<Project>) => void
  deleteProject: (id: string) => void
}

const defaultProject: Project = {
  id: '',
  title: '未命名项目',
  html: `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>My Project</title>
</head>
<body>
  <h1>Hello World!</h1>
  <p>开始编辑你的代码吧</p>
</body>
</html>`,
  css: `body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  margin: 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

h1 {
  color: white;
  font-size: 3rem;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
}

p {
  color: rgba(255,255,255,0.9);
  font-size: 1.2rem;
}`,
  js: `// 在这里编写 JavaScript 代码
console.log('Hello from Web Effect Studio!');

// 示例：点击标题显示消息
document.querySelector('h1').addEventListener('click', () => {
  alert('你点击了标题！');
});`
}

export const useProjectStore = create<ProjectState>()(
  persist(
    (set) => ({
      currentProject: null,
      projects: [],
      setCurrentProject: (project) => set({ currentProject: project || defaultProject }),
      updateCode: (type, code) => set((state) => ({
        currentProject: state.currentProject 
          ? { ...state.currentProject, [type]: code, updatedAt: Date.now() }
          : null
      })),
      setProjects: (projects) => set({ projects }),
      addProject: (project) => set((state) => ({
        projects: [...state.projects, project]
      })),
      updateProject: (id, updates) => set((state) => ({
        projects: state.projects.map(p => p.id === id ? { ...p, ...updates } : p),
        currentProject: state.currentProject?.id === id 
          ? { ...state.currentProject, ...updates }
          : state.currentProject
      })),
      deleteProject: (id) => set((state) => ({
        projects: state.projects.filter(p => p.id !== id),
        currentProject: state.currentProject?.id === id ? null : state.currentProject
      })),
    }),
    {
      name: 'web-effect-studio-storage',
      partialize: (state) => ({ 
        currentProject: state.currentProject || defaultProject,
        projects: state.projects 
      }),
    }
  )
)