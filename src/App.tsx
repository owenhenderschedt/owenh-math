import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './index.css'
import Home from './pages/Home'
import Papers from './pages/Papers'
import Research from './pages/Research'
import Teaching from './pages/Teaching'
import Travel from './pages/Travel'
import CV from './pages/CV'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/research" element={<Research />} />
        <Route path="/papers" element={<Papers />} />
        <Route path="/teaching" element={<Teaching />} />
        <Route path="/travel" element={<Travel />} />
        <Route path="/cv" element={<CV />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
