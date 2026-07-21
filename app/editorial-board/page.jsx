import Layout from '../../components/Layout'
import Sidebar from '../../components/Sidebar'
import './EditorialBoard.css'

const EditorialBoard = () => {
  const editors = [
    {
      id: 1,
      name: 'Dr. Anandavel Vadivel',
      role: 'Dean Innovation',
      institution: 'Dhanalakshmi Srinivasan College of Engineering and Technology (Autonomous), Chennai',
      email: 'deaninnovation@dscet.ac.in',
      profile: 'https://dscet.ac.in/ciie-overview/',
    },
    {
      id: 2,
      name: 'Dr. M. Kathiravan',
      role: 'Professor',
      institution: 'The Oxford College of Engineering, Bangalore',
      email: 'kathiravantoce@theoxford.edu',
      profile: 'http://theoxfordengg.org/department-mba-faculty.htm',
    },
    {
      id: 3,
      name: 'Dr. Nagaraj Navalgund',
      role: 'Assistant Professor',
      institution: 'School of Management Studies and Research, KLE Technological University, Hubballi, Karnataka - 580030',
      email: 'nagaraj.n@kletech.ac.in',
      profile: 'https://kletech.irins.org/profile/152323',
    },
    {
      id: 4,
      name: 'Dr. Mrityunjaya B. Chavannavar',
      role: 'Assistant Professor',
      institution: 'School of Management Studies & Research, K.L.E Technological University, Hubballi, Karnataka',
      email: 'mrityunjaya.chavannavar@kletech.ac.in',
      orcid: '0009-0009-9142-4960',
      profile: 'http://kletech.ac.in/hubballi/academic/faculty',
    },
    {
      id: 5,
      name: 'Dr. Mahantesh Halagatti',
      role: 'Associate Professor',
      institution: 'School of Management Studies & Research, K.L.E Technological University, Hubballi, Karnataka',
      email: 'mahantesh.halagatti@kletech.ac.in',
      orcid: '0000-0002-2947-2808',
      profile: 'http://kletech.ac.in/hubballi/academic/faculty',
    },
    {
      id: 6,
      name: 'Dr. Anouja Mohanty',
      role: 'Associate Professor',
      institution: 'Presidency School of Commerce, Presidency University, Rajanukunte, Yelahanka, Bengaluru, Karnataka - 560119',
      profile: 'https://presidencyuniversity.in/faculty-staff/anouja-mohanty',
    },
    {
      id: 7,
      name: 'Dr. A. L. Alagappan',
      role: 'Associate Professor',
      institution: 'Hallmark Business School, Pirattiyur-Allithurai Road, Santhapuram, Thiruchirapalli, Tamilnadu',
      email: 'alagappan@hbs.ac.in',
      profile: 'https://www.hbs.ac.in/faculty/dr-al-alagappan',
    },
    {
      id: 8,
      name: 'Dr. R. V. Suresh',
      role: 'Associate Professor',
      institution: 'Hallmark Business School, Pirattiyur-Allithurai Road, Santhapuram, Trichirappalli - 620102',
      email: 'rvsuresh@hbs.ac.in',
      profile: 'https://www.hbs.ac.in/faculty/dr-r-v-suresh',
    },
    {
      id: 9,
      name: 'Dr. Sheeba D',
      role: 'Assistant Professor',
      institution: 'Hallmark Business School, Pirattiyur-Allithurai Road, Santhapuram, Trichirappalli - 620102',
      email: 'sheeba@hbs.ac.in',
      profile: 'https://www.hbs.ac.in/faculty/sheeba-d',
    },
    {
      id: 10,
      name: 'Dr. A. Krishna Sudheer',
      role: 'Professor, Department of Business Administration',
      institution: 'KLH Global Business School, Kothaguda, Kondapur, Hyderabad, Telangana, India - 500084',
      email: 'krishnasudheer.a@klh.edu.in',
      profile: 'https://gbs.klh.edu.in/faculty/krishna-sudheer',
    },
  ]

  const supportTeam = [
    { role: 'Production Editor', name: 'Mr. M. Arun Kumar' },
    { role: 'Technical Editor', name: 'Mr. N. Jeyaraj' },
    { role: 'Language Editor', name: 'Ms. A. Vasanthy' }
  ]

  return (
    <Layout sidebar={<Sidebar />} breadcrumbs={[{ label: 'Home', path: '/' }, { label: 'Editorial Board', path: '/editorial-board' }]}>
      <div className="editorial-board-page animate-fade-in">
        <h1 className="page-main-title">Editorial Board</h1>
        
        {/* Editor in Chief Section */}
        <section className="chief-section">
          <h2 className="section-title">Editor-in-Chief</h2>
          <div className="chief-card card">
            <div className="chief-decor-line"></div>
            <div className="chief-info-layout">
              <div className="chief-avatar-container">
                <div className="chief-avatar">PA</div>
              </div>
              <div className="chief-details">
                <h3 className="chief-name">Dr. P. Aranganathan</h3>
                <p className="chief-role">Director</p>
                <p className="chief-inst">Hallmark Business School</p>
                <div className="chief-contact">
                  <a href="mailto:editorhmbr@hbs.ac.in" className="btn btn-outline">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                    Contact Editor-in-Chief
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Editors Section */}
        <section className="editors-section">
          <h2 className="section-title">Editors</h2>
          <div className="editors-grid">
            {editors.map((editor) => (
              <div key={editor.id} className="editor-card card">
                <div className="editor-card-header">
                  <div className="editor-avatar">
                    {editor.name.split(' ').filter(n => !n.includes('.') && n.length > 0).slice(0, 2).map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h3 className="editor-name">{editor.name}</h3>
                    <p className="editor-role">{editor.role}</p>
                  </div>
                </div>
                <div className="editor-card-body">
                  <p className="editor-inst">{editor.institution}</p>
                  {editor.orcid && (
                    <p className="editor-orcid">
                      <strong>ORCID ID:</strong> <a href={`https://orcid.org/${editor.orcid}`} target="_blank" rel="noopener noreferrer">{editor.orcid}</a>
                    </p>
                  )}
                </div>
                <div className="editor-card-footer">
                  {editor.email ? (
                    <a href={`mailto:${editor.email}`} className="editor-action-btn email-btn" title="Email Editor">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                      Email
                    </a>
                  ) : (
                    <span className="editor-action-btn email-btn disabled">No Email</span>
                  )}
                  {editor.profile && (
                    <a href={editor.profile} target="_blank" rel="noopener noreferrer" className="editor-action-btn profile-btn">
                      View Profile
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Support/Editorial Team Section */}
        <section className="support-section">
          <h2 className="section-title">Support Team</h2>
          <div className="support-grid">
            {supportTeam.map((team, idx) => (
              <div key={idx} className="support-card card">
                <div className="support-icon-wrap">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                </div>
                <div className="support-details">
                  <p className="support-role">{team.role}</p>
                  <h3 className="support-name">{team.name}</h3>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </Layout>
  )
}

export default EditorialBoard
