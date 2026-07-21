'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Layout from '../../components/Layout'
import Sidebar from '../../components/Sidebar'
import './Publish.css'

const PublishContent = () => {
  const searchParams = useSearchParams()
  const tabParam = searchParams.get('tab')
  const [activeTab, setActiveTab] = useState('submission')

  useEffect(() => {
    if (tabParam) {
      const tabMap = {
        'submission': 'submission',
        'guidelines': 'guidelines',
        'ethics': 'ethics',
        'copyright': 'copyright',
        'peer-review': 'peer-review',
        'plagiarism': 'plagiarism',
        'fees': 'fees'
      }
      if (tabMap[tabParam]) setActiveTab(tabParam)
    }
  }, [tabParam])

  const tabs = [
    { id: 'submission', label: 'Submission' },
    { id: 'guidelines', label: 'Author Guidelines' },
    { id: 'ethics', label: 'Publication Ethics' },
    { id: 'copyright', label: 'Copyright Notice' },
    { id: 'peer-review', label: 'Peer Review Process' },
    { id: 'plagiarism', label: 'Plagiarism Policy' },
    { id: 'fees', label: 'Publication Fees' },
  ]

  const checklistItems = [
    { title: 'Originality', desc: 'The manuscript is original, unpublished, and not currently under review by another journal.' },
    { title: 'Cover Page', desc: 'A separate cover page is included with complete author details—name, institutional affiliation, email address, and phone number.' },
    { title: 'Formatting', desc: 'The manuscript adheres strictly to the journal’s formatting and structural guidelines.' },
    { title: 'Citation Compliance', desc: 'All references and in-text citations follow the latest APA style, and sources are accurately and appropriately cited.' },
    { title: 'Permission Secured', desc: 'All necessary permissions have been obtained for any third-party content (e.g., images, charts, datasets, or copyrighted material).' },
    { title: 'Ethical Approval', desc: 'Ethical clearance has been obtained for the study, if required by the nature of the research or the country’s regulations.' },
    { title: 'Quality Standards', desc: 'The manuscript is well-structured, clearly written, and meets the journal’s academic and editorial standards.' },
  ]

  const reviewSteps = [
    {
      step: '1',
      title: 'Submission & Initial Screening',
      desc: 'Authors submit their manuscripts online. The editorial team screens for plagiarism (similarity index must be <15%), formatting compliance, and alignment with the journal\'s aim and scope.'
    },
    {
      step: '2',
      title: 'Reviewer Assignment',
      desc: 'Manuscripts passing screening are anonymized. The manuscript is assigned to two independent subject matter experts for double-blind peer review.'
    },
    {
      step: '3',
      title: 'Peer Review Evaluation',
      desc: 'Reviewers assess based on Originality, Research Methodology, Clarity & Structure, and Ethics. Review outcomes: Accept, Minor Revisions, Major Revisions, or Reject.'
    },
    {
      step: '4',
      title: 'Author Revisions & Re-evaluation',
      desc: 'Authors receive feedback and are expected to revise. A point-by-point response document addressing each reviewer comment must accompany the revised submission.'
    },
    {
      step: '5',
      title: 'Editorial Decision & Final Approval',
      desc: 'The Editor-in-Chief, in consultation with the editorial board, reviews the revised manuscript and reviewer feedback to make a final decision.'
    },
    {
      step: '6',
      title: 'Publication & Indexing',
      desc: 'Accepted manuscripts are copyedited, formatted, and published online, followed by indexing in relevant academic databases.'
    }
  ]

  return (
    <Layout sidebar={<Sidebar />} breadcrumbs={[{ label: 'Home', path: '/' }, { label: 'Publish', path: '/publish' }]}>
      <div className="publish-page animate-fade-in" id="publish-page">
        <h1 className="page-main-title">Publish with HBMR</h1>

        {/* Sub Navigation */}
        <div className="publish-tabs">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`publish-tab ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab content panel */}
        <div className="publish-tab-content" key={activeTab}>
          {activeTab === 'submission' && (
            <div className="tab-panel animate-fade-in-up">
              <h2 className="section-title">Manuscript Submission</h2>
              <div className="submission-box card">
                <div className="submission-icon">✉️</div>
                <h3>Submit via Email</h3>
                <p className="submission-text">
                  We invite high-quality original research articles, conceptual papers, case studies, literature reviews, and book reviews. Authors can submit their manuscripts directly to our editorial office:
                </p>
                <div className="submission-email-action">
                  <a href="mailto:editorhmbr@hbs.ac.in" className="btn btn-primary btn-large">
                    editorhmbr@hbs.ac.in
                  </a>
                </div>
                <p className="submission-disclaimer">
                  Please ensure your manuscript is prepared according to the <span className="guideline-link-trigger" onClick={() => setActiveTab('guidelines')}>Author Guidelines</span> and the <span className="guideline-link-trigger" onClick={() => setActiveTab('copyright')}>Copyright Notice</span> terms.
                </p>
              </div>

              <div className="checklist-section" style={{marginTop: 'var(--space-2xl)'}}>
                <h3 className="subsection-title">Submission Preparation Checklist</h3>
                <p>Before submitting, please ensure you satisfy all the following requirements:</p>
                <div className="checklist-grid">
                  {checklistItems.map((item, idx) => (
                    <div key={idx} className="checklist-card card">
                      <div className="checklist-header">
                        <span className="checklist-check">✓</span>
                        <h4>{item.title}</h4>
                      </div>
                      <p>{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'guidelines' && (
            <div className="tab-panel animate-fade-in-up">
              <h2 className="section-title">Author Guidelines</h2>
              <div className="guidelines-container">
                
                <div className="guideline-step card">
                  <h3>1. Submission Intent</h3>
                  <p>Submission to Hallmark Business and Management Review (HBMR) indicates the author's intention to publish with the journal and affirms that the manuscript has not been previously published or submitted elsewhere for consideration.</p>
                </div>

                <div className="guideline-step card">
                  <h3>2. Originality Requirement</h3>
                  <p>All submitted manuscripts must be original and free from plagiarism. They should not be under simultaneous review by any other publication. Authors are expected to uphold the highest standards of academic integrity.</p>
                </div>

                <div className="guideline-step card">
                  <h3>3. Cover Page Format</h3>
                  <p>A separate cover page must accompany each manuscript and include the following details:</p>
                  <ul>
                    <li>Article title</li>
                    <li>Full names of all authors</li>
                    <li>Institutional affiliations</li>
                    <li>Contact information (postal address, email, phone number)</li>
                  </ul>
                  <div className="notice-box notice-warning">
                    <strong>Note:</strong> Author information must appear only on the cover page and not within the main manuscript to ensure anonymity during the double-blind review process.
                  </div>
                </div>

                <div className="guideline-step card">
                  <h3>4. Manuscript Structure</h3>
                  <p>The main manuscript (excluding the cover page) should be structured as follows:</p>
                  <ul>
                    <li><strong>Title</strong> (without author details)</li>
                    <li><strong>Abstract:</strong> 150–200 words summarizing the research purpose, methodology, key findings, and implications</li>
                    <li><strong>Keywords:</strong> 5–6 relevant keywords</li>
                    <li><strong>Main Text:</strong> 4000–6000 words (excluding references and annexures)</li>
                  </ul>
                  <p className="structure-heading">Suggested Sections:</p>
                  <div className="structure-flow">
                    {['Introduction', 'Literature Review', 'Methodology', 'Results & Discussion', 'Managerial & Theoretical Implications', 'Conclusion', 'References', 'Annexures'].map((sec, i) => (
                      <span key={i} className="structure-sec-tag">{sec}</span>
                    ))}
                  </div>
                </div>

                <div className="guideline-step card">
                  <h3>5. Formatting Guidelines</h3>
                  <table className="info-table formatting-table">
                    <thead>
                      <tr>
                        <th>Element</th>
                        <th>Formatting Rule</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>File Format</td>
                        <td>Microsoft Word (.doc / .docx)</td>
                      </tr>
                      <tr>
                        <td>Font</td>
                        <td>Times New Roman</td>
                      </tr>
                      <tr>
                        <td>Line Spacing</td>
                        <td>1.5</td>
                      </tr>
                      <tr>
                        <td>Title</td>
                        <td>14-point bold</td>
                      </tr>
                      <tr>
                        <td>Headings</td>
                        <td>12-point bold</td>
                      </tr>
                      <tr>
                        <td>Subheadings</td>
                        <td>11-point italics</td>
                      </tr>
                      <tr>
                        <td>Body Text</td>
                        <td>11-point regular</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="guideline-step card">
                  <h3>6. Tables and Figures</h3>
                  <p>All tables and figures must be:</p>
                  <ul>
                    <li>Sequentially numbered (e.g., Table 1, Figure 1)</li>
                    <li>Clearly labelled with appropriate titles</li>
                    <li>Sources, if applicable, must be cited at the bottom of each table/figure</li>
                  </ul>
                </div>

                <div className="guideline-step card">
                  <h3>7. Referencing Style</h3>
                  <p>All citations and references must follow the latest edition of the <strong>APA (American Psychological Association) style</strong>. Ensure accuracy and completeness in all references.</p>
                </div>

                <div className="guideline-step card">
                  <h3>8. Peer Review & Decision</h3>
                  <p>All submissions undergo a double-blind peer review process. Based on reviewer feedback, manuscripts may be Accepted, Accepted with minor/major revisions, or Rejected.</p>
                </div>

                <div className="guideline-step card">
                  <h3>9. Editorial Assessment</h3>
                  <p>All manuscripts are initially assessed by the editorial team for their relevance, quality, and alignment with the journal’s aims and scope. Submissions that do not meet the required standards may be desk-rejected without external review.</p>
                </div>

                <div className="guideline-step card">
                  <h3>10. Ethical and Legal Responsibilities</h3>
                  <ul>
                    <li>Authors must obtain ethical clearance where applicable and follow the research ethics policies of their respective institutions and countries.</li>
                    <li>Authors must secure permissions for any third-party content (images, datasets, copyrighted material) included in the manuscript.</li>
                    <li>All listed authors must consent to authorship and the submission of the manuscript.</li>
                  </ul>
                </div>

                <div className="guideline-step card">
                  <h3>11. Copyright</h3>
                  <p>A Copyright Transfer Form is not required at the time of initial submission. It must be submitted only after the manuscript is accepted for publication.</p>
                </div>

              </div>
            </div>
          )}

          {activeTab === 'ethics' && (
            <div className="tab-panel animate-fade-in-up">
              <h2 className="section-title">Publication Ethics and Author Responsibilities</h2>
              <p className="ethics-intro">Authors submitting to the Hallmark Business and Management Review (HBMR) are expected to adhere to the highest standards of ethical conduct in research and publication. The following guidelines must be strictly observed:</p>
              
              <div className="ethics-grid-layout">
                <div className="ethics-card card">
                  <div className="ethics-icon-small">🛡️</div>
                  <h4>Maintain Research Integrity</h4>
                  <p>Authors must ensure that all data presented in the manuscript are accurate, reliable, and have not been fabricated, manipulated, or altered inappropriately.</p>
                </div>

                <div className="ethics-card card">
                  <div className="ethics-icon-small">🔍</div>
                  <h4>Avoid Plagiarism</h4>
                  <p>Authors must refrain from any form of plagiarism, including self-plagiarism. Proper acknowledgment and citation of others’ work is mandatory.</p>
                </div>

                <div className="ethics-card card">
                  <div className="ethics-icon-small">📋</div>
                  <h4>Authorship Clarity</h4>
                  <p>The order of authorship should be agreed upon by all contributors before manuscript preparation begins. Disputes regarding authorship must be resolved prior to submission.</p>
                </div>

                <div className="ethics-card card">
                  <div className="ethics-icon-small">📢</div>
                  <h4>Disclosure of Prior Dissemination</h4>
                  <p>Authors must clearly state whether the work has been previously published, presented, or submitted elsewhere.</p>
                </div>

                <div className="ethics-card card">
                  <div className="ethics-icon-small">🤝</div>
                  <h4>Declaration of Conflict of Interest</h4>
                  <p>All authors are required to disclose any financial or non-financial conflicts of interest that may influence the interpretation of their research.</p>
                </div>

                <div className="ethics-card card">
                  <div className="ethics-icon-small">🚫</div>
                  <h4>Prohibit Unethical Authorship</h4>
                  <p>Ghost authorship (uncredited contributors), gift authorship (non-contributors listed), and guest authorship (individuals added for prestige) are strictly prohibited.</p>
                </div>

                <div className="ethics-card card">
                  <div className="ethics-icon-small">🔒</div>
                  <h4>Single Submission Rule</h4>
                  <p>Manuscripts must not be submitted to multiple journals simultaneously. Authors must await a decision from HBMR before submitting the same work elsewhere.</p>
                </div>

                <div className="ethics-card card">
                  <div className="ethics-icon-small">👤</div>
                  <h4>Content Accountability</h4>
                  <p>Each author should accept direct responsibility for the integrity and accuracy of the parts of the manuscript they contributed to.</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'copyright' && (
            <div className="tab-panel animate-fade-in-up">
              <h2 className="section-title">Copyright Notice</h2>
              
              <div className="copyright-banner card">
                <div className="copyright-banner-flex">
                  <div className="copyright-banner-text">
                    <h3>Copyright Assignment & Agreement</h3>
                    <p>Upon acceptance of your article for publication in HBMR, each contributing author is required to complete and sign the Copyright Assignment Agreement.</p>
                  </div>
                  <a href="#download" className="btn btn-gold copyright-download-btn" onClick={(e) => { e.preventDefault(); alert('Copyright Assignment Form download placeholder'); }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                    Download Assignment Form
                  </a>
                </div>
              </div>

              <div className="copyright-details-grid">
                <div className="copyright-block card">
                  <h3>Purpose of Copyright Assignment</h3>
                  <p>The assignment of copyright enables Hallmark Business and Management Review (HBMR) to:</p>
                  <ul>
                    <li>Ensure legal protection against copyright infringement.</li>
                    <li>Facilitate broad distribution and accessibility of published articles through various platforms and media formats.</li>
                  </ul>
                </div>

                <div className="copyright-block card">
                  <h3>Assignment of Rights</h3>
                  <p>Upon formal acceptance, the Author(s) assign and transfer all copyrights of the article (including its abstract) to HBMR. This includes the exclusive right to publish, reproduce, distribute, and archive the article in any format or medium, and the right to license these rights to third parties.</p>
                </div>

                <div className="copyright-block card">
                  <h3>Author Retained Rights</h3>
                  <p>Notwithstanding the transfer, authors retain the rights to:</p>
                  <ul>
                    <li>All proprietary rights other than copyright, such as patent rights.</li>
                    <li>The right to reuse all or part of the article—including figures and tables—in future works (e.g., books, conference presentations), with proper citation.</li>
                    <li>The right to make and distribute copies for personal, educational, or institutional use, provided copies are not sold for profit.</li>
                  </ul>
                </div>

                <div className="copyright-block card">
                  <h3>Legal, Ethical & Liability Terms</h3>
                  <ul>
                    <li><strong>Compliance:</strong> Author(s) affirm the article is original, does not infringe on third-party copyrights, is factually accurate, and contains no defamatory content.</li>
                    <li><strong>Financial Interests:</strong> Certified disclosure of any financial or commercial interests.</li>
                    <li><strong>Plagiarism:</strong> Authors bear full responsibility for ensuring the manuscript is free from plagiarism. The journal is not liable for plagiarized content.</li>
                    <li><strong>Limitation of Liability:</strong> The Journal, its editors, and board members are not responsible for any harm or loss resulting from the application of materials published in the Journal.</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'peer-review' && (
            <div className="tab-panel animate-fade-in-up">
              <h2 className="section-title">Peer Review Process</h2>
              <p className="review-intro">HBMR employs a rigorous double-blind peer review process to uphold the highest standards of academic integrity, objectivity, and scholarly excellence.</p>
              
              <div className="timeline-container">
                {reviewSteps.map((step, idx) => (
                  <div key={idx} className="timeline-item">
                    <div className="timeline-badge-wrap">
                      <div className="timeline-badge">{step.step}</div>
                    </div>
                    <div className="timeline-panel card">
                      <h4 className="timeline-title">{step.title}</h4>
                      <p className="timeline-desc">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'plagiarism' && (
            <div className="tab-panel animate-fade-in-up">
              <h2 className="section-title">Plagiarism Policy</h2>
              
              <div className="notice-box notice-error plagiarism-threshold-box">
                <h3>Strict Plagiarism Threshold: Less than 15%</h3>
                <p>The journal enforces a similarity limit of less than 15%, excluding references, direct quotations, and commonly used academic phrases.</p>
              </div>

              <div className="plagiarism-details card">
                <h3>Plagiarism Detection Process</h3>
                <p>All submissions are subjected to screening using advanced plagiarism detection tools. The editorial team reviews reports to identify any ethical violations. The following forms of plagiarism are strictly prohibited:</p>
                
                <ul className="plagiarism-types">
                  <li><strong>Direct Plagiarism:</strong> Copying text word-for-word from a source without proper citation.</li>
                  <li><strong>Self-Plagiarism:</strong> Reusing substantial parts of one’s previously published work without disclosure or citation.</li>
                  <li><strong>Mosaic Plagiarism:</strong> Piecing together content from various sources without proper attribution, even if rephrased.</li>
                  <li><strong>Improper Citation:</strong> Quoting or paraphrasing from sources without appropriate referencing or acknowledgment.</li>
                </ul>

                <h3 style={{marginTop: 'var(--space-lg)'}}>Consequences of Plagiarism</h3>
                <ul>
                  <li>Manuscripts with <strong>15% to 25% similarity</strong> will be returned to authors for immediate correction and resubmission.</li>
                  <li>Manuscripts with <strong>more than 25% similarity</strong> will be automatically rejected.</li>
                  <li>Authors found guilty of repeated plagiarism may be blacklisted and barred from submitting to the journal in the future.</li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'fees' && (
            <div className="tab-panel animate-fade-in-up">
              <h2 className="section-title">Publication Fees</h2>
              
              <div className="fee-card-highlight card">
                <div className="fee-badge-green">FREE</div>
                <h2>No Publication Charges</h2>
                <p className="fee-main-text">
                  To support inclusive knowledge dissemination and encourage academic participation globally, <strong>the journal currently operates on a no-fee policy</strong>.
                </p>
                <div className="fee-grid-list">
                  <div className="fee-grid-item">
                    <span className="fee-check-icon">✓</span>
                    <div>
                      <strong>Manuscript Submission</strong>
                      <p>No fees required to submit your article for consideration.</p>
                    </div>
                  </div>
                  <div className="fee-grid-item">
                    <span className="fee-check-icon">✓</span>
                    <div>
                      <strong>Peer Review & Processing</strong>
                      <p>No cost associated with double-blind review and editorial formatting.</p>
                    </div>
                  </div>
                  <div className="fee-grid-item">
                    <span className="fee-check-icon">✓</span>
                    <div>
                      <strong>Open Access & Publication</strong>
                      <p>All accepted articles are published and accessible online completely free.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="notice-box notice-warning" style={{marginTop: 'var(--space-xl)'}}>
                <h3>Future Fee Policy Note</h3>
                <p>
                  While we are proud to offer fee-free publication at present, Hallmark Business and Management Review reserves the right to introduce a publication fee structure in the future to support operational sustainability. Any changes will be announced in a transparent manner well in advance.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}

export default function Publish() {
  return (
    <Suspense fallback={<div style={{ padding: '2rem', textAlign: 'center' }}>Loading Publish Info...</div>}>
      <PublishContent />
    </Suspense>
  )
}
