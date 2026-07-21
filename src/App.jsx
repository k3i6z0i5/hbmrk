import { Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import Header from './components/Header'
import Footer from './components/Footer'
import Home from './pages/Home'
import About from './pages/About'
import CurrentIssue from './pages/CurrentIssue'
import EditorialBoard from './pages/EditorialBoard'
import Publish from './pages/Publish'
import Archives from './pages/Archives'
import Contact from './pages/Contact'
import Admin from './pages/Admin'
import './App.css'

function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return null
}

function App() {
  return (
    <div className="app">
      <ScrollToTop />
      <Header />
      <div className="app-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/current-issue" element={<CurrentIssue />} />
          <Route path="/editorial-board" element={<EditorialBoard />} />
          <Route path="/publish" element={<Publish />} />
          <Route path="/archives" element={<Archives />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </div>
      <Footer />
    </div>
  )
}

export default App
