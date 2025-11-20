import './App.css'
import Home from './Home.jsx'
import About from './About.jsx'
import Contact from './Contact.jsx'
import News from './News.jsx'
import Analytics from './Analitycs.jsx'
import Header from './Header.jsx'
import './styles/divider.css'
import './styles/card.css'
import Login from './Login.jsx'
import SignUp from './SignUp.jsx'

import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'

const DIVIDER_PATHS = ['/', '/analytics', '/news']

function AppShell() {
  const location = useLocation()
  const normalizedPath = location.pathname.toLowerCase()
  const shouldShowDivider = DIVIDER_PATHS.includes(normalizedPath)

  return (
    <>
      <Header />
      {shouldShowDivider && (
        <hr
          className="divider divider-global"
          style={{ '--divider-length': '100%', '--divider-thickness': '2px', '--divider-opacity': 1, '--divider-gap': '1.2rem' }}
        />
      )}
      <div className="page-shell">
        <main className="content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/news" element={<News />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
          </Routes>
        </main>
      </div>
    </>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AppShell />
    </BrowserRouter>
  )
}

export default App
