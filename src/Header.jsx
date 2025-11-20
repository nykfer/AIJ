import { Link } from 'react-router-dom'
import './styles/header.css'
import webLogo from './assets/web-logo-removebg-preview.png'

function Header() {
  const getCurrentDay = () => {
    const date = new Date()
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
  }

  return (
    <header className="header">
      <div className="header-top">
        <div className="header-left">
          <div className="header-time">{getCurrentDay()}</div>
          <div className="header-text">Today's AI</div>
        </div>
        <div className="company-logo">AIJ</div>
        <img src={webLogo} alt="AIJ logo" className="header-logo-image" />
      </div>
      <nav className="header-nav">
        <Link to="/" className="header-link">
          Home
        </Link>
        <Link to="/news" className="header-link">
          News
        </Link>
        <Link to="/analytics" className="header-link">
          Analytics Insights
        </Link>
        <Link to="/about" className="header-link">
          About us
        </Link>
        <Link to="/contact" className="header-link">
          Contact us
        </Link>
        <Link to="/login" className="header-link">
          Login
        </Link>
      </nav>
    </header>
  )
}

export default Header

