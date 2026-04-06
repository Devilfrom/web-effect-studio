import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Home } from './pages/Home'
import { EditorPage } from './pages/EditorPage'
import { MyProjects } from './pages/MyProjects'
import { StarfieldBackground } from './components/Effects/StarfieldBackground'
import { SakuraEffect } from './components/Effects/SakuraEffect'
import { MascotChan } from './components/Mascot/MascotChan'

function App() {
  return (
    <BrowserRouter>
      {/* 星空背景 */}
      <StarfieldBackground />
      
      {/* 樱花飘落效果 */}
      <SakuraEffect count={15} />
      
      {/* 主内容 */}
      <div className="relative z-10">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/editor/:id" element={<EditorPage />} />
          <Route path="/my" element={<MyProjects />} />
        </Routes>
      </div>
      
      {/* 看板娘 */}
      <MascotChan />
    </BrowserRouter>
  )
}

export default App
