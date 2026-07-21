import { Link } from 'react-router-dom'
import './Layout.css'

const Layout = ({ children, sidebar, breadcrumbs }) => {
  return (
    <div className="page-layout">
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav className="breadcrumbs" aria-label="Breadcrumb">
          <div className="container">
            <ol className="breadcrumb-list">
              {breadcrumbs.map((crumb, index) => (
                <li key={index} className={`breadcrumb-item ${index === breadcrumbs.length - 1 ? 'current' : ''}`}>
                  {index === breadcrumbs.length - 1 ? (
                    <span aria-current="page">{crumb.label}</span>
                  ) : (
                    <>
                      <Link to={crumb.path}>{crumb.label}</Link>
                      <span className="breadcrumb-sep">/</span>
                    </>
                  )}
                </li>
              ))}
            </ol>
          </div>
        </nav>
      )}
      <div className="container">
        <div className={`layout-grid ${sidebar ? 'has-sidebar' : ''}`}>
          <main className="layout-main">
            {children}
          </main>
          {sidebar && (
            <div className="layout-sidebar">
              {sidebar}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Layout
