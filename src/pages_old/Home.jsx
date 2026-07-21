import { Link } from 'react-router-dom'
import Layout from '../components/Layout'
import Sidebar from '../components/Sidebar'
import './Home.css'

const Home = () => {
  const subjects = [
    { icon: '📊', text: 'Finance and Accounting' },
    { icon: '👥', text: 'Human Resource Management' },
    { icon: '🎯', text: 'Marketing and Consumer Behavior' },
    { icon: '⚙️', text: 'Operations and Supply Chain Management' },
    { icon: '📈', text: 'Business Analytics and Data-Driven Decision Making' },
    { icon: '🏢', text: 'Strategic and General Management' },
    { icon: '💡', text: 'Entrepreneurship and Innovation' },
    { icon: '🌐', text: 'Economics and Public Policy' },
    { icon: '🌍', text: 'International Business and Comparative Management' },
  ]

  const features = [
    { icon: '⚡', title: 'Fast-Track Review', desc: 'Fast-track review and publication process' },
    { icon: '🆓', title: 'No Charges', desc: 'No processing or publication charges (currently waived)' },
    { icon: '🔓', title: 'Open Access', desc: 'Open access to ensure global visibility and readership' },
    { icon: '🎓', title: 'Academic Rigor', desc: 'Emphasis on academic rigor and practical relevance' },
    { icon: '🌏', title: 'International', desc: 'International and interdisciplinary perspectives encouraged' },
  ]

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero" id="hero-section">
        <div className="hero-bg-shapes">
          <div className="hero-circle hero-circle-1"></div>
          <div className="hero-circle hero-circle-2"></div>
          <div className="hero-circle hero-circle-3"></div>
          <div className="hero-lines">
            <div className="hero-line"></div>
            <div className="hero-line"></div>
            <div className="hero-line"></div>
          </div>
        </div>
        <div className="container hero-content">
          <div className="hero-badge animate-fade-in">
            <span>Peer-Reviewed • Double-Blind • Open Access</span>
          </div>
          <h1 className="hero-title animate-fade-in-up">
            Hallmark Business and<br />Management Review
          </h1>
          <p className="hero-subtitle animate-fade-in-up stagger-1">
            A Biannual, Peer-Reviewed, Double-Blind Online Journal
          </p>
          <p className="hero-publisher animate-fade-in-up stagger-2">
            Published by Hallmark Business School, Tamil Nadu, India
          </p>
          <div className="hero-actions animate-fade-in-up stagger-3">
            <Link to="/publish?tab=submission" className="btn btn-gold">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="12" y1="18" x2="12" y2="12"/><line x1="9" y1="15" x2="12" y2="12"/><line x1="15" y1="15" x2="12" y2="12"/></svg>
              Submit Manuscript
            </Link>
            <Link to="/current-issue" className="btn btn-outline-white">
              Current Issue
            </Link>
          </div>
        </div>
      </section>

      {/* Main Content with Sidebar */}
      <Layout sidebar={<Sidebar />} breadcrumbs={[{ label: 'Home', path: '/' }]}>
        {/* About The Journal */}
        <section className="content-section animate-fade-in-up" id="about-journal">
          <h2 className="section-title">About The Journal</h2>
          <div className="content-text">
            <p>Hallmark Business School, Tamil Nadu, proudly publishes the <strong>Hallmark Business and Management Review (HBMR)</strong>, a biannual, peer-reviewed online journal that adheres to a rigorous double-blind review process. HBMR is dedicated to promoting high-quality research and scholarly discourse across a wide spectrum of business and management topics, with a particular focus on creative thinking, innovation, entrepreneurship, and emerging practices in the business world.</p>
            <p>As a flagship publication of Hallmark Business School, HBMR maintains an open access policy, making all its issues freely available on the journal's official website. This ensures global accessibility and widespread dissemination of knowledge to scholars, practitioners, and students alike.</p>
            <p>HBMR aims to provide readers with fresh perspectives on contemporary business issues and contribute meaningfully to the evolving body of knowledge in management studies. The journal welcomes original research articles, conceptual papers, case studies, literature reviews, and book reviews that reflect both theoretical and applied dimensions of business and management.</p>
            <p>The journal particularly encourages contributions from academicians, researchers, doctoral scholars, and professionals who seek to share their knowledge, experiences, and innovative practices with an international audience. Submissions that offer actionable insights into effective management strategies, organizational behavior, policy-making, and leadership are especially welcome.</p>
            <p>HBMR aspires to be a premier platform for scholarly exchange and thought leadership. It actively seeks outstanding theoretical and empirical research, conceptual frameworks, analytical and simulation models, technical notes, and review articles that advance the frontiers of business and management research.</p>
            <p>We invite submissions from across the globe that reflect diverse perspectives and contribute to the development of sound, evidence-based business practices. Through its publications, HBMR remains committed to fostering a robust academic community and shaping the future of business management research and education.</p>
          </div>
        </section>

        {/* Journal Particulars */}
        <section className="content-section" id="journal-particulars">
          <h2 className="section-title">Journal Particulars</h2>
          <table className="info-table">
            <tbody>
              <tr><td>Title</td><td>Hallmark Business and Management Review (HBMR)</td></tr>
              <tr><td>Online ISSN</td><td>Applied</td></tr>
              <tr><td>Frequency</td><td>Two issues per year</td></tr>
              <tr><td>Publisher</td><td>Hallmark Business School</td></tr>
              <tr><td>Starting Year</td><td>2025</td></tr>
              <tr><td>Subject</td><td>Management</td></tr>
              <tr><td>Language</td><td>English</td></tr>
              <tr><td>Publication Format</td><td>Online</td></tr>
              <tr><td>Phone Number</td><td><a href="tel:7373015999">73730 15999</a></td></tr>
              <tr><td>Email</td><td><a href="mailto:HBMR@gmail.com">HBMR@gmail.com</a></td></tr>
              <tr><td>Website</td><td><a href="https://www.hbs.ac.in" target="_blank" rel="noopener noreferrer">www.hbs.ac.in</a></td></tr>
              <tr><td>Address</td><td>Hallmark Business School, Pirattiyur-Allithurai Road, Santhapuram, Thiruchirapalli-620102, Tamilnadu, India.</td></tr>
            </tbody>
          </table>
        </section>

        {/* Call for Papers */}
        <section className="content-section" id="call-for-papers">
          <h2 className="section-title">Call for Papers — Volume 1, Issue 1</h2>
          <div className="cfp-banner">
            <div className="cfp-banner-icon">📢</div>
            <div>
              <h3>Submissions Open for Inaugural Issue</h3>
              <p style={{marginBottom: 0}}>We invite high-quality submissions for Volume 1, Issue 1 of HBMR.</p>
            </div>
          </div>
          <div className="content-text">
            <p>The <strong>Hallmark Business and Management Review (HBMR)</strong>, a biannual, peer-reviewed, double-blind online journal published by Hallmark Business School, Thanjavur, Tamil Nadu, invites high-quality submissions for its inaugural issue (Volume 1, Issue 1).</p>
            <p>HBMR is dedicated to advancing scholarly research in the field of business and management, with a special focus on creativity, innovation, and entrepreneurship. The journal serves as an inclusive platform for the dissemination of original and impactful work from both academic and professional communities.</p>
            <p>We welcome original research articles, empirical studies, conceptual papers, case studies, literature reviews, and book reviews in a wide range of subject areas, including but not limited to:</p>
          </div>

          <div className="subjects-grid">
            {subjects.map((subject, index) => (
              <div key={index} className="subject-item">
                <span className="subject-icon">{subject.icon}</span>
                <span className="subject-text">{subject.text}</span>
              </div>
            ))}
          </div>

          <h3 className="subsection-title">Key Features</h3>
          <div className="features-grid">
            {features.map((feature, index) => (
              <div key={index} className="feature-card">
                <span className="feature-icon">{feature.icon}</span>
                <h4>{feature.title}</h4>
                <p>{feature.desc}</p>
              </div>
            ))}
          </div>

          <div className="content-text" style={{marginTop: 'var(--space-xl)'}}>
            <p>We particularly encourage submissions that adopt comparative or international approaches, offer policy insights, or provide industry-relevant findings.</p>
          </div>

          <div className="submission-info-box">
            <h3>Submission Guidelines</h3>
            <ul>
              <li>Manuscripts should be original, unpublished, and not under consideration elsewhere.</li>
              <li>Articles may be theoretical, applied, empirical, policy-oriented, or case-based.</li>
              <li>All submissions will undergo a double-blind peer review process.</li>
            </ul>
            <p className="deadline-note">
              <strong>Deadline for Submission:</strong> No deadline. Articles accepted throughout the year.
            </p>
            <Link to="/publish?tab=submission" className="btn btn-primary">
              Submit Your Manuscript →
            </Link>
          </div>
        </section>

        {/* Contact Section */}
        <section className="content-section" id="contact-info">
          <h2 className="section-title">For Queries, Contact Us</h2>
          <div className="contact-cards-grid">
            <div className="contact-card-home">
              <div className="contact-card-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              </div>
              <h4>Editor-in-Chief</h4>
              <p className="contact-name">Dr. P. Aranganathan</p>
              <p className="contact-role">Hallmark Business and Management Review (HBMR)<br/>Hallmark Business School, Tamil Nadu</p>
              <a href="mailto:editorhmbr@hbs.ac.in" className="contact-email">editorhmbr@hbs.ac.in</a>
            </div>
            <div className="contact-card-home">
              <div className="contact-card-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
              </div>
              <h4>Address</h4>
              <p>Hallmark Business School,<br/>Pirattiyur-Allithurai Road,<br/>Santhapuram, Thiruchirapalli-620102,<br/>Tamilnadu, India.</p>
              <p style={{marginBottom: 0}}><strong>Phone:</strong> <a href="tel:7373015999">73730 15999</a></p>
            </div>
            <div className="contact-card-home">
              <div className="contact-card-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
              </div>
              <h4>Online</h4>
              <p><strong>Website:</strong> <a href="https://www.hbs.ac.in" target="_blank" rel="noopener noreferrer">www.hbs.ac.in</a></p>
              <p style={{marginBottom: 0}}><strong>Email:</strong> <a href="mailto:info@hbs.ac.in">info@hbs.ac.in</a></p>
            </div>
          </div>
        </section>
      </Layout>
    </div>
  )
}

export default Home
