import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { Home } from './pages/Home'
import { EditorPage } from './pages/EditorPage'
import { MyProjects } from './pages/MyProjects'
import { UserProfile } from './pages/UserProfile'
import { StarfieldBackground } from './components/Effects/StarfieldBackground'
import { SakuraEffect } from './components/Effects/SakuraEffect'
import { MascotChan } from './components/Mascot/MascotChan'

function AppContent() {
  const location = useLocation()
  // 只在首页显示樱花效果（编辑器页面不需要，影响预览）
  const showSakura = location.pathname === '/'
  
  return (
    <>
      {/* 星空背景 */}
      <StarfieldBackground />
      
      {/* 樱花飘落效果 - 仅首页 */}
      {showSakura && <SakuraEffect count={15} />}
      
      {/* 主内容 */}
      <div className="relative z-10">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/editor/:id" element={<EditorPage />} />
          <Route path="/my" element={<MyProjects />} />
          <Route path="/profile" element={<UserProfile />} />
        </Routes>
      </div>
      
      {/* 看板娘 */}
      <MascotChan />
    </>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  )
}

export default App
