import { useEffect, useState } from 'react'
import { EditorLayout } from './components/Editor/EditorLayout'
import { LoginModal } from './components/Auth/LoginModal'
import { useAuthStore } from './stores/authStore'
import { useProjectStore } from './stores/projectStore'

function App() {
  const [showLogin, setShowLogin] = useState(false)
  const { initialize } = useAuthStore()
  const { setCurrentProject } = useProjectStore()

  useEffect(() => {
    initialize()
  }, [])

  // 设置默认项目
  useEffect(() => {
    const store = useProjectStore.getState()
    if (!store.currentProject) {
      setCurrentProject(null)
    }
  }, [])

  return (
    <div className="h-screen w-screen overflow-hidden">
      <EditorLayout />
      <LoginModal 
        isOpen={showLogin} 
        onClose={() => setShowLogin(false)} 
      />
    </div>
  )
}

export default App