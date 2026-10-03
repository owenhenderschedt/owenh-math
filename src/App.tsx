import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './index.css'
import SiteHeader from './components/SiteHeader'
import Home from './pages/Home'
import Papers from './pages/Papers'
import Research from './pages/Research'
import Teaching from './pages/Teaching'

function PlaceholderPage({ title }: { title: string }) {
  return (
    <div className="site-shell">
      <SiteHeader />

      <main style={{ padding: '140px 8vw' }}>
        <h1>{title}</h1>
      </main>
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/research" element={<Research />} />
        <Route path="/papers" element={<Papers />} />
        <Route path="/teaching" element={<Teaching />} />
        <Route path="/about" element={<PlaceholderPage title="About" />} />
        <Route path="/cv" element={<PlaceholderPage title="CV" />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
