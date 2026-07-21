import { useState, useEffect } from 'react'
import Layout from '../components/Layout'
import './Admin.css'

const Admin = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [token, setToken] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  // Manuscripts Database state
  const [manuscripts, setManuscripts] = useState([])

  // Forms states
  const [newIssue, setNewIssue] = useState({
    volume: '',
    issue: '',
    year: new Date().getFullYear(),
    publishDate: '',
    isPublished: false
  })

  const [newArticle, setNewArticle] = useState({
    issueKey: '', // "volume-issue"
    title: '',
    abstract: '',
    keywords: '',
    pages: '',
    doi: ''
  })
  
  const [authors, setAuthors] = useState([{ name: '', affiliation: '' }])
  const [pdfFile, setPdfFile] = useState(null)
  
  // Loading indicators
  const [loadingIssues, setLoadingIssues] = useState(false)
  const [loadingArticles, setLoadingArticles] = useState(false)

  // Check login state on mount
  useEffect(() => {
    const savedToken = localStorage.getItem('hbmr_admin_token')
    if (savedToken) {
      setToken(savedToken)
      setIsLoggedIn(true)
      fetchData()
    }
  }, [token])

  const fetchData = async () => {
    try {
      const res = await fetch('/api/manuscripts')
      const data = await res.json()
      setManuscripts(data)
    } catch (err) {
      console.error('Error fetching manuscripts:', err)
    }
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    setErrorMessage('')
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      })
      const data = await res.json()

      if (res.ok) {
        localStorage.setItem('hbmr_admin_token', data.token)
        setToken(data.token)
        setIsLoggedIn(true)
        setUsername('')
        setPassword('')
        fetchData()
      } else {
        setErrorMessage(data.error || 'Login failed')
      }
    } catch (err) {
      setErrorMessage('Server connection failed.')
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('hbmr_admin_token')
    setToken('')
    setIsLoggedIn(false)
    setSuccessMessage('Logged out successfully.')
    setTimeout(() => setSuccessMessage(''), 3000)
  }

  const handleCreateIssue = async (e) => {
    e.preventDefault()
    setErrorMessage('')
    setSuccessMessage('')
    setLoadingIssues(true)

    try {
      const res = await fetch('/api/manuscripts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newIssue)
      })
      const data = await res.json()

      if (res.ok) {
        setSuccessMessage(`Volume ${newIssue.volume} Issue ${newIssue.issue} created successfully!`)
        setNewIssue({
          volume: '',
          issue: '',
          year: new Date().getFullYear(),
          publishDate: '',
          isPublished: false
        })
        fetchData()
      } else {
        setErrorMessage(data.error || 'Failed to create issue')
      }
    } catch (err) {
      setErrorMessage('Server error occurred.')
    } finally {
      setLoadingIssues(false)
    }
  }

  const handleTogglePublish = async (volume, issue, currentStatus) => {
    setErrorMessage('')
    setSuccessMessage('')
    try {
      const res = await fetch('/api/manuscripts/publish-status', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ volume, issue, isPublished: !currentStatus })
      })
      if (res.ok) {
        setSuccessMessage(`Issue status updated to ${!currentStatus ? 'Published' : 'Draft'}`)
        fetchData()
      } else {
        const data = await res.json()
        setErrorMessage(data.error || 'Failed to update status')
      }
    } catch (err) {
      setErrorMessage('Connection failed.')
    }
  }

  // Handle Author Fields
  const handleAuthorChange = (index, field, value) => {
    const updated = [...authors]
    updated[index][field] = value
    setAuthors(updated)
  }

  const addAuthorField = () => {
    setAuthors([...authors, { name: '', affiliation: '' }])
  }

  const removeAuthorField = (index) => {
    if (authors.length > 1) {
      setAuthors(authors.filter((_, i) => i !== index))
    }
  }

  // Handle Article Submit
  const handleUploadArticle = async (e) => {
    e.preventDefault()
    setErrorMessage('')
    setSuccessMessage('')
    setLoadingArticles(true)

    if (!newArticle.issueKey) {
      setErrorMessage('Please select a Volume & Issue.')
      setLoadingArticles(false)
      return
    }

    if (!pdfFile) {
      setErrorMessage('Please select a PDF file to upload.')
      setLoadingArticles(false)
      return
    }

    const [volume, issue] = newArticle.issueKey.split('-')

    // Prepare Multipart Form Data
    const formData = new FormData()
    formData.append('volume', volume)
    formData.append('issue', issue)
    formData.append('title', newArticle.title)
    formData.append('abstract', newArticle.abstract)
    formData.append('pages', newArticle.pages)
    formData.append('doi', newArticle.doi)
    formData.append('keywords', JSON.stringify(newArticle.keywords.split(',').map(k => k.trim())))
    formData.append('authors', JSON.stringify(authors.filter(a => a.name.trim() !== '')))
    formData.append('pdf', pdfFile)

    try {
      const res = await fetch('/api/manuscripts/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      })
      const data = await res.json()

      if (res.ok) {
        setSuccessMessage('Article uploaded and published successfully!')
        setNewArticle({
          issueKey: '',
          title: '',
          abstract: '',
          keywords: '',
          pages: '',
          doi: ''
        })
        setAuthors([{ name: '', affiliation: '' }])
        setPdfFile(null)
        // Reset file input element
        document.getElementById('pdf-file-input').value = ''
        fetchData()
      } else {
        setErrorMessage(data.error || 'Failed to upload article')
      }
    } catch (err) {
      setErrorMessage('Server connection error.')
    } finally {
      setLoadingArticles(false)
    }
  }

  // Handle Delete Article
  const handleDeleteArticle = async (volume, issue, articleId, articleTitle) => {
    if (!window.confirm(`Are you sure you want to permanently delete the article: "${articleTitle}"?`)) {
      return
    }

    setErrorMessage('')
    setSuccessMessage('')

    try {
      const res = await fetch(`/api/manuscripts/${volume}/${issue}/${articleId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (res.ok) {
        setSuccessMessage('Article deleted successfully.')
        fetchData()
      } else {
        const data = await res.json()
        setErrorMessage(data.error || 'Failed to delete article')
      }
    } catch (err) {
      setErrorMessage('Server connection error.')
    }
  }

  // Handle Delete Entire Volume/Issue (only shown for empty volumes)
  const handleDeleteVolume = async (volume, issue) => {
    const confirmed = window.confirm(
      `Delete Volume ${volume}, Issue ${issue}?\n\nThis empty volume will be permanently removed.`
    )
    if (!confirmed) return

    setErrorMessage('')
    setSuccessMessage('')

    try {
      const res = await fetch(`/api/manuscripts/${volume}/${issue}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (res.ok) {
        setSuccessMessage(`Volume ${volume}, Issue ${issue} and all its articles have been permanently deleted.`)
        fetchData()
      } else {
        const data = await res.json()
        setErrorMessage(data.error || 'Failed to delete volume')
      }
    } catch (err) {
      setErrorMessage('Server connection error.')
    }
  }

  // --- RENDERING ---

  if (!isLoggedIn) {
    return (
      <Layout breadcrumbs={[{ label: 'Home', path: '/' }, { label: 'Admin Login', path: '/admin' }]}>
        <div className="admin-login-container animate-fade-in-up">
          <div className="login-card card">
            <h2>Admin Authentication</h2>
            <p className="login-subtitle">Sign in to manage HBMR manuscripts and issues.</p>
            
            {errorMessage && <div className="admin-alert error">{errorMessage}</div>}
            
            <form onSubmit={handleLogin} className="login-form">
              <div className="form-group">
                <label htmlFor="username">Username</label>
                <input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  placeholder="Enter administrator username"
                />
              </div>
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Enter administrator password"
                />
              </div>
              <button type="submit" className="btn btn-primary btn-block">Sign In</button>
            </form>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout breadcrumbs={[{ label: 'Home', path: '/' }, { label: 'Admin Dashboard', path: '/admin' }]}>
      <div className="admin-dashboard animate-fade-in">
        <div className="admin-header-row">
          <div>
            <h1 className="page-main-title">Admin Dashboard</h1>
            <p className="admin-welcome">Welcome back, Administrator</p>
          </div>
          <button onClick={handleLogout} className="btn btn-outline logout-btn">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
            Sign Out
          </button>
        </div>

        {/* Global Feedback Banner */}
        {errorMessage && <div className="admin-alert error animate-fade-in">{errorMessage}</div>}
        {successMessage && <div className="admin-alert success animate-fade-in">{successMessage}</div>}

        <div className="admin-grid">
          {/* Left Column: Management Forms */}
          <div className="admin-forms-col">
            
            {/* Create Issue Panel */}
            <div className="admin-panel card">
              <h3>Create Volume / Issue</h3>
              <form onSubmit={handleCreateIssue} className="admin-form-fields">
                <div className="form-row">
                  <div className="form-group">
                    <label>Volume Number *</label>
                    <input
                      type="number"
                      value={newIssue.volume}
                      onChange={(e) => setNewIssue({ ...newIssue, volume: e.target.value })}
                      required
                      placeholder="e.g., 1"
                    />
                  </div>
                  <div className="form-group">
                    <label>Issue Number *</label>
                    <input
                      type="number"
                      value={newIssue.issue}
                      onChange={(e) => setNewIssue({ ...newIssue, issue: e.target.value })}
                      required
                      placeholder="e.g., 1"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Year *</label>
                    <input
                      type="number"
                      value={newIssue.year}
                      onChange={(e) => setNewIssue({ ...newIssue, year: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Publish Date Label</label>
                    <input
                      type="text"
                      value={newIssue.publishDate}
                      onChange={(e) => setNewIssue({ ...newIssue, publishDate: e.target.value })}
                      placeholder="e.g., September 2025"
                    />
                  </div>
                </div>

                <div className="form-group checkbox-group">
                  <input
                    type="checkbox"
                    id="isPublished"
                    checked={newIssue.isPublished}
                    onChange={(e) => setNewIssue({ ...newIssue, isPublished: e.target.checked })}
                  />
                  <label htmlFor="isPublished">Publish immediately (make visible to users)</label>
                </div>

                <button type="submit" className="btn btn-primary" disabled={loadingIssues}>
                  {loadingIssues ? 'Creating...' : 'Create Issue'}
                </button>
              </form>
            </div>

            {/* Upload Article Panel */}
            <div className="admin-panel card" style={{ marginTop: 'var(--space-xl)' }}>
              <h3>Upload & Publish Manuscript</h3>
              <form onSubmit={handleUploadArticle} className="admin-form-fields">
                <div className="form-group">
                  <label>Target Volume & Issue *</label>
                  <select
                    value={newArticle.issueKey}
                    onChange={(e) => setNewArticle({ ...newArticle, issueKey: e.target.value })}
                    required
                  >
                    <option value="">-- Select Volume and Issue --</option>
                    {manuscripts.map(issue => (
                      <option key={`${issue.volume}-${issue.issue}`} value={`${issue.volume}-${issue.issue}`}>
                        Volume {issue.volume}, Issue {issue.issue} ({issue.year}) {issue.isPublished ? '[Published]' : '[Draft]'}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Article Title *</label>
                  <input
                    type="text"
                    value={newArticle.title}
                    onChange={(e) => setNewArticle({ ...newArticle, title: e.target.value })}
                    required
                    placeholder="Enter full article title"
                  />
                </div>

                {/* Dynamic Authors Section */}
                <div className="form-group authors-input-section">
                  <label>Authors list *</label>
                  {authors.map((author, index) => (
                    <div key={index} className="author-field-row">
                      <input
                        type="text"
                        placeholder="Author Name"
                        value={author.name}
                        onChange={(e) => handleAuthorChange(index, 'name', e.target.value)}
                        required
                      />
                      <input
                        type="text"
                        placeholder="Affiliation / Department"
                        value={author.affiliation}
                        onChange={(e) => handleAuthorChange(index, 'affiliation', e.target.value)}
                        required
                      />
                      {authors.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeAuthorField(index)}
                          className="btn-remove-author"
                          title="Remove author"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  ))}
                  <button type="button" onClick={addAuthorField} className="btn-add-author">
                    + Add Another Author
                  </button>
                </div>

                <div className="form-group">
                  <label>Abstract *</label>
                  <textarea
                    rows="5"
                    value={newArticle.abstract}
                    onChange={(e) => setNewArticle({ ...newArticle, abstract: e.target.value })}
                    required
                    placeholder="Paste the abstract text here"
                  ></textarea>
                </div>

                <div className="form-group">
                  <label>Keywords (comma-separated)</label>
                  <input
                    type="text"
                    value={newArticle.keywords}
                    onChange={(e) => setNewArticle({ ...newArticle, keywords: e.target.value })}
                    placeholder="e.g., AI, Supply Chain, Retail Management"
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Page Range</label>
                    <input
                      type="text"
                      value={newArticle.pages}
                      onChange={(e) => setNewArticle({ ...newArticle, pages: e.target.value })}
                      placeholder="e.g., 1 - 15"
                    />
                  </div>
                  <div className="form-group">
                    <label>DOI String</label>
                    <input
                      type="text"
                      value={newArticle.doi}
                      onChange={(e) => setNewArticle({ ...newArticle, doi: e.target.value })}
                      placeholder="e.g., 10.5281/hbmr.2025.0101"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Manuscript PDF File *</label>
                  <input
                    type="file"
                    id="pdf-file-input"
                    accept="application/pdf"
                    onChange={(e) => setPdfFile(e.target.files[0])}
                    required
                  />
                  <p className="file-help">Only PDF documents are accepted.</p>
                </div>

                <button type="submit" className="btn btn-accent btn-block" disabled={loadingArticles}>
                  {loadingArticles ? 'Uploading File & Publishing...' : 'Upload PDF & Publish Article'}
                </button>
              </form>
            </div>
          </div>

          {/* Right Column: Database Tree Management */}
          <div className="admin-tree-col">
            <div className="admin-panel card">
              <h3>Issues & Articles Management</h3>
              {manuscripts.length === 0 ? (
                <p className="no-issues-msg">No issues created in the system yet.</p>
              ) : (
                <div className="issues-tree-list">
                  {manuscripts.map(issue => (
                    <div key={`${issue.volume}-${issue.issue}`} className="tree-issue-item">
                      <div className="tree-issue-header">
                        <div>
                          <strong>Volume {issue.volume}, Issue {issue.issue}</strong> ({issue.year})
                          <span className={`issue-status-tag ${issue.isPublished ? 'published' : 'draft'}`}>
                            {issue.isPublished ? 'Published' : 'Draft'}
                          </span>
                        </div>
                        <div className="tree-issue-actions">
                          <button
                            onClick={() => handleTogglePublish(issue.volume, issue.issue, issue.isPublished)}
                            className={`btn btn-sm ${issue.isPublished ? 'btn-outline' : 'btn-primary'}`}
                          >
                            {issue.isPublished ? 'Keep as Draft' : 'Make Live'}
                          </button>
                          {issue.articles.length === 0 && (
                            <button
                              onClick={() => handleDeleteVolume(issue.volume, issue.issue, 0)}
                              className="btn-delete-volume"
                              title="Delete this empty volume"
                            >
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
                              Delete Volume
                            </button>
                          )}
                        </div>
                      </div>

                      <div className="tree-articles-box">
                        {issue.articles.length === 0 ? (
                          <p className="tree-empty-articles">No manuscripts published inside this issue.</p>
                        ) : (
                          <ul className="tree-articles-list">
                            {issue.articles.map(article => (
                              <li key={article.id} className="tree-article-row-item">
                                <div className="tree-article-title-col">
                                  <span className="tree-article-title">{article.title}</span>
                                  <span className="tree-article-pages">Pages: {article.pages}</span>
                                </div>
                                <button
                                  onClick={() => handleDeleteArticle(issue.volume, issue.issue, article.id, article.title)}
                                  className="btn-delete-article"
                                  title="Delete Article"
                                >
                                  Delete
                                </button>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default Admin
