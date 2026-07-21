'use client'

import { useState, useEffect } from 'react'
import Layout from '../../components/Layout'
import { signInWithGoogle, signOutUser, onAuthChange, isFirebaseConfigured } from '../../lib/firebase'
import './Admin.css'

const Admin = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [token, setToken] = useState('')
  const [adminUser, setAdminUser] = useState(null)
  const [loginLoading, setLoginLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  // Manuscripts Database state
  const [manuscripts, setManuscripts] = useState([])

  // Forms states
  const [newIssue, setNewIssue] = useState({
    volume: 1,
    issue: '',
    year: new Date().getFullYear(),
    publishDate: '',
    isPublished: false
  })

  const [newArticle, setNewArticle] = useState({
    issueKey: '', // "volume-issue"
    title: '',
    category: 'Finance & Accounting',
    abstract: '',
    keywords: '',
    pages: '',
    doi: ''
  })
  
  const [authors, setAuthors] = useState([{ name: '', affiliation: '' }])
  const [pdfFile, setPdfFile] = useState(null)

  // Edit article state
  const [editingArticleId, setEditingArticleId] = useState(null)
  const [editForm, setEditForm] = useState({})
  const [editAuthors, setEditAuthors] = useState([])
  const [loadingEdit, setLoadingEdit] = useState(false)

  // Loading indicators
  const [loadingIssues, setLoadingIssues] = useState(false)
  const [loadingArticles, setLoadingArticles] = useState(false)

  // Check login state and listen to Firebase Auth changes on mount
  useEffect(() => {
    // 1. Restore local session token if saved
    const savedToken = typeof window !== 'undefined' ? localStorage.getItem('hbmr_admin_token') : null
    const savedEmail = typeof window !== 'undefined' ? localStorage.getItem('hbmr_admin_email') : null
    const savedName = typeof window !== 'undefined' ? localStorage.getItem('hbmr_admin_name') : null
    const savedPhoto = typeof window !== 'undefined' ? localStorage.getItem('hbmr_admin_photo') : null

    if (savedToken) {
      setToken(savedToken)
      setAdminUser({ email: savedEmail, displayName: savedName, photoURL: savedPhoto })
      setIsLoggedIn(true)
      fetchData()
    }

    // 2. Subscribe to Firebase Auth state
    const unsubscribe = onAuthChange((userSession) => {
      if (userSession) {
        localStorage.setItem('hbmr_admin_token', userSession.token)
        if (userSession.email) localStorage.setItem('hbmr_admin_email', userSession.email)
        if (userSession.displayName) localStorage.setItem('hbmr_admin_name', userSession.displayName)
        if (userSession.photoURL) localStorage.setItem('hbmr_admin_photo', userSession.photoURL)

        setToken(userSession.token)
        setAdminUser(userSession)
        setIsLoggedIn(true)
        fetchData()
      }
    })

    return () => unsubscribe()
  }, [])

  const fetchData = async () => {
    try {
      const res = await fetch('/api/manuscripts')
      const data = await res.json()
      if (Array.isArray(data)) {
        setManuscripts(data)
      }
    } catch (err) {
      console.error('Error fetching manuscripts:', err)
    }
  }

  // Handle Google / Gmail Sign-In via Firebase
  const handleGoogleLogin = async () => {
    setErrorMessage('')
    setLoginLoading(true)

    try {
      const userSession = await signInWithGoogle()

      // Validate session with server API
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: userSession.email, idToken: userSession.token })
      })

      const data = await res.json()

      if (res.ok) {
        const activeToken = data.token || userSession.token
        localStorage.setItem('hbmr_admin_token', activeToken)
        localStorage.setItem('hbmr_admin_email', userSession.email)
        if (userSession.displayName) localStorage.setItem('hbmr_admin_name', userSession.displayName)
        if (userSession.photoURL) localStorage.setItem('hbmr_admin_photo', userSession.photoURL)

        setToken(activeToken)
        setAdminUser(userSession)
        setIsLoggedIn(true)
        setSuccessMessage(`Welcome, ${userSession.displayName || userSession.email}!`)
        setTimeout(() => setSuccessMessage(''), 4000)
        fetchData()
      } else {
        setErrorMessage(data.error || 'Access Denied')
      }
    } catch (err) {
      console.error('Login error:', err)
      setErrorMessage(err.message || 'Google Sign-In failed. Please try again.')
    } finally {
      setLoginLoading(false)
    }
  }

  const handleLogout = async () => {
    await signOutUser()
    localStorage.removeItem('hbmr_admin_token')
    localStorage.removeItem('hbmr_admin_email')
    localStorage.removeItem('hbmr_admin_name')
    localStorage.removeItem('hbmr_admin_photo')
    setToken('')
    setAdminUser(null)
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
        setSuccessMessage(`Issue ${newIssue.issue} created successfully in Firebase DB!`)
        setNewIssue({
          volume: 1,
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
      setErrorMessage('Please select an Issue.')
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
    formData.append('category', newArticle.category)
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
        setSuccessMessage('Article uploaded and published to Firebase DB successfully!')
        setNewArticle({
          issueKey: '',
          title: '',
          category: 'Finance & Accounting',
          abstract: '',
          keywords: '',
          pages: '',
          doi: ''
        })
        setAuthors([{ name: '', affiliation: '' }])
        setPdfFile(null)
        const fileInput = document.getElementById('pdf-file-input')
        if (fileInput) fileInput.value = ''
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

  // Handle Edit Article
  const handleEditClick = (article, volume, issue) => {
    if (editingArticleId === article.id) {
      setEditingArticleId(null)
      return
    }
    setEditingArticleId(article.id)
    setEditForm({
      volume,
      issue,
      title:    article.title || '',
      category: article.category || 'Finance & Accounting',
      abstract: article.abstract || '',
      keywords: Array.isArray(article.keywords) ? article.keywords.join(', ') : (article.keywords || ''),
      pages:    article.pages || '',
      doi:      article.doi || ''
    })
    setEditAuthors(
      Array.isArray(article.authors) && article.authors.length > 0
        ? article.authors.map(a => ({ name: a.name || '', affiliation: a.affiliation || '' }))
        : [{ name: '', affiliation: '' }]
    )
  }

  const handleSaveEdit = async (articleId) => {
    setLoadingEdit(true)
    setErrorMessage('')
    setSuccessMessage('')
    try {
      const res = await fetch(`/api/manuscripts/${editForm.volume}/${editForm.issue}/${articleId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title:    editForm.title,
          category: editForm.category,
          abstract: editForm.abstract,
          keywords: editForm.keywords.split(',').map(k => k.trim()).filter(Boolean),
          pages:    editForm.pages,
          doi:      editForm.doi,
          authors:  editAuthors.filter(a => a.name.trim() !== '')
        })
      })
      if (res.ok) {
        setSuccessMessage('Article updated successfully in Firebase DB!')
        setEditingArticleId(null)
        fetchData()
      } else {
        const data = await res.json()
        setErrorMessage(data.error || 'Failed to update article')
      }
    } catch (err) {
      setErrorMessage('Server connection error.')
    } finally {
      setLoadingEdit(false)
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
        setSuccessMessage('Article deleted successfully from Firebase DB.')
        fetchData()
      } else {
        const data = await res.json()
        setErrorMessage(data.error || 'Failed to delete article')
      }
    } catch (err) {
      setErrorMessage('Server connection error.')
    }
  }

  // Handle Delete Entire Issue
  const handleDeleteVolume = async (volume, issue) => {
    const confirmed = window.confirm(
      `Delete Issue ${issue}?\n\nThis empty issue will be permanently removed from Firebase DB.`
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
        setSuccessMessage(`Issue ${issue} permanently deleted from Firebase DB.`)
        fetchData()
      } else {
        const data = await res.json()
        setErrorMessage(data.error || 'Failed to delete issue')
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
            <h2>Admin Portal</h2>
            <p className="login-subtitle">Sign in using your Gmail account via Firebase Authentication.</p>
            
            {errorMessage && <div className="admin-alert error">{errorMessage}</div>}
            {successMessage && <div className="admin-alert success">{successMessage}</div>}

            <button 
              type="button" 
              onClick={handleGoogleLogin} 
              className="google-signin-btn"
              disabled={loginLoading}
            >
              <svg className="google-icon" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
              </svg>
              {loginLoading ? 'Authenticating with Google...' : 'Sign in with Gmail (Google)'}
            </button>

            <p className="file-help" style={{ marginTop: '1.2rem', fontSize: '11px', color: '#666' }}>
              🔒 Protected by Firebase Authentication. Only authorized Gmail administrator accounts can sign in.
            </p>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout breadcrumbs={[{ label: 'Home', path: '/' }, { label: 'Admin Dashboard', path: '/admin' }]}>
      <div className="admin-dashboard animate-fade-in">
        <div className="admin-header-row">
          <div className="admin-user-profile">
            {adminUser?.photoURL ? (
              <img src={adminUser.photoURL} alt="Avatar" className="admin-avatar" />
            ) : (
              <div className="admin-avatar-fallback">
                {(adminUser?.displayName || adminUser?.email || 'A').charAt(0).toUpperCase()}
              </div>
            )}
            <div>
              <h1 className="page-main-title" style={{ fontSize: '1.5rem', marginBottom: '2px' }}>Admin Dashboard</h1>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="admin-welcome">{adminUser?.displayName || 'Administrator'}</span>
                {adminUser?.email && <span className="admin-email-tag">{adminUser.email}</span>}
              </div>
            </div>
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
              <h3>Create Issue</h3>
              <form onSubmit={handleCreateIssue} className="admin-form-fields">
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
                      placeholder="e.g., September 2026"
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
                  {loadingIssues ? 'Creating in Firebase...' : 'Create Issue'}
                </button>
              </form>
            </div>

            {/* Upload Article Panel */}
            <div className="admin-panel card" style={{ marginTop: 'var(--space-xl)' }}>
              <h3>Upload & Publish Manuscript</h3>
              <form onSubmit={handleUploadArticle} className="admin-form-fields">
                <div className="form-group">
                  <label>Target Issue *</label>
                  <select
                    value={newArticle.issueKey}
                    onChange={(e) => setNewArticle({ ...newArticle, issueKey: e.target.value })}
                    required
                  >
                    <option value="">-- Select Issue --</option>
                    {manuscripts.map(issue => (
                      <option key={`${issue.volume}-${issue.issue}`} value={`${issue.volume}-${issue.issue}`}>
                        Issue {issue.issue} ({issue.year}) {issue.isPublished ? '[Published]' : '[Draft]'}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Topic / Category *</label>
                  <select
                    value={newArticle.category}
                    onChange={(e) => setNewArticle({ ...newArticle, category: e.target.value })}
                    required
                  >
                    {['Finance & Accounting', 'Human Resource Management', 'Marketing & Consumer Behavior', 'Operations & Supply Chain', 'Business Analytics', 'Entrepreneurship & Innovation', 'Economics & Public Policy', 'International Business', 'Strategic Management', 'General Management'].map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
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
                      placeholder="e.g., 10.5281/hbmr.2026.0101"
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
                  {loadingArticles ? 'Uploading File & Syncing to Firebase...' : 'Upload PDF & Publish Article'}
                </button>
              </form>
            </div>
          </div>

          {/* Right Column: Database Tree Management */}
          <div className="admin-tree-col">
            <div className="admin-panel card">
              <h3>Firebase DB Issues & Articles</h3>
              {manuscripts.length === 0 ? (
                <p className="no-issues-msg">No issues created in Firebase DB yet.</p>
              ) : (
                <div className="issues-tree-list">
                  {manuscripts.map(issue => (
                    <div key={`${issue.volume}-${issue.issue}`} className="tree-issue-item">
                      <div className="tree-issue-header">
                        <div>
                          <strong>Issue {issue.issue}</strong> ({issue.year})
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
                          {(!issue.articles || issue.articles.length === 0) && (
                            <button
                              onClick={() => handleDeleteVolume(issue.volume, issue.issue)}
                              className="btn-delete-volume"
                              title="Delete this empty issue"
                            >
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
                              Delete Issue
                            </button>
                          )}
                        </div>
                      </div>

                      <div className="tree-articles-box">
                        {(!issue.articles || issue.articles.length === 0) ? (
                          <p className="tree-empty-articles">No manuscripts published inside this issue.</p>
                        ) : (
                          <ul className="tree-articles-list">
                            {issue.articles.map(article => (
                              <li key={article.id} className="tree-article-row-item" style={{ flexDirection: 'column', alignItems: 'stretch' }}>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                                  <div className="tree-article-title-col">
                                    <span className="tree-article-title">{article.title}</span>
                                    <span className="tree-article-pages">Pages: {article.pages}</span>
                                  </div>
                                  <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
                                    <button
                                      onClick={() => handleEditClick(article, issue.volume, issue.issue)}
                                      className="btn btn-sm btn-outline"
                                      title="Edit Article"
                                      style={{ fontSize: '11px', padding: '4px 10px' }}
                                    >
                                      {editingArticleId === article.id ? 'Cancel' : '✏ Edit'}
                                    </button>
                                    <button
                                      onClick={() => handleDeleteArticle(issue.volume, issue.issue, article.id, article.title)}
                                      className="btn-delete-article"
                                      title="Delete Article"
                                    >
                                      Delete
                                    </button>
                                  </div>
                                </div>

                                {/* Inline Edit Form */}
                                {editingArticleId === article.id && (
                                  <div className="inline-edit-form">
                                    <div className="form-row">
                                      <div className="form-group">
                                        <label>Title *</label>
                                        <input
                                          type="text"
                                          value={editForm.title}
                                          onChange={e => setEditForm({ ...editForm, title: e.target.value })}
                                          placeholder="Article title"
                                        />
                                      </div>
                                      <div className="form-group">
                                        <label>Category</label>
                                        <select
                                          value={editForm.category}
                                          onChange={e => setEditForm({ ...editForm, category: e.target.value })}
                                        >
                                          {['Finance & Accounting', 'Human Resource Management', 'Marketing & Consumer Behavior', 'Operations & Supply Chain', 'Business Analytics', 'Entrepreneurship & Innovation', 'Economics & Public Policy', 'International Business', 'Strategic Management', 'General Management'].map(cat => (
                                            <option key={cat} value={cat}>{cat}</option>
                                          ))}
                                        </select>
                                      </div>
                                    </div>

                                    <div className="form-group">
                                      <label>Authors</label>
                                      {editAuthors.map((author, idx) => (
                                        <div key={idx} className="author-field-row" style={{ marginBottom: '6px' }}>
                                          <input
                                            type="text"
                                            placeholder="Author Name"
                                            value={author.name}
                                            onChange={e => {
                                              const updated = [...editAuthors]
                                              updated[idx].name = e.target.value
                                              setEditAuthors(updated)
                                            }}
                                          />
                                          <input
                                            type="text"
                                            placeholder="Affiliation"
                                            value={author.affiliation}
                                            onChange={e => {
                                              const updated = [...editAuthors]
                                              updated[idx].affiliation = e.target.value
                                              setEditAuthors(updated)
                                            }}
                                          />
                                          {editAuthors.length > 1 && (
                                            <button
                                              type="button"
                                              onClick={() => setEditAuthors(editAuthors.filter((_, i) => i !== idx))}
                                              className="btn-remove-author"
                                            >✕</button>
                                          )}
                                        </div>
                                      ))}
                                      <button
                                        type="button"
                                        onClick={() => setEditAuthors([...editAuthors, { name: '', affiliation: '' }])}
                                        className="btn-add-author"
                                      >+ Add Author</button>
                                    </div>

                                    <div className="form-group">
                                      <label>Abstract</label>
                                      <textarea
                                        rows="4"
                                        value={editForm.abstract}
                                        onChange={e => setEditForm({ ...editForm, abstract: e.target.value })}
                                        placeholder="Abstract text"
                                      />
                                    </div>

                                    <div className="form-group">
                                      <label>Keywords (comma-separated)</label>
                                      <input
                                        type="text"
                                        value={editForm.keywords}
                                        onChange={e => setEditForm({ ...editForm, keywords: e.target.value })}
                                        placeholder="e.g., AI, Supply Chain"
                                      />
                                    </div>

                                    <div className="form-row">
                                      <div className="form-group">
                                        <label>Page Range</label>
                                        <input
                                          type="text"
                                          value={editForm.pages}
                                          onChange={e => setEditForm({ ...editForm, pages: e.target.value })}
                                          placeholder="e.g., 1 - 15"
                                        />
                                      </div>
                                      <div className="form-group">
                                        <label>DOI</label>
                                        <input
                                          type="text"
                                          value={editForm.doi}
                                          onChange={e => setEditForm({ ...editForm, doi: e.target.value })}
                                          placeholder="e.g., 10.5281/hbmr.2026"
                                        />
                                      </div>
                                    </div>

                                    <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
                                      <button
                                        type="button"
                                        onClick={() => handleSaveEdit(article.id)}
                                        className="btn btn-primary btn-sm"
                                        disabled={loadingEdit}
                                      >
                                        {loadingEdit ? 'Saving...' : 'Save Changes'}
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => setEditingArticleId(null)}
                                        className="btn btn-outline btn-sm"
                                      >
                                        Cancel
                                      </button>
                                    </div>
                                  </div>
                                )}
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
