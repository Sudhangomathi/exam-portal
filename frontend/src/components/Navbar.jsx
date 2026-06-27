import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

function Navbar({ user, onLogout, theme, setTheme }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);

  // Close dropdown on click outside
  useEffect(() => {
    const closeDropdown = () => setIsDropdownOpen(false);
    if (isDropdownOpen) {
      window.addEventListener('click', closeDropdown);
    }
    return () => window.removeEventListener('click', closeDropdown);
  }, [isDropdownOpen]);

  return (
    <>
      {/* Official Government Top Bar */}
      <div className="gov-top-bar">
        <div className="gov-top-bar-left">
          <span>GOVERNMENT OF INDIA</span>
          <span style={{ opacity: 0.7, fontSize: '0.68rem' }} className="hide-on-mobile">
            MINISTRY OF EDUCATION
          </span>
        </div>
        <div className="gov-top-bar-right">
          <a href="#main-content" className="gov-top-bar-link">Skip to main content</a>
          <span>|</span>
          <span className="gov-top-bar-link">Accessibility Options</span>
          <span>|</span>
          <span className="gov-top-bar-link" style={{ fontWeight: 700 }}>English</span>
        </div>
      </div>

      <nav className="navbar">
        <Link to="/" style={{ textDecoration: 'none' }}>
          <div className="gov-brand-container">
            <img 
              src="https://upload.wikimedia.org/wikipedia/commons/5/55/Emblem_of_India.svg" 
              alt="Emblem of India" 
              className="gov-brand-emblem-small"
            />
            <div className="gov-brand-text">
              <span className="gov-brand-title-main">National Exams Portal</span>
              <span className="gov-brand-title-sub">Government of India</span>
            </div>
          </div>
        </Link>

        <div className="navbar-right-container">
          {/* Profile Face Avatar */}
          <div 
            className="profile-avatar-wrapper" 
            onClick={(e) => {
              e.stopPropagation();
              setIsDropdownOpen(!isDropdownOpen);
            }}
            title="View Profile & Settings"
          >
            {user?.username ? user.username[0].toUpperCase() : 'U'}
          </div>

          {/* Settings Dropdown Menu */}
          {isDropdownOpen && (
            <div className="profile-dropdown-menu" onClick={(e) => e.stopPropagation()}>
              <div className="dropdown-user-header">
                <div className="dropdown-user-name">Hi, {user?.username}</div>
                <div className="dropdown-user-role">
                  {user?.role === 'ADMIN' ? '🛡️ Portal Administrator' : '🎓 Candidate / Technical Graduate'}
                </div>
              </div>

              {user?.role === 'ADMIN' && (
                <>
                  <div className="dropdown-section-title">Navigation</div>
                  <Link 
                    to="/dashboard" 
                    className="dropdown-item"
                    onClick={() => setIsDropdownOpen(false)}
                    style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}
                  >
                    📊 Admin Dashboard
                  </Link>
                </>
              )}
              
              <div className="dropdown-section-title">Theme Settings</div>
              <div className="dropdown-theme-toggle-row">
                <button 
                  className={`theme-option-btn ${theme === 'light' ? 'active' : ''}`}
                  onClick={() => setTheme('light')}
                >
                  ☀️ Light
                </button>
                <button 
                  className={`theme-option-btn ${theme === 'dark' ? 'active' : ''}`}
                  onClick={() => setTheme('dark')}
                >
                  🌙 Dark
                </button>
              </div>

              <div className="dropdown-section-title">General</div>
              <button 
                className="dropdown-item" 
                onClick={() => {
                  setIsHelpOpen(true);
                  setIsDropdownOpen(false);
                }}
              >
                ❓ Help & FAQs
              </button>
              <button 
                className="dropdown-item" 
                onClick={() => {
                  setIsAboutOpen(true);
                  setIsDropdownOpen(false);
                }}
              >
                ℹ️ About Portal
              </button>
              
              <div className="dropdown-divider"></div>
              <button 
                className="dropdown-item" 
                style={{ color: '#ef4444' }} 
                onClick={onLogout}
              >
                📤 Logout
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* Help Modal */}
      {isHelpOpen && (
        <div className="gov-modal-overlay" onClick={() => setIsHelpOpen(false)}>
          <div className="gov-modal-container" onClick={(e) => e.stopPropagation()}>
            <button className="gov-modal-close-btn" onClick={() => setIsHelpOpen(false)}>×</button>
            <h3 className="gov-modal-title">❓ Help & Portal Guide</h3>
            <div className="gov-modal-divider"></div>
            
            <div className="gov-modal-section">
              <div className="gov-modal-section-title">Overview</div>
              <p className="gov-modal-text">
                This portal lists engineering departments and compiles corresponding central government and PSU examinations. Select your graduating discipline on the home page to view tailored opportunities.
              </p>
            </div>

            <div className="gov-modal-section">
              <div className="gov-modal-section-title">Frequently Asked Questions</div>
              <ul className="gov-modal-list">
                <li>
                  <strong>Q: How do I apply for PSU recruitments?</strong>
                  <br />
                  A: Most major PSUs recruit engineering candidates directly using their Graduate Aptitude Test in Engineering (GATE) scores. Check the specific exam page details to learn more.
                </li>
                <li>
                  <strong>Q: What is UPSC ESE/IES?</strong>
                  <br />
                  A: The Engineering Services Examination (ESE), also known as the Indian Engineering Services (IES), is conducted annually by UPSC for recruitment into technical officer roles under the Government of India.
                </li>
              </ul>
            </div>

            <div className="gov-modal-section">
              <div className="gov-modal-section-title">Technical Support & Contact</div>
              <p className="gov-modal-text">
                For portal related issues or queries, please reach out to the helpdesk at <strong>support-examportal@nic.in</strong> or call the toll-free number: <strong>1800-11-4040</strong>.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* About Modal */}
      {isAboutOpen && (
        <div className="gov-modal-overlay" onClick={() => setIsAboutOpen(false)}>
          <div className="gov-modal-container" onClick={(e) => e.stopPropagation()}>
            <button className="gov-modal-close-btn" onClick={() => setIsAboutOpen(false)}>×</button>
            <h3 className="gov-modal-title">ℹ️ About the Portal</h3>
            <div className="gov-modal-divider"></div>
            
            <div className="gov-modal-section">
              <p className="gov-modal-text">
                The <strong>National Engineering Exam Portal</strong> is an official initiative of the Ministry of Education, Government of India. The project aims to consolidate, structure, and display all central and state-level engineering exam vacancies, making it simple for engineering graduates to map their education directly to public sector opportunities.
              </p>
            </div>

            <div className="gov-modal-section">
              <div className="gov-modal-section-title">Key Recruitment Bodies Integrated:</div>
              <ul className="gov-modal-list">
                <li>Union Public Service Commission (UPSC ESE)</li>
                <li>Graduate Aptitude Test in Engineering (GATE Board)</li>
                <li>Staff Selection Commission (SSC JE)</li>
                <li>Public Sector Undertakings (ONGC, IOCL, NTPC, BHEL, etc.)</li>
                <li>Research organizations (ISRO, DRDO, BARC)</li>
              </ul>
            </div>

            <div className="gov-modal-section">
              <div className="gov-modal-section-title">Credits & Version:</div>
              <p className="gov-modal-text">
                Developed and Hosted by the <strong>National Informatics Centre (NIC)</strong>.
                <br />
                Version: 1.2.0 (Official Build)
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Navbar;
