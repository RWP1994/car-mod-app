// src/App.jsx
import { Routes, Route, Link } from 'react-router-dom'
import Home from './pages/Home'
import GaragePage from './pages/GaragePage'
import BuildShowcase from './pages/BuildShowcase'

export default function App() {
  return (
    <div>
      <nav style={{ padding: '1rem', borderBottom: '1px solid #ccc' }}>
        <Link to="/">Showcase</Link> | <Link to="/garage">Garage</Link> | <Link to="/showcase">Community</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/garage" element={<GaragePage />} />
        <Route path="/showcase" element={<BuildShowcase />} />
      </Routes>
    </div>
  )
}
