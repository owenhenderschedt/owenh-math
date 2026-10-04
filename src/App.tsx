import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './index.css'
import SiteHeader from './components/SiteHeader'
import Home from './pages/Home'
import Papers from './pages/Papers'
import Research from './pages/Research'
import Teaching from './pages/Teaching'
import CV from './pages/CV'

function PlaceholderPage({
  title,
  message,
}: {
  title: string
  message?: string
}) {
  return (
    <div className="site-shell">
      <SiteHeader />

      <main style={{ padding: '140px 8vw' }}>
        <h1>{title}</h1>
        {message && <p>{message}</p>}
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
        <Route path="/travel" element={<PlaceholderPage title="Travel" message="Coming soon" />} />
        <Route path="/cv" element={<CV />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
