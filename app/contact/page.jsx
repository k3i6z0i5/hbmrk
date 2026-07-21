import Layout from '../../components/Layout'
import Sidebar from '../../components/Sidebar'
import './Contact.css'

const Contact = () => {
  return (
    <Layout sidebar={<Sidebar />} breadcrumbs={[{ label: 'Home', path: '/' }, { label: 'Contact Us', path: '/contact' }]}>
      <div className="contact-page animate-fade-in">
        <h1 className="page-main-title">Contact Us</h1>
        <p className="contact-intro">
          For any questions, submission queries, or feedback regarding the Hallmark Business and Management Review (HBMR), feel free to reach out to our team.
        </p>

        <div className="contact-grid">
          {/* Main Info Columns */}
          <div className="contact-main-info">
            {/* Publisher Table */}
            <section className="contact-section">
              <h2 className="section-title">Publisher Information</h2>
              <table className="info-table contact-table">
                <tbody>
                  <tr>
                    <td>Responsible Person</td>
                    <td>Sri. J. Jayaraman<br /><span className="text-small text-muted">CEO & Management Trustee, Hallmark Business School</span></td>
                  </tr>
                  <tr>
                    <td>Issuing Body</td>
                    <td>Hallmark Business School</td>
                  </tr>
                  <tr>
                    <td>Address</td>
                    <td>Pirattiyur-Allithurai Road, Santhapuram, Thiruchirapalli - 620102, Tamil Nadu, India</td>
                  </tr>
                  <tr>
                    <td>Phone</td>
                    <td><a href="tel:7373015999">73730 15999</a></td>
                  </tr>
                  <tr>
                    <td>Email</td>
                    <td><a href="mailto:info@hbs.ac.in">info@hbs.ac.in</a></td>
                  </tr>
                  <tr>
                    <td>Website</td>
                    <td><a href="https://www.hbs.ac.in" target="_blank" rel="noopener noreferrer">www.hbs.ac.in</a></td>
                  </tr>
                </tbody>
              </table>
            </section>

            {/* Contacts Cards */}
            <div className="contact-roles-row">
              {/* Principal Contact */}
              <div className="contact-card card principal-contact-card">
                <div className="contact-card-header">
                  <div className="contact-avatar-small">PA</div>
                  <div>
                    <h3 className="contact-card-name">Dr. P. Aranganathan</h3>
                    <p className="contact-card-label">Principal Contact / Editor-in-Chief</p>
                  </div>
                </div>
                <div className="contact-card-body">
                  <p className="contact-card-text">
                    <strong>Role:</strong> Director, Hallmark Business School
                  </p>
                  <p className="contact-card-text">
                    <strong>Phone:</strong> <a href="tel:9750991371">9750991371</a>
                  </p>
                  <p className="contact-card-text">
                    <strong>Email:</strong> <a href="mailto:editorHBMR@hbs.ac.in">editorHBMR@hbs.ac.in</a>
                  </p>
                </div>
              </div>

              {/* Technical Editor Contact */}
              <div className="contact-card card technical-contact-card">
                <div className="contact-card-header">
                  <div className="contact-avatar-small tech">TE</div>
                  <div>
                    <h3 className="contact-card-name">Technical Editor</h3>
                    <p className="contact-card-label">Technical & Website Support</p>
                  </div>
                </div>
                <div className="contact-card-body">
                  <p className="contact-card-text">
                    For website troubleshooting, submission portal issues, and general technical inquiries.
                  </p>
                  <p className="contact-card-text" style={{marginTop: 'var(--space-md)'}}>
                    <strong>Email:</strong> <a href="mailto:support.hbjm@hbs.ac.in">support.hbjm@hbs.ac.in</a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default Contact
