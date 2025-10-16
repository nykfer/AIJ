import { useState } from 'react'
import './App.css'
import Home from './Home.jsx'
import About from './About.jsx'
import Contact from './Contact.jsx'

import { BrowserRouter, Routes, Route } from 'react-router-dom'

function App() {
  const [count, setCount] = useState(0)

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
