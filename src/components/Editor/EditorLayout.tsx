import { useState, useEffect, useCallback, useRef } from 'react'
import { useProjectStore } from '@/stores/projectStore'
import { CodeEditor } from './CodeEditor'
import { Preview } from '../Preview/Preview'
import { debounce } from '@/lib/utils'
import { cn } from '@/lib/utils'
import { 
  Save, Plus, Copy, 
  Loader2, PanelLeft, PanelRight, LogOut, User
} from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'

type TabType = 'html' | 'css' | 'javascript'

export function EditorLayout() {
  const [activeTab, setActiveTab] = useState<TabType>('html')
  const [isSaving, setIsSaving] = useState(false)
  const [showSidebar, setShowSidebar] = useState(true)
  const { currentProject, updateCode, projects, setCurrentProject } = useProjectStore()
  const { user, logout } = useAuthStore()
  const iframeRef = useRef<HTMLIFrameElement>(null)

  const updatePreview = useCallback(() => {
    if (!currentProject || !iframeRef.current) return
    
    const { html, css, js } = currentProject
    const fullHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>${css}</style>
      </head>
      <body>
        ${html.replace(/<html[^>]*>|<\/html>|<head[^>]*>|<\/head>/gi, '')}
        <script>
          // 捕获 console 输出
          const originalLog = console.log;
          const originalError = console.error;
          const originalWarn = console.warn;
          
          function sendToParent(type, args) {
            try {
              window.parent.postMessage({
                type: 'console',
                level: type,
                message: Array.from(args).map(a => String(a)).join(' ')
              }, '*');
            } catch(e) {}
          }
          
          console.log = (...args) => { originalLog.apply(console, args); sendToParent('log', args); };
          console.error = (...args) => { originalError.apply(console, args); sendToParent('error', args); };
          console.warn = (...args) => { originalWarn.apply(console, args); sendToParent('warn', args); };
          
          window.onerror = (msg, url, line) => {
            sendToParent('error', [msg + ' (line ' + line + ')']);
          };
        </script>
        <script>${js}</script>
      </body>
      </html>
    `
    
    iframeRef.current.srcdoc = fullHtml
  }, [currentProject])

  const debouncedUpdate = useCallback(
    debounce(() => {
      updatePreview()
    }, 500),
    [updatePreview]
  )

  useEffect(() => {
    debouncedUpdate()
  }, [currentProject?.html, currentProject?.css, currentProject?.js, debouncedUpdate])

  const handleCodeChange = (value: string | undefined) => {
    if (value !== undefined) {
      const codeKey = activeTab === 'javascript' ? 'js' : activeTab
      updateCode(codeKey as 'html' | 'css' | 'js', value)
    }
  }

  const handleSave = async () => {
    if (!currentProject) return
    setIsSaving(true)
    
    // TODO: 保存到 Firebase
    // 模拟保存
    await new Promise(resolve => setTimeout(resolve, 500))
    
    setIsSaving(false)
  }

  const handleNewProject = () => {
    const newProject = {
      id: Date.now().toString(),
      title: '新项目 ' + new Date().toLocaleTimeString(),
      html: '<!DOCTYPE html>\n<html>\n<head>\n  <title>新项目</title>\n</head>\n<body>\n  \n</body>\n</html>',
      css: 'body {\n  \n}',
      js: '// 新项目',
      createdAt: Date.now(),
      updatedAt: Date.now()
    }
    setCurrentProject(newProject)
  }

  const handleCopyCode = () => {
    if (!currentProject) return
    const fullCode = `<!-- HTML -->\n${currentProject.html}\n\n/* CSS */\n${currentProject.css}\n\n// JavaScript\n${currentProject.js}`
    navigator.clipboard.writeText(fullCode)
  }

  const tabs: TabType[] = ['html', 'css', 'javascript']

  return (
    <div className="h-screen flex flex-col bg-[#1e1e1e]">
      {/* Header */}
      <header className="h-14 bg-[#323233] border-b border-[#3c3c3c] flex items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <h1 className="text-lg font-semibold text-white">Web Effect Studio</h1>
          <input
            type="text"
            value={currentProject?.title || ''}
            onChange={(e) => {
              if (currentProject) {
                useProjectStore.getState().updateProject(currentProject.id, { title: e.target.value })
              }
            }}
            className="bg-[#3c3c3c] text-white px-3 py-1 rounded text-sm border-none outline-none focus:ring-1 focus:ring-[#0078d4]"
            placeholder="项目名称"
          />
        </div>
        
        <div className="flex items-center gap-2">
          <button 
            onClick={handleNewProject}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0e639c] text-white rounded text-sm hover:bg-[#1177bb]"
          >
            <Plus size={16} />
            新建
          </button>
          
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#3c3c3c] text-white rounded text-sm hover:bg-[#4c4c4c]"
          >
            {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            保存
          </button>
          
          <button 
            onClick={handleCopyCode}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#3c3c3c] text-white rounded text-sm hover:bg-[#4c4c4c]"
          >
            <Copy size={16} />
            复制
          </button>

          <button 
            onClick={() => setShowSidebar(!showSidebar)}
            className="p-1.5 bg-[#3c3c3c] text-white rounded hover:bg-[#4c4c4c]"
          >
            {showSidebar ? <PanelLeft size={18} /> : <PanelRight size={18} />}
          </button>

          {user ? (
            <div className="flex items-center gap-2 ml-2">
              <span className="text-sm text-gray-300">{user.email}</span>
              <button 
                onClick={() => logout()}
                className="p-1.5 text-gray-400 hover:text-white"
              >
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0078d4] text-white rounded text-sm hover:bg-[#1177bb]">
              <User size={16} />
              登录
            </button>
          )}
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        {showSidebar && (
          <aside className="w-64 bg-[#252526] border-r border-[#3c3c3c] flex flex-col">
            <div className="p-3 border-b border-[#3c3c3c]">
              <h2 className="text-sm font-medium text-gray-300">我的项目</h2>
            </div>
            <div className="flex-1 overflow-y-auto p-2">
              {projects.length === 0 ? (
                <p className="text-sm text-gray-500 p-2">暂无项目</p>
              ) : (
                projects.map((project) => (
                  <button
                    key={project.id}
                    onClick={() => setCurrentProject(project)}
                    className={cn(
                      "w-full text-left p-2 rounded text-sm mb-1",
                      currentProject?.id === project.id 
                        ? "bg-[#37373d] text-white" 
                        : "text-gray-400 hover:bg-[#2a2d2e]"
                    )}
                  >
                    {project.title}
                  </button>
                ))
              )}
            </div>
          </aside>
        )}

        {/* Editor + Preview */}
        <div className="flex-1 flex">
          {/* Code Editor */}
          <div className="flex-1 flex flex-col border-r border-[#3c3c3c]">
            {/* Tabs */}
            <div className="flex bg-[#2d2d2d]">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={cn(
                    "px-4 py-2 text-sm border-r border-[#3c3c3c]",
                    activeTab === tab 
                      ? "bg-[#1e1e1e] text-white border-b-2 border-b-[#0078d4]" 
                      : "text-gray-400 hover:text-white hover:bg-[#2a2d2e]"
                  )}
                >
                  {tab === 'html' ? 'HTML' : tab === 'css' ? 'CSS' : 'JS'}
                </button>
              ))}
            </div>
            
            {/* Editor */}
            <div className="flex-1">
              {activeTab === 'html' && (
                <CodeEditor
                  language="html"
                  value={currentProject?.html || ''}
                  onChange={handleCodeChange}
                />
              )}
              {activeTab === 'css' && (
                <CodeEditor
                  language="css"
                  value={currentProject?.css || ''}
                  onChange={handleCodeChange}
                />
              )}
              {activeTab === 'javascript' && (
                <CodeEditor
                  language="javascript"
                  value={currentProject?.js || ''}
                  onChange={handleCodeChange}
                />
              )}
            </div>
          </div>

          {/* Preview */}
          <div className="flex-1 flex flex-col">
            <div className="h-10 bg-[#252526] border-b border-[#3c3c3c] flex items-center px-3">
              <span className="text-sm text-gray-300">预览</span>
            </div>
            <Preview ref={iframeRef} />
          </div>
        </div>
      </div>
    </div>
  )
}