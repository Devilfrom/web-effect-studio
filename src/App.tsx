import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Home } from './pages/Home'
import { EditorPage } from './pages/EditorPage'
import { MyProjects } from './pages/MyProjects'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/editor/:id" element={<EditorPage />} />
        <Route path="/my" element={<MyProjects />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
