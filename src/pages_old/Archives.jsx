import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Layout from '../components/Layout'
import Sidebar from '../components/Sidebar'
import './Archives.css'

const Archives = () => {
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

  // Find all published issues, ordered latest first
  const publishedIssues = manuscripts
    .filter(issue => issue.isPublished)
    .sort((a, b) => (b.year * 10 + b.issue) - (a.year * 10 + a.issue))

  // Track expanded issues in archives
  const [expandedIssue, setExpandedIssue] = useState(null)

  const toggleIssue = (issueKey) => {
    setExpandedIssue(prev => (prev === issueKey ? null : issueKey))
  }

  // Render a loading state
  if (loading) {
    return (
      <Layout sidebar={<Sidebar />} breadcrumbs={[{ label: 'Home', path: '/' }, { label: 'Archives', path: '/archives' }]}>
        <div className="archives-page" style={{ textAlign: 'center', padding: '3rem' }}>
          <div className="coming-soon-icon-wrap" style={{ margin: '0 auto 1.5rem', animation: 'spin 2s linear infinite' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
          </div>
          <h3>Loading Archives...</h3>
        </div>
      </Layout>
    )
  }

  // If no issues are published, show the Coming Soon Archives page
  if (publishedIssues.length === 0) {
    return (
      <Layout sidebar={<Sidebar />} breadcrumbs={[{ label: 'Home', path: '/' }, { label: 'Archives', path: '/archives' }]}>
        <div className="archives-page animate-fade-in">
          <h1 className="page-main-title">Archives</h1>
          
          <div className="coming-soon-container card">
            <div className="coming-soon-icon-wrap archives-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M4 4.5A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5v-15z"/></svg>
            </div>
            <h2 className="coming-soon-title">No Issues Published Yet</h2>
            <p className="coming-soon-text">
              Hallmark Business and Management Review (HBMR) is starting publication in <strong>2025</strong>. 
            </p>
            <p className="coming-soon-text">
              Once issues are finalized, they will be archived here. All issues will be fully Open Access and permanently available for download and reading.
            </p>
            
            <div className="coming-soon-actions">
              <Link to="/current-issue" className="btn btn-primary">
                View Current/Upcoming Issue
              </Link>
              <Link to="/" className="btn btn-outline">
                Return Home
              </Link>
            </div>
          </div>
        </div>
      </Layout>
    )
  }

  // Group published issues by Year
  const issuesByYear = publishedIssues.reduce((acc, issue) => {
    if (!acc[issue.year]) {
      acc[issue.year] = []
    }
    acc[issue.year].push(issue)
    return acc
  }, {})

  const years = Object.keys(issuesByYear).sort((a, b) => b - a)

  return (
    <Layout sidebar={<Sidebar />} breadcrumbs={[{ label: 'Home', path: '/' }, { label: 'Archives', path: '/archives' }]}>
      <div className="archives-page animate-fade-in">
        <h1 className="page-main-title">Journal Archives</h1>
        <p className="archives-intro-text">
          Browse through all past volumes and issues published by the Hallmark Business and Management Review (HBMR). Every published article is available for online reading or PDF download.
        </p>

        <div className="archives-timeline">
          {years.map(year => (
            <div key={year} className="archives-year-group">
              <h2 className="archive-year-heading">{year}</h2>
              <div className="archives-issues-grid">
                {issuesByYear[year].map(issue => {
                  const issueKey = `${issue.volume}-${issue.issue}`;
                  const isExpanded = expandedIssue === issueKey;

                  return (
                    <div key={issueKey} className="archive-issue-block card">
                      <div className="archive-issue-header-row" onClick={() => toggleIssue(issueKey)}>
                        <div className="archive-issue-title-wrap">
                          <span className="archive-book-icon">📚</span>
                          <div>
                            <h3>Volume {issue.volume}, Issue {issue.issue}</h3>
                            <p className="archive-issue-date">Published: {issue.publishDate}</p>
                          </div>
                        </div>
                        <button className={`archive-expand-indicator-btn ${isExpanded ? 'active' : ''}`}>
                          <span className="expand-text">{isExpanded ? 'Hide Articles' : 'Show Articles'}</span>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>
                        </button>
                      </div>

                      {isExpanded && (
                        <div className="archive-issue-articles animate-fade-in">
                          {issue.articles.length === 0 ? (
                            <p className="no-articles-msg">No articles published in this issue.</p>
                          ) : (
                            <div className="archive-articles-list">
                              {issue.articles.map((article, idx) => (
                                <div key={article.id} className="archive-article-row">
                                  <div className="archive-article-main">
                                    <span className="archive-article-num">{idx + 1}.</span>
                                    <div>
                                      <h4 className="archive-article-title">{article.title}</h4>
                                      <p className="archive-article-authors-text">
                                        {article.authors.map(a => a.name).join(', ')}
                                      </p>
                                      <div className="archive-article-meta-row">
                                        <span>Pages: {article.pages}</span>
                                        {article.doi && (
                                          <>
                                            <span className="meta-dot">•</span>
                                            <span>DOI: <a href={`https://doi.org/${article.doi}`} target="_blank" rel="noopener noreferrer">{article.doi}</a></span>
                                          </>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                  <div className="archive-article-links">
                                    <a href={article.pdfUrl} target="_blank" rel="noopener noreferrer" className="btn btn-outline btn-sm">
                                      PDF
                                    </a>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  )
}

export default Archives
