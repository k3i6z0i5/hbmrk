import { useState, useEffect } from 'react'
import { NavLink, Link, useLocation } from 'react-router-dom'
import './Header.css'

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const token = localStorage.getItem('hbmr_admin_token')
    setIsAdminLoggedIn(!!token)
  }, [location])

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }

  const closeMobileMenu = () => {
    setMobileMenuOpen(false)
  }

  return (
    <header className={`site-header ${scrolled ? 'scrolled' : ''}`} id="site-header">
      {/* Top Bar */}
      <div className="header-topbar">
        <div className="container topbar-content">
          <div className="topbar-left">
            <span className="topbar-item">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
              HBMR@gmail.com
            </span>
            <span className="topbar-item">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
              73730 15999
            </span>
          </div>
          <div className="topbar-right">
            <a href="https://www.hbs.ac.in" target="_blank" rel="noopener noreferrer" className="topbar-item">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
              www.hbs.ac.in
            </a>
          </div>
        </div>
      </div>

      {/* Logo Area */}
      <div className="header-logo-area">
        <div className="container logo-content">
          <Link to="/" className="logo-link">
            <div className="logo-icon">
              <span>HBMR</span>
            </div>
            <div className="logo-text">
              <h1 className="logo-title">Hallmark Business and Management Review</h1>
              <p className="logo-subtitle">HBMR | ISSN: Applied | Biannual Peer-Reviewed Journal</p>
            </div>
          </Link>
        </div>
      </div>

      {/* Navigation */}
      <nav className="header-nav">
        <div className="container nav-content">
          <button 
            className={`hamburger ${mobileMenuOpen ? 'active' : ''}`} 
            onClick={toggleMobileMenu}
            aria-label="Toggle navigation menu"
            id="hamburger-btn"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>

          <ul className={`nav-list ${mobileMenuOpen ? 'open' : ''}`} id="nav-list">
            <li className="nav-item">
              <NavLink to="/" className={({isActive}) => isActive ? 'nav-link active' : 'nav-link'} onClick={closeMobileMenu} end>Home</NavLink>
            </li>
            <li className="nav-item has-dropdown">
              <NavLink to="/about" className={({isActive}) => isActive ? 'nav-link active' : 'nav-link'} onClick={closeMobileMenu}>About</NavLink>
              <ul className="dropdown-menu">
                <li><Link to="/about?tab=aim" onClick={closeMobileMenu}>Aim & Scope</Link></li>
                <li><Link to="/about?tab=open-access" onClick={closeMobileMenu}>Open Access</Link></li>
                <li><Link to="/about?tab=advisory" onClick={closeMobileMenu}>Advisory Board</Link></li>
                <li><Link to="/about?tab=privacy" onClick={closeMobileMenu}>Privacy Statement</Link></li>
              </ul>
            </li>
            <li className="nav-item">
              <NavLink to="/current-issue" className={({isActive}) => isActive ? 'nav-link active' : 'nav-link'} onClick={closeMobileMenu}>Current Issue</NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/editorial-board" className={({isActive}) => isActive ? 'nav-link active' : 'nav-link'} onClick={closeMobileMenu}>Editorial Board</NavLink>
            </li>
            <li className="nav-item has-dropdown">
              <NavLink to="/publish" className={({isActive}) => isActive ? 'nav-link active' : 'nav-link'} onClick={closeMobileMenu}>Publish</NavLink>
              <ul className="dropdown-menu">
                <li><Link to="/publish?tab=submission" onClick={closeMobileMenu}>Submission</Link></li>
                <li><Link to="/publish?tab=guidelines" onClick={closeMobileMenu}>Author Guidelines</Link></li>
                <li><Link to="/publish?tab=ethics" onClick={closeMobileMenu}>Publication Ethics</Link></li>
                <li><Link to="/publish?tab=copyright" onClick={closeMobileMenu}>Copyright Notice</Link></li>
                <li><Link to="/publish?tab=peer-review" onClick={closeMobileMenu}>Peer Review Process</Link></li>
                <li><Link to="/publish?tab=plagiarism" onClick={closeMobileMenu}>Plagiarism Policy</Link></li>
                <li><Link to="/publish?tab=fees" onClick={closeMobileMenu}>Publication Fees</Link></li>
              </ul>
            </li>
            <li className="nav-item">
              <NavLink to="/archives" className={({isActive}) => isActive ? 'nav-link active' : 'nav-link'} onClick={closeMobileMenu}>Archives</NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/contact" className={({isActive}) => isActive ? 'nav-link active' : 'nav-link'} onClick={closeMobileMenu}>Contact</NavLink>
            </li>
            <li className="nav-item mobile-only-admin-link">
              <NavLink to="/admin" className={({isActive}) => isActive ? 'nav-link active' : 'nav-link'} onClick={closeMobileMenu}>
                {isAdminLoggedIn ? 'Admin Panel' : 'Admin Login'}
              </NavLink>
            </li>
          </ul>

          <div className="nav-admin-btn-wrap desktop-only-admin-btn">
            <Link to="/admin" className="nav-admin-btn">
              {isAdminLoggedIn ? (
                <>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '6px' }}><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
                  Admin Panel
                </>
              ) : (
                <>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '6px' }}><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                  Admin Login
                </>
              )}
            </Link>
          </div>
        </div>
      </nav>
    </header>
  )
}

export default Header
