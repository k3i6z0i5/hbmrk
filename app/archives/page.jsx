'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Layout from '../../components/Layout'
import Sidebar from '../../components/Sidebar'
import '../current-issue/CurrentIssue.css'

const Archives = () => {
  const [manuscripts, setManuscripts] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [expandedCards, setExpandedCards] = useState({})

  useEffect(() => {
    fetch(`/api/manuscripts?t=${Date.now()}`, { cache: 'no-store' })
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

  const toggleCard = (id) => {
    setExpandedCards(prev => ({
      ...prev,
      [id]: !prev[id]
    }))
  }

  const isDocFile = (url) => {
    if (!url) return false;
    return url.includes('wordprocessingml') || url.includes('msword') || url.toLowerCase().endsWith('.docx') || url.toLowerCase().endsWith('.doc');
  };

  const handleViewPdf = (pdfUrl, title) => {
    if (!pdfUrl) {
      alert('Manuscript document is not available for this article.');
      return;
    }

    if (pdfUrl.startsWith('data:')) {
      try {
        const parts = pdfUrl.split(';base64,');
        const defaultType = isDocFile(pdfUrl) 
          ? 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' 
          : 'application/pdf';
        const contentType = parts[0].replace('data:', '') || defaultType;
        const byteCharacters = atob(parts[1]);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: contentType });
        const blobUrl = URL.createObjectURL(blob);

        const pdfWindow = window.open(blobUrl, '_blank');
        if (!pdfWindow) {
          window.location.href = blobUrl;
        }
      } catch (e) {
        console.error('Error opening Base64 document:', e);
        alert('Could not render document.');
      }
    } else {
      window.open(pdfUrl, '_blank');
    }
  };

  const handleDownloadPdf = (pdfUrl, title) => {
    if (!pdfUrl) {
      alert('Manuscript document is not available for this article.');
      return;
    }

    const isDoc = isDocFile(pdfUrl);
    const ext = isDoc ? (pdfUrl.includes('msword') || pdfUrl.endsWith('.doc') ? '.doc' : '.docx') : '.pdf';
    const filename = `${(title || 'article').replace(/[^a-z0-9]/gi, '_')}${ext}`;

    if (pdfUrl.startsWith('data:')) {
      try {
        const parts = pdfUrl.split(';base64,');
        const contentType = parts[0].replace('data:', '') || (isDoc ? 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' : 'application/pdf');
        const byteCharacters = atob(parts[1]);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: contentType });
        const blobUrl = URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
      } catch (e) {
        console.error('Error downloading Base64 document:', e);
        alert('Could not download document.');
      }
    } else {
      const link = document.createElement('a');
      link.href = pdfUrl;
      link.download = filename;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  // Get all published articles from all published issues
  const allArticles = manuscripts
    .filter(issue => issue.isPublished)
    .reduce((acc, issue) => {
      const articlesWithMeta = issue.articles.map(art => ({
        ...art,
        volume: issue.volume,
        issue: issue.issue,
        year: issue.year,
        publishDate: issue.publishDate
      }))
      return [...acc, ...articlesWithMeta]
    }, [])

  // Filter articles based on unified query search (author, topic, or title)
  const filteredArticles = allArticles.filter(article => {
    if (searchQuery.trim() === '') return true

    const query = searchQuery.toLowerCase()

    const matchesAuthor = article.authors.some(author => 
      author.name.toLowerCase().includes(query)
    )

    const matchesTopic = article.category && article.category.toLowerCase().includes(query)

    const matchesTitle = article.title.toLowerCase().includes(query)

    return matchesAuthor || matchesTopic || matchesTitle
  })

  if (loading) {
    return (
      <Layout sidebar={<Sidebar />} breadcrumbs={[{ label: 'Home', path: '/' }, { label: 'Archives', path: '/archives' }]}>
        <div className="current-issue-page" style={{ textAlign: 'center', padding: '3rem' }}>
          <div className="coming-soon-icon-wrap" style={{ margin: '0 auto 1.5rem', animation: 'spin 2s linear infinite' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
          </div>
          <h3>Loading Archives...</h3>
        </div>
      </Layout>
    )
  }

  return (
    <Layout sidebar={<Sidebar />} breadcrumbs={[{ label: 'Home', path: '/' }, { label: 'Archives', path: '/archives' }]}>
      <div className="current-issue-page animate-fade-in">
        <div className="current-issue-header">
          <h1 className="page-main-title">Journal Archives</h1>
          <div className="issue-meta-badge">
            {allArticles.length} {allArticles.length === 1 ? 'Article' : 'Articles'} Total
          </div>
        </div>

        <p className="archives-intro-text" style={{ marginBottom: 'var(--space-lg)' }}>
          Browse through all research publications published by Hallmark Business and Management Review (HBMR), organized by topic or searchable by author.
        </p>

        {/* Filter and Search Section */}
        <div className="journal-filters card" style={{ marginBottom: 'var(--space-xl)', padding: 'var(--space-lg)' }}>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label style={{ fontWeight: 600, display: 'block', marginBottom: 'var(--space-xs)' }}>Search Articles by Author Name, Topic, or Title</label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                placeholder="Type author's name, topic (e.g. Marketing, Finance), or title to search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: 'var(--space-sm) var(--space-md) var(--space-sm) 2.5rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid rgba(0,0,0,0.12)',
                  fontFamily: 'var(--font-body)',
                  fontSize: 'var(--font-size-sm)'
                }}
              />
              <svg 
                width="16" 
                height="16" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}
              >
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
            </div>
          </div>
        </div>

        {/* Articles List */}
        <div className="articles-list">
          <h2 className="articles-section-heading">
            Archived Articles
            <span style={{ fontSize: 'var(--font-size-sm)', fontWeight: 'normal', marginLeft: 'var(--space-sm)', color: 'var(--text-muted)' }}>
              ({filteredArticles.length} found)
            </span>
          </h2>
          
          {filteredArticles.length === 0 ? (
            <div className="card" style={{ padding: 'var(--space-2xl)', textAlign: 'center', color: 'var(--text-muted)' }}>
              <p className="no-articles-msg" style={{ fontStyle: 'normal', margin: 0 }}>
                No articles matching your criteria were found. Try modifying your search or filters.
              </p>
            </div>
          ) : (
            filteredArticles.map((article) => (
              <div key={article.id} className="article-item-card card" style={{ padding: '14px 18px' }}>
                {/* Always visible: Topic badge + Title + Authors */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '6px', marginBottom: '8px' }}>
                  <span className="article-category-badge" style={{
                    display: 'inline-block',
                    padding: '3px 8px',
                    borderRadius: 'var(--radius-sm)',
                    background: 'rgba(26, 82, 118, 0.08)',
                    color: 'var(--color-secondary)',
                    fontWeight: 600,
                    fontSize: '10px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}>
                    {article.category || 'General Management'}
                  </span>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 500 }}>
                    {article.year}
                  </span>
                </div>

                <h3 className="article-title" style={{ marginBottom: '6px', fontSize: 'var(--font-size-base)', lineHeight: 1.4 }}>{article.title}</h3>
                
                {/* Author line formatted as a single line label + value */}
                <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)', margin: '0 0 8px 0', display: 'flex', flexWrap: 'wrap', gap: '4px', alignItems: 'center' }}>
                  <strong>Author(s):</strong>
                  {article.authors.map((author, index) => (
                    <span key={index} className="author-tag" style={{ display: 'inline-block', position: 'relative', cursor: 'help', fontWeight: 500, color: 'var(--color-secondary)', borderBottom: '1px dotted rgba(26, 82, 118, 0.4)' }}>
                      {author.name}
                      {author.affiliation && <span className="author-affiliation-popover">{author.affiliation}</span>}
                      {index < article.authors.length - 1 ? ',\u00A0' : ''}
                    </span>
                  ))}
                </div>

                {/* View More / View Less toggle */}
                <button
                  onClick={() => toggleCard(article.id)}
                  style={{
                    background: 'none',
                    border: 'none',
                    padding: 0,
                    color: 'var(--color-accent)',
                    fontWeight: 600,
                    fontSize: 'var(--font-size-xs)',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  {expandedCards[article.id] ? 'View Less' : 'View More'}
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ transform: expandedCards[article.id] ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s ease' }}>
                    <polyline points="6 9 12 15 18 9"/>
                  </svg>
                </button>

                {/* Expanded details */}
                {expandedCards[article.id] && (
                  <div className="animate-fade-in" style={{ marginTop: '10px', borderTop: '1px solid rgba(0,0,0,0.06)', paddingTop: '10px' }}>
                    {/* Pages/DOI row with tight margins */}
                    <div style={{ display: 'flex', gap: '12px', fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)', marginBottom: '8px', alignItems: 'center' }}>
                      <span><strong>Pages:</strong> {article.pages}</span>
                      {article.doi && <span style={{ color: 'rgba(0,0,0,0.1)' }}>|</span>}
                      {article.doi && (
                        <span><strong>DOI:</strong> <a href={`https://doi.org/${article.doi}`} target="_blank" rel="noopener noreferrer">{article.doi}</a></span>
                      )}
                    </div>

                    {/* Abstract with auto height / shrink-to-fit */}
                    {article.abstract && (
                      <div style={{ background: 'rgba(26, 82, 118, 0.03)', borderRadius: 'var(--radius-md)', padding: '10px 14px', marginBottom: '8px', height: 'auto', minHeight: 'auto' }}>
                        <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0, textAlign: 'justify', height: 'auto', minHeight: 'auto' }}>{article.abstract}</p>
                      </div>
                    )}

                    {/* Keywords with tight margins */}
                    {article.keywords && article.keywords.length > 0 && (
                      <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)', borderTop: '1px dashed rgba(26, 82, 118, 0.1)', paddingTop: '6px', marginBottom: '8px', marginTop: '4px' }}>
                        <strong>Keywords:</strong> {article.keywords.join(', ')}
                      </div>
                    )}

                    {/* Actions with tight margins */}
                    <div className="article-card-actions" style={{ marginTop: '6px', gap: '8px' }}>
                      {isDocFile(article.pdfUrl) ? (
                        <>
                          <button
                            onClick={() => handleViewPdf(article.pdfUrl, article.title)}
                            className="btn btn-primary btn-sm"
                            style={{ padding: '6px 12px', fontSize: '12px', cursor: 'pointer' }}
                          >
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                            View Word Doc
                          </button>
                          <button
                            onClick={() => handleDownloadPdf(article.pdfUrl, article.title)}
                            className="btn btn-outline btn-sm"
                            style={{ padding: '6px 12px', fontSize: '12px', cursor: 'pointer' }}
                          >
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                            Download Word Doc
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => handleViewPdf(article.pdfUrl, article.title)}
                            className="btn btn-primary btn-sm"
                            style={{ padding: '6px 12px', fontSize: '12px', cursor: 'pointer' }}
                          >
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                            View PDF
                          </button>
                          <button
                            onClick={() => handleDownloadPdf(article.pdfUrl, article.title)}
                            className="btn btn-outline btn-sm"
                            style={{ padding: '6px 12px', fontSize: '12px', cursor: 'pointer' }}
                          >
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                            Download PDF
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </Layout>
  )
}

export default Archives
