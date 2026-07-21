import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Layout from '../components/Layout'
import Sidebar from '../components/Sidebar'
import './CurrentIssue.css'

const CurrentIssue = () => {
  const [manuscripts, setManuscripts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/manuscripts')
      .then(res => res.json())
      .then(data => {
        setManuscripts(data)
        setLoading(false)
      })
      .catch(err => {
        console.error('Error fetching manuscripts:', err)
        setLoading(false)
      })
  }, [])

  // Find the latest published issue
  const currentIssue = manuscripts
    .filter(issue => issue.isPublished)
    .sort((a, b) => (b.year * 10 + b.issue) - (a.year * 10 + a.issue))[0]

  // Track expanded abstracts
  const [expandedAbstracts, setExpandedAbstracts] = useState({})

  const toggleAbstract = (id) => {
    setExpandedAbstracts(prev => ({
      ...prev,
      [id]: !prev[id]
    }))
  }

  // Render a loading state
  if (loading) {
    return (
      <Layout sidebar={<Sidebar />} breadcrumbs={[{ label: 'Home', path: '/' }, { label: 'Current Issue', path: '/current-issue' }]}>
        <div className="current-issue-page" style={{ textAlign: 'center', padding: '3rem' }}>
          <div className="coming-soon-icon-wrap" style={{ margin: '0 auto 1.5rem', animation: 'spin 2s linear infinite' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
          </div>
          <h3>Loading Latest Issue...</h3>
        </div>
      </Layout>
    )
  }

  // If no issue is published, render the elegant Coming Soon block
  if (!currentIssue) {
    return (
      <Layout sidebar={<Sidebar />} breadcrumbs={[{ label: 'Home', path: '/' }, { label: 'Current Issue', path: '/current-issue' }]}>
        <div className="current-issue-page animate-fade-in">
          <h1 className="page-main-title">Current Issue</h1>
          
          <div className="coming-soon-container card">
            <div className="coming-soon-icon-wrap">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><circle cx="12" cy="13" r="4"/><path d="M12 11v2h2"/></svg>
            </div>
            <h2 className="coming-soon-title">Volume 1, Issue 1 (Coming Soon)</h2>
            <p className="coming-soon-text">
              The inaugural issue of <strong>Hallmark Business and Management Review (HBMR)</strong> is currently under preparation and is scheduled for publication in <strong>2025</strong>. 
            </p>
            <p className="coming-soon-text">
              We are actively accepting submissions for our first issue! If you are an academician, researcher, doctoral scholar, or business professional, we welcome your high-quality research contributions.
            </p>
            
            <div className="coming-soon-actions">
              <Link to="/publish?tab=submission" className="btn btn-primary">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="12" y1="18" x2="12" y2="12"/><line x1="9" y1="15" x2="12" y2="12"/><line x1="15" y1="15" x2="12" y2="12"/></svg>
                Submit Your Manuscript
              </Link>
              <Link to="/publish?tab=guidelines" className="btn btn-outline">
                Read Author Guidelines
              </Link>
            </div>

            <div className="cfp-highlight">
              <h4>Key Details for Volume 1, Issue 1:</h4>
              <ul className="cfp-highlight-list">
                <li><strong>Processing & Publication Charges:</strong> Currently Waived (No Fees)</li>
                <li><strong>Review Process:</strong> Rigorous Double-Blind Peer Review</li>
                <li><strong>Access Policy:</strong> Fully Open Access</li>
                <li><strong>Indexing:</strong> Submissions will be sent to global indexing databases upon publication</li>
              </ul>
            </div>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout sidebar={<Sidebar />} breadcrumbs={[{ label: 'Home', path: '/' }, { label: 'Current Issue', path: '/current-issue' }]}>
      <div className="current-issue-page animate-fade-in">
        <div className="current-issue-header">
          <h1 className="page-main-title">Current Issue</h1>
          <div className="issue-meta-badge">
            Vol. {currentIssue.volume} No. {currentIssue.issue} ({currentIssue.year})
          </div>
        </div>

        <div className="issue-details-info card">
          <h3>Volume {currentIssue.volume}, Issue {currentIssue.issue}</h3>
          <p className="issue-pub-date"><strong>Published Date:</strong> {currentIssue.publishDate}</p>
          <p className="issue-desc">
            All papers in this issue are published under the open access policy and are licensed under the Creative Commons Attribution license. Readers can download and read full-text PDFs below.
          </p>
        </div>

        <div className="articles-list">
          <h2 className="articles-section-heading">Articles in this Issue</h2>
          {currentIssue.articles.length === 0 ? (
            <p className="no-articles-msg">No articles published in this issue yet.</p>
          ) : (
            currentIssue.articles.map((article) => (
              <div key={article.id} className="article-item-card card">
                <h3 className="article-title">{article.title}</h3>
                
                <div className="article-authors">
                  {article.authors.map((author, index) => (
                    <span key={index} className="author-tag">
                      {author.name}
                      <span className="author-affiliation-popover">{author.affiliation}</span>
                      {index < article.authors.length - 1 ? ', ' : ''}
                    </span>
                  ))}
                </div>

                <div className="article-stats">
                  <span><strong>Pages:</strong> {article.pages}</span>
                  {article.doi && (
                    <span className="article-stat-sep">|</span>
                  )}
                  {article.doi && (
                    <span><strong>DOI:</strong> <a href={`https://doi.org/${article.doi}`} target="_blank" rel="noopener noreferrer">{article.doi}</a></span>
                  )}
                </div>

                {/* Collapsible Abstract */}
                <div className="article-abstract-collapsible">
                  <button 
                    className={`btn-abstract-toggle ${expandedAbstracts[article.id] ? 'expanded' : ''}`}
                    onClick={() => toggleAbstract(article.id)}
                  >
                    <span>{expandedAbstracts[article.id] ? 'Hide Abstract' : 'Show Abstract'}</span>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>
                  </button>
                  {expandedAbstracts[article.id] && (
                    <div className="article-abstract-content animate-fade-in">
                      <p>{article.abstract}</p>
                      {article.keywords && article.keywords.length > 0 && (
                        <div className="article-keywords">
                          <strong>Keywords:</strong> {article.keywords.join(', ')}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="article-card-actions">
                  <a href={article.pdfUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-sm">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                    View PDF
                  </a>
                  <a href={article.pdfUrl} download className="btn btn-outline btn-sm">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                    Download PDF
                  </a>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </Layout>
  )
}

export default CurrentIssue
