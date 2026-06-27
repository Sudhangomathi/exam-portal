import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

function Home({ user }) {
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const response = await axios.get('/api/branches');
        setBranches(response.data);
      } catch (error) {
        console.error("Error fetching branches for landing page", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBranches();
  }, []);

  const totalBranchesCount = branches.length || 6;
  const totalUniqueExams = branches.length ? new Set(
    branches.flatMap(b => (b.exams || []).map(e => e.name))
  ).size : 12;

  const totalUniqueBodies = branches.length ? new Set(
    branches.flatMap(b => (b.exams || []).map(e => e.conductingBody))
  ).size : 8;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Public Header visible only to logged-out users */}
      {!user && (
        <header className="navbar" style={{ position: 'static', marginBottom: '1rem', width: '100%' }}>
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
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <Link to="/login" className="btn btn-navy" style={{ padding: '0.55rem 1.2rem', fontSize: '0.9rem', textDecoration: 'none' }}>
              Sign In
            </Link>
          </div>
        </header>
      )}

      {/* Announcements Marquee Strip */}
      <div className="announcement-ticker" style={{ borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
        <div className="ticker-label">🔔 ANNOUNCEMENTS</div>
        <div className="ticker-content">
          <marquee behavior="scroll" direction="left" scrollamount="4">
            <span className="ticker-item">
              <span className="ticker-badge">NEW</span> 
              GATE 2026 Registration Portal is now active. Technical Graduates must register before the last date.
            </span>
            <span className="ticker-item">
              <span className="ticker-badge">UPDATED</span> 
              UPSC Engineering Services Examination (ESE/IES) 2026 preliminary syllabus and dates released.
            </span>
            <span className="ticker-item">
              <span className="ticker-badge">INFO</span> 
              NTPC & ONGC invite executive applications for Graduate Engineer Trainees through GATE-2026.
            </span>
          </marquee>
        </div>
      </div>

      {/* Gov Portal Banner & Hero */}
      <div className="gov-hero" style={{ padding: '4rem 2rem', borderTop: 'none' }}>
        <img 
          src="https://upload.wikimedia.org/wikipedia/commons/5/55/Emblem_of_India.svg" 
          alt="Emblem of India" 
          className="gov-hero-emblem"
          style={{ height: '110px', marginBottom: '2rem' }}
        />
        <h1 className="gov-hero-title" style={{ fontSize: '2.8rem', fontWeight: 800, marginBottom: '1.2rem' }}>
          National Engineering Exam Portal
        </h1>
        <p className="gov-hero-subtitle" style={{ fontSize: '1.25rem', marginBottom: '2.5rem', maxWidth: '850px' }}>
          An official Digital India initiative mapping engineering academic disciplines to various Union Public Service commissions, state-level commissions, and Public Sector Undertakings (PSUs) recruitment examinations.
        </p>

        <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', marginBottom: '3.5rem', flexWrap: 'wrap' }}>
          {user ? (
            <>
              <button onClick={() => navigate('/branches')} className="btn btn-primary" style={{ padding: '0.9rem 2.2rem', fontSize: '1.1rem' }}>
                Browse Departments ➔
              </button>
              {user.role === 'ADMIN' && (
                <button onClick={() => navigate('/dashboard')} className="btn btn-navy" style={{ padding: '0.9rem 2.2rem', fontSize: '1.1rem' }}>
                  Go to Dashboard
                </button>
              )}
            </>
          ) : (
            <>
              <button onClick={() => navigate('/login')} className="btn btn-primary" style={{ padding: '0.9rem 2.2rem', fontSize: '1.1rem' }}>
                Access Portal / Login ➔
              </button>
            </>
          )}
        </div>

        {/* Dashboard Statistics Grid */}
        <div className="gov-stats-grid" style={{ maxWidth: '800px' }}>
          <div className="gov-stat-card" style={{ padding: '1.5rem' }}>
            <span className="gov-stat-number">{totalBranchesCount}</span>
            <span className="gov-stat-label">Departments</span>
          </div>
          <div className="gov-stat-card" style={{ padding: '1.5rem' }}>
            <span className="gov-stat-number">{totalUniqueExams}</span>
            <span className="gov-stat-label">PSU & Govt Exams</span>
          </div>
          <div className="gov-stat-card" style={{ padding: '1.5rem' }}>
            <span className="gov-stat-number">{totalUniqueBodies}</span>
            <span className="gov-stat-label">Recruiting Bodies</span>
          </div>
        </div>
      </div>

      {/* Key Portal Features */}
      <div style={{ margin: '3rem 0' }}>
        <h2 style={{ textAlign: 'center', color: 'var(--navy)', fontSize: '2.2rem', marginBottom: '2.5rem' }}>
          Key Features & Portal Integration
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
          <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', borderBottom: 'none' }}>
            <div style={{ fontSize: '2.5rem' }}>📁</div>
            <h3 style={{ color: 'var(--navy)', fontSize: '1.4rem', marginTop: 0 }}>Departmental Mapping</h3>
            <p style={{ color: 'var(--text-color)', opacity: 0.85, lineHeight: '1.6', fontSize: '0.95rem' }}>
              Directly map your graduating branch (Computer Science, Electrical, Mechanical, Civil, ECE, etc.) to corresponding public sector careers.
            </p>
          </div>

          <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', borderBottom: 'none' }}>
            <div style={{ fontSize: '2.5rem' }}>🏛️</div>
            <h3 style={{ color: 'var(--navy)', fontSize: '1.4rem', marginTop: 0 }}>Recruitment Aggregator</h3>
            <p style={{ color: 'var(--text-color)', opacity: 0.85, lineHeight: '1.6', fontSize: '0.95rem' }}>
              Consolidated details of major central recruitments including UPSC Engineering Services (ESE), GATE, SSC Junior Engineer, and state-level exams.
            </p>
          </div>

          <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', borderBottom: 'none' }}>
            <div style={{ fontSize: '2.5rem' }}>🏢</div>
            <h3 style={{ color: 'var(--navy)', fontSize: '1.4rem', marginTop: 0 }}>PSU Career Pathways</h3>
            <p style={{ color: 'var(--text-color)', opacity: 0.85, lineHeight: '1.6', fontSize: '0.95rem' }}>
              Stay updated on direct recruitment vacancies in leading Maharatna and Navratna PSUs (ONGC, IOCL, NTPC, BHEL) based on graduate qualifications.
            </p>
          </div>

          <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', borderBottom: 'none' }}>
            <div style={{ fontSize: '2.5rem' }}>📹</div>
            <h3 style={{ color: 'var(--navy)', fontSize: '1.4rem', marginTop: 0 }}>Preparation Resources</h3>
            <p style={{ color: 'var(--text-color)', opacity: 0.85, lineHeight: '1.6', fontSize: '0.95rem' }}>
              Access curated high-quality preparation videos, syllabus breakdowns, and guidance sessions tailored specifically to each examination.
            </p>
          </div>
        </div>
      </div>

      {/* Official Gov Footer */}
      <footer style={{ 
        marginTop: '4rem', 
        borderTop: '2px solid var(--navy)', 
        paddingTop: '2.5rem', 
        paddingBottom: '2.5rem', 
        color: 'var(--text-color)', 
        textAlign: 'center', 
        fontSize: '0.9rem',
        opacity: 0.95
      }}>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginBottom: '15px', flexWrap: 'wrap' }}>
          <a href="#policies" onClick={(e) => { e.preventDefault(); alert("National Portal Policies: This portal complies with the Guidelines for Indian Government Websites (GIGW)."); }} style={{ color: 'var(--navy)', fontWeight: '600' }}>Website Policies</a>
          <span>|</span>
          <a href="#help" onClick={(e) => { e.preventDefault(); alert("Helpdesk Email: support-examportal@nic.in\nPhone: 1800-11-4040"); }} style={{ color: 'var(--navy)', fontWeight: '600' }}>Helpdesk</a>
          <span>|</span>
          <a href="#feedback" onClick={(e) => { e.preventDefault(); alert("We value your feedback. Please send comments to feedback-portal@nic.in"); }} style={{ color: 'var(--navy)', fontWeight: '600' }}>Feedback</a>
          <span>|</span>
          <a href="#terms" onClick={(e) => { e.preventDefault(); alert("Terms of Use: Content on this portal is managed by the Ministry of Education."); }} style={{ color: 'var(--navy)', fontWeight: '600' }}>Terms of Use</a>
        </div>
        <div className="gov-brand-container" style={{ justifyContent: 'center', marginBottom: '10px', opacity: 0.8 }}>
          <img 
            src="https://upload.wikimedia.org/wikipedia/commons/5/55/Emblem_of_India.svg" 
            alt="Emblem of India" 
            style={{ height: '35px', filter: 'invert(0.1)' }}
          />
          <span style={{ fontSize: '0.85rem', fontWeight: 'bold' }}>National Informatics Centre</span>
        </div>
        <p style={{ fontSize: '0.85rem', margin: '4px 0' }}>© 2026 National Engineering Exam Portal, Ministry of Education, Government of India.</p>
        <p style={{ fontSize: '0.78rem', color: '#666' }}>Developed and hosted by National Informatics Centre (NIC). Content owned and updated by Ministry of Education.</p>
      </footer>

    </div>
  );
}

export default Home;
