'use client'

import Link from 'next/link'
import './Footer.css'

const Footer = () => {
  return (
    <footer className="site-footer" id="site-footer">
      <div className="footer-gold-line"></div>
      <div className="container footer-content">
        <div className="footer-grid">
          {/* About Column */}
          <div className="footer-col">
            <h3 className="footer-heading">About HBMR</h3>
            <p className="footer-desc">
              Hallmark Business and Management Review (HBMR) is a biannual, peer-reviewed, 
              double-blind online journal published by Hallmark Business School, Tamil Nadu. 
              Dedicated to promoting high-quality research in business and management.
            </p>
            <div className="footer-badge">
              <span className="issn-label">e-ISSN</span>
              <span className="issn-value">Applied</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-col">
            <h3 className="footer-heading">Quick Links</h3>
            <ul className="footer-links">
              <li><Link href="/about">About the Journal</Link></li>
              <li><Link href="/about?tab=aim">Aim & Scope</Link></li>
              <li><Link href="/editorial-board">Editorial Board</Link></li>
              <li><Link href="/about?tab=advisory">Advisory Board</Link></li>
              <li><Link href="/publish">Author Guidelines</Link></li>
              <li><Link href="/about?tab=privacy">Privacy Statement</Link></li>
              <li><Link href="/contact">Contact</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="footer-col">
            <h3 className="footer-heading">Contact Us</h3>
            <div className="footer-contact-list">
              <div className="footer-contact-item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                <span>Hallmark Business School,<br/>Pirattiyur-Allithurai Road,<br/>Santhapuram, Thiruchirapalli-620102,<br/>Tamilnadu, India.</span>
              </div>
              <div className="footer-contact-item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                <a href="mailto:editorhmbr@hbs.ac.in">editorhmbr@hbs.ac.in</a>
              </div>
              <div className="footer-contact-item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                <a href="tel:7373015999">73730 15999</a>
              </div>
              <div className="footer-contact-item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
                <a href="https://www.hbs.ac.in" target="_blank" rel="noopener noreferrer">www.hbs.ac.in</a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="footer-bottom">
        <div className="container footer-bottom-content">
          <p>&copy; {new Date().getFullYear()} Hallmark Business and Management Review (HBMR). All rights reserved.</p>
          <p className="footer-publisher">Published by Hallmark Business School, Tamil Nadu, India.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
