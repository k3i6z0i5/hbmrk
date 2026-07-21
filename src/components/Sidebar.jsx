import { Link } from 'react-router-dom'
import './Sidebar.css'

const Sidebar = () => {
  const categories = [
    'Finance & Accounting',
    'Human Resource Management',
    'Marketing & Consumer Behavior',
    'Operations & Supply Chain',
    'Business Analytics',
    'Entrepreneurship & Innovation',
    'Economics & Public Policy',
    'International Business',
    'Strategic Management'
  ]

  return (
    <aside className="sidebar" id="sidebar">
      {/* ISSN Card */}
      <div className="sidebar-card issn-card">
        <div className="issn-badge-large">
          <span className="issn-tag">e-ISSN</span>
          <span className="issn-number">Applied</span>
        </div>
      </div>

      {/* Journal Info */}
      <div className="sidebar-card">
        <h3 className="sidebar-title">Journal Info</h3>
        <ul className="journal-info-list">
          <li>
            <span className="info-label">Publisher</span>
            <span className="info-value">Hallmark Business School</span>
          </li>
          <li>
            <span className="info-label">Frequency</span>
            <span className="info-value">Biannual</span>
          </li>
          <li>
            <span className="info-label">Language</span>
            <span className="info-value">English</span>
          </li>
          <li>
            <span className="info-label">Starting Year</span>
            <span className="info-value">2025</span>
          </li>
          <li>
            <span className="info-label">Format</span>
            <span className="info-value">Online</span>
          </li>
          <li>
            <span className="info-label">Subject</span>
            <span className="info-value">Management</span>
          </li>
        </ul>
      </div>

      {/* Make a Submission CTA */}
      <div className="sidebar-card cta-card">
        <Link to="/publish?tab=submission" className="sidebar-cta-btn">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="12" y1="18" x2="12" y2="12"/><line x1="9" y1="15" x2="12" y2="12"/><line x1="15" y1="15" x2="12" y2="12"/></svg>
          Make a Submission
        </Link>
      </div>

      {/* Information Links */}
      <div className="sidebar-card">
        <h3 className="sidebar-title">Information</h3>
        <ul className="sidebar-links">
          <li><Link to="/publish?tab=guidelines">For Authors</Link></li>
          <li><Link to="/publish?tab=peer-review">For Reviewers</Link></li>
          <li><Link to="/about?tab=open-access">Open Access Policy</Link></li>
        </ul>
      </div>

      {/* Browse Categories */}
      <div className="sidebar-card">
        <h3 className="sidebar-title">Browse Categories</h3>
        <ul className="category-list">
          {categories.map((cat, index) => (
            <li key={index}>
              <span className="category-dot"></span>
              {cat}
            </li>
          ))}
        </ul>
      </div>
    </aside>
  )
}

export default Sidebar
