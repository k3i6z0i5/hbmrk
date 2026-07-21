'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Layout from '../../components/Layout'
import Sidebar from '../../components/Sidebar'
import './About.css'

const AboutContent = () => {
  const searchParams = useSearchParams()
  const tabParam = searchParams.get('tab')
  const [activeTab, setActiveTab] = useState('aim')

  useEffect(() => {
    if (tabParam) {
      const tabMap = { 'aim': 'aim', 'open-access': 'open-access', 'advisory': 'advisory', 'privacy': 'privacy' }
      if (tabMap[tabParam]) setActiveTab(tabParam)
    }
  }, [tabParam])

  const tabs = [
    { id: 'aim', label: 'Aim & Scope' },
    { id: 'open-access', label: 'Open Access' },
    { id: 'advisory', label: 'Advisory Board' },
    { id: 'privacy', label: 'Privacy Statement' },
  ]

  const advisoryBoard = [
    { name: 'Dr. Suresh Paul Antony', title: 'Associate Professor', institution: 'Indian Institute of Management (IIM) Tiruchirappalli, Tamilnadu, India', initials: 'SA', color: '#1a5276' },
    { name: 'Gurudas Nulkar', title: 'Professor, Director Centre for Sustainable Development', institution: 'Gokhale Institute of Politics and Economics, Pune, Maharashtra, India', initials: 'GN', color: '#00b4d8' },
    { name: 'Dr. R. Venkatesakumar', title: 'HOD, Department of Management Studies (DMS)', institution: 'Pondicherry University, Puducherry, India', initials: 'RV', color: '#d4a843' },
    { name: 'Dr. Sivarethinamohan R', title: 'Professor', institution: 'Symbiosis Centre for Management Studies, Bengaluru campus, Symbiosis International (Deemed University), Pune, India', initials: 'SR', color: '#2ecc71' },
    { name: 'Dr. S. N. Raghavendra', title: 'PGP Chair & Associate Professor', institution: 'Bharathidasan Institute of Management (BIM), Tiruchirappalli, Tamilnadu, India', initials: 'SR', color: '#e74c3c' },
    { name: 'Dr. Preethi Baligar', title: 'Associate Professor, School of Computing', institution: 'MIT Vishwaprayag University, Solapur, Maharashtra, India', initials: 'PB', color: '#9b59b6' },
  ]

  return (
    <Layout sidebar={<Sidebar />} breadcrumbs={[{ label: 'Home', path: '/' }, { label: 'About', path: '/about' }]}>
      <div className="about-page" id="about-page">
        <h1 className="page-main-title">About the Journal</h1>

        {/* Sub-navigation */}
        <div className="about-tabs">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`about-tab ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="about-tab-content animate-fade-in" key={activeTab}>
          {activeTab === 'aim' && (
            <div className="tab-panel">
              <h2 className="section-title">Aim & Scope</h2>
              <div className="content-text">
                <p>The <strong>Hallmark Business and Management Review (HBMR)</strong> aims to serve as a dynamic forum for cutting-edge research, innovative thought, and scholarly discourse on contemporary and emerging issues in the field of business and management. Upholding rigorous academic standards, the journal is committed to publishing high-quality theoretical and empirical research that advances the understanding and practice of business management.</p>
                <p>HBMR seeks to bridge the gap between academic inquiry and practical application by encouraging contributions that are not only grounded in sound research but also offer actionable insights for managers, entrepreneurs, policymakers, and industry professionals. The journal welcomes original works that explore the evolving landscape of management theory and practice, as well as reflections and critical perspectives that stimulate further debate and inquiry.</p>
                <p>The scope of the journal covers a wide range of disciplines within business and management. HBMR particularly encourages academicians, researchers, and doctoral scholars to share their insights, experiences, and research findings with a global audience. By fostering a culture of intellectual exchange, the journal aspires to contribute meaningfully to the advancement of business knowledge and the development of effective management practices worldwide.</p>
              </div>
              <div className="scope-areas">
                <h3>Areas of Interest Include:</h3>
                <div className="scope-tags">
                  {['Finance & Accounting', 'Human Resource Management', 'Marketing & Consumer Behavior', 'Operations Management', 'Business Analytics', 'Strategic Management', 'Entrepreneurship', 'Economics & Public Policy', 'International Business', 'Organizational Behavior', 'Leadership Studies', 'Innovation Management'].map((area, i) => (
                    <span key={i} className="scope-tag">{area}</span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'open-access' && (
            <div className="tab-panel">
              <h2 className="section-title">Open Access Policy</h2>
              <div className="oa-banner">
                <div className="oa-icon">🔓</div>
                <div>
                  <h3>Freely Accessible to All</h3>
                  <p>All published content is freely and permanently accessible worldwide.</p>
                </div>
              </div>
              <div className="content-text">
                <p>The <strong>Hallmark Business and Management Review (HBMR)</strong> is a fully open-access journal, ensuring that all published content is freely and permanently accessible to readers worldwide. There are no subscription fees or access charges for users or their institutions.</p>
                <p>Readers are permitted to read, download, copy, distribute, print, search, or link to the full texts of articles without seeking prior permission from the publisher or the authors, in accordance with the principles of open knowledge dissemination. This policy reflects our commitment to promoting the widest possible visibility, reach, and impact of scholarly work, fostering a global exchange of ideas and research.</p>
                <p>HBMR believes that removing barriers to access helps advance academic collaboration and supports innovation in the field of business and management.</p>
              </div>
              <div className="oa-benefits">
                <div className="oa-benefit-item">
                  <span className="oa-benefit-icon">📖</span>
                  <span>No subscription fees</span>
                </div>
                <div className="oa-benefit-item">
                  <span className="oa-benefit-icon">📥</span>
                  <span>Free download & distribution</span>
                </div>
                <div className="oa-benefit-item">
                  <span className="oa-benefit-icon">🌍</span>
                  <span>Global accessibility</span>
                </div>
                <div className="oa-benefit-item">
                  <span className="oa-benefit-icon">🔗</span>
                  <span>Link & share freely</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'advisory' && (
            <div className="tab-panel">
              <h2 className="section-title">Advisory Board</h2>
              <p className="advisory-intro">Our distinguished advisory board comprises eminent scholars and practitioners from leading institutions across India.</p>
              <div className="advisory-grid">
                {advisoryBoard.map((member, index) => (
                  <div key={index} className="advisory-card">
                    <div className="advisory-avatar" style={{ background: member.color }}>
                      {member.initials}
                    </div>
                    <div className="advisory-info">
                      <h4>{member.name}</h4>
                      <p className="advisory-title">{member.title}</p>
                      <p className="advisory-inst">{member.institution}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'privacy' && (
            <div className="tab-panel">
              <h2 className="section-title">Privacy Statement</h2>
              <div className="content-text">
                <p>At the <strong>Hallmark Business and Management Review (HBMR)</strong>, we are dedicated to maintaining the privacy and security of our readers, authors, reviewers, and all other stakeholders. This Privacy Statement explains how we collect, use, disclose, and protect your personal information when you interact with the journal through our website, manuscript submission portal, and related services.</p>
                <p>The names, email addresses, and other personal information provided on this site will be used solely for the purposes specified by the journal and will not be shared with third parties for unrelated uses.</p>
              </div>

              <div className="privacy-sections">
                <div className="privacy-section">
                  <h3><span className="privacy-num">1</span> Information We Collect</h3>
                  <ul>
                    <li><strong>Personal Identification Information:</strong> Such as your name, email address, institutional affiliation, and other contact details submitted during manuscript submission, registration, or communication with the journal.</li>
                    <li><strong>Manuscript and Submission Data:</strong> Including submitted manuscripts, abstracts, supporting files, and related research information.</li>
                    <li><strong>Website Usage Data:</strong> Such as IP addresses, browser types, operating systems, and access times collected automatically through website analytics.</li>
                  </ul>
                </div>

                <div className="privacy-section">
                  <h3><span className="privacy-num">2</span> How We Use Your Information</h3>
                  <ul>
                    <li><strong>Manuscript Management:</strong> To process submissions, coordinate peer reviews, and support the editorial workflow.</li>
                    <li><strong>Communication:</strong> To provide updates regarding manuscript status, editorial decisions, publication notifications, and journal announcements.</li>
                    <li><strong>Compliance and Legal Obligations:</strong> To meet regulatory requirements, enforce our policies, and resolve legal disputes.</li>
                  </ul>
                </div>

                <div className="privacy-section">
                  <h3><span className="privacy-num">3</span> Information Sharing</h3>
                  <p>We do not sell or rent personal information to third parties. Information may be shared with:</p>
                  <ul>
                    <li><strong>Editorial Board and Reviewers:</strong> Solely for the purposes of evaluating and processing submissions.</li>
                    <li><strong>Trusted Service Providers:</strong> Who assist in website hosting, journal management, or technical support.</li>
                  </ul>
                </div>

                <div className="privacy-section">
                  <h3><span className="privacy-num">4</span> Data Security</h3>
                  <p>We apply appropriate technical and organizational safeguards to protect your data from unauthorized access, misuse, alteration, or disclosure. While we strive to ensure maximum security, no online transmission or storage system can be guaranteed to be 100% secure.</p>
                </div>

                <div className="privacy-section">
                  <h3><span className="privacy-num">5</span> Data Retention</h3>
                  <p>We retain personal data only as long as necessary to fulfill the purposes described in this Privacy Statement, to meet legal requirements, and to resolve any disputes.</p>
                </div>

                <div className="privacy-section">
                  <h3><span className="privacy-num">6</span> Your Rights</h3>
                  <ul>
                    <li><strong>Access:</strong> Request access to the personal data we hold about you.</li>
                    <li><strong>Correction:</strong> Request corrections to inaccurate or outdated information.</li>
                    <li><strong>Deletion:</strong> Request deletion of your personal data, subject to legal and procedural limitations.</li>
                    <li><strong>Opt-Out:</strong> Decline future non-essential communications from the journal.</li>
                  </ul>
                </div>

                <div className="privacy-section">
                  <h3><span className="privacy-num">7</span> Updates to This Privacy Statement</h3>
                  <p>This Privacy Statement may be revised periodically. Any updates will be published on our website with the revised effective date. We encourage users to review this page regularly to stay informed about how we protect your data.</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}

export default function About() {
  return (
    <Suspense fallback={<div style={{ padding: '2rem', textAlign: 'center' }}>Loading About...</div>}>
      <AboutContent />
    </Suspense>
  )
}
